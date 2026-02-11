package com.urlshortener.service.impl;

import com.urlshortener.dto.response.AnalyticsResponse;
import com.urlshortener.entity.Analytics;
import com.urlshortener.entity.Link;
import com.urlshortener.entity.User;
import com.urlshortener.exception.ResourceNotFoundException;
import com.urlshortener.repository.AnalyticsRepository;
import com.urlshortener.repository.LinkRepository;
import com.urlshortener.service.AnalyticsService;
import com.urlshortener.service.LinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final AnalyticsRepository analyticsRepository;
    private final LinkRepository linkRepository;
    private final LinkService linkService;

    private final RestTemplate restTemplate = new RestTemplate();

    @Async
    @Override
    @Transactional
    public void logClick(String shortCode, String ipAddress, String userAgent, String referer) {
        Link link = linkRepository.findByShortCode(shortCode)
                .or(() -> linkRepository.findByCustomAlias(shortCode))
                .orElse(null);

        if (link == null) {
            return; // Or log error
        }

        // Increment click count on Link (async call)
        linkService.incrementClickCount(link.getId());

        // Parse User Agent
        String deviceType = parseUserAgent(userAgent);
        String browser = parseBrowser(userAgent);

        // Get Country
        String country = getCountryFromIP(ipAddress);

        Analytics analytics = Analytics.builder()
                .link(link)
                .clickedAt(LocalDateTime.now())
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .referer(referer)
                .country(country)
                .deviceType(deviceType)
                .browser(browser)
                .build();

        analyticsRepository.save(analytics);
    }

    private String parseUserAgent(String userAgent) {
        if (userAgent == null)
            return "UNKNOWN";
        userAgent = userAgent.toLowerCase();
        if (userAgent.contains("mobile"))
            return "MOBILE";
        if (userAgent.contains("tablet"))
            return "TABLET";
        return "DESKTOP";
    }

    private String parseBrowser(String userAgent) {
        if (userAgent == null)
            return "UNKNOWN";
        if (userAgent.contains("chrome"))
            return "Chrome";
        if (userAgent.contains("firefox"))
            return "Firefox";
        if (userAgent.contains("safari"))
            return "Safari";
        if (userAgent.contains("edge"))
            return "Edge";
        return "Other";
    }

    private String getCountryFromIP(String ip) {
        if (ip == null || ip.equals("127.0.0.1") || ip.equals("0:0:0:0:0:0:0:1"))
            return "Local";
        try {
            // Use ip-api.com free API (http://ip-api.com/json/{ip})
            // returns JSON with country field calling 'country'
            String url = "http://ip-api.com/json/" + ip;
            Map response = restTemplate.getForObject(url, Map.class);
            if (response != null && "success".equals(response.get("status"))) {
                return (String) response.get("country");
            }
        } catch (Exception e) {
            // Ignore error
        }
        return "Unknown";
    }

    @Override
    public AnalyticsResponse getAnalytics(UUID linkId, User user) {
        Link link = linkRepository.findById(linkId)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found"));

        if (!link.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Not authorized");
        }

        List<Analytics> logs = analyticsRepository.findByLinkIdOrderByClickedAtDesc(linkId);

        // Clicks by Date
        Map<String, Long> clicksByDate = logs.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getClickedAt().toLocalDate().toString(),
                        Collectors.counting()));

        // Device Distribution
        Map<String, Long> deviceDistribution = logs.stream()
                .collect(Collectors.groupingBy(Analytics::getDeviceType, Collectors.counting()));

        // Top Countries
        Map<String, Long> countryMap = logs.stream()
                .filter(a -> a.getCountry() != null)
                .collect(Collectors.groupingBy(Analytics::getCountry, Collectors.counting()));

        List<AnalyticsResponse.CountryStat> topCountries = countryMap.entrySet().stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
                .limit(5)
                .map(e -> new AnalyticsResponse.CountryStat(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        // Recent Clicks (last 10)
        List<AnalyticsResponse.ClickDetail> recentClicks = logs.stream()
                .limit(10)
                .map(a -> new AnalyticsResponse.ClickDetail(
                        a.getClickedAt().toString(),
                        a.getIpAddress(),
                        a.getDeviceType(),
                        a.getCountry()))
                .collect(Collectors.toList());

        return AnalyticsResponse.builder()
                .totalClicks(link.getClickCount())
                .clicksByDate(clicksByDate)
                .deviceDistribution(deviceDistribution)
                .topCountries(topCountries)
                .recentClicks(recentClicks)
                .build();
    }
}
