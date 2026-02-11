package com.urlshortener.service.impl;

import com.urlshortener.dto.request.CreateLinkRequest;
import com.urlshortener.dto.response.LinkResponse;
import com.urlshortener.entity.Link;
import com.urlshortener.entity.User;
import com.urlshortener.exception.BadRequestException;
import com.urlshortener.exception.ResourceNotFoundException;
import com.urlshortener.repository.LinkRepository;
import com.urlshortener.service.LinkService;
import com.urlshortener.service.QRCodeService;
import com.urlshortener.service.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LinkServiceImpl implements LinkService {

    private final LinkRepository linkRepository;
    private final RedisService redisService;
    private final QRCodeService qrCodeService;

    private static final String ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private final SecureRandom random = new SecureRandom();

    @Override
    @Transactional
    public LinkResponse createLink(CreateLinkRequest request, User user) {
        String shortCode;
        if (request.getCustomAlias() != null && !request.getCustomAlias().isEmpty()) {
            if (linkRepository.existsByCustomAlias(request.getCustomAlias())) {
                throw new BadRequestException("Custom alias already exists");
            }
            shortCode = request.getCustomAlias();
        } else {
            do {
                shortCode = generateShortCode();
            } while (linkRepository.existsByShortCode(shortCode));
        }

        String qrCode = qrCodeService.generateQRCode(request.getOriginalUrl(), 300, 300);

        Link link = Link.builder()
                .originalUrl(request.getOriginalUrl())
                .shortCode(shortCode)
                .customAlias(request.getCustomAlias())
                .user(user)
                .qrCodeBase64(qrCode)
                .password(request.getPassword()) // Should be hashed in real app
                .expiresAt(request.getExpiresAt())
                .isActive(true)
                .clickCount(0L)
                .build();

        Link savedLink = linkRepository.save(link);

        // Cache
        redisService.cacheUrl(shortCode, request.getOriginalUrl());

        return mapToResponse(savedLink);
    }

    @Override
    public String getOriginalUrl(String shortCode) {
        // Check cache
        String cachedUrl = redisService.getCachedUrl(shortCode);
        if (cachedUrl != null) {
            return cachedUrl;
        }

        // Check DB
        Link link = linkRepository.findByShortCode(shortCode)
                .or(() -> linkRepository.findByCustomAlias(shortCode))
                .orElseThrow(() -> new ResourceNotFoundException("Link not found"));

        if (!link.getIsActive()) {
            throw new BadRequestException("Link is inactive");
        }

        if (link.getExpiresAt() != null && link.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Link has expired");
        }

        // Update cache
        redisService.cacheUrl(shortCode, link.getOriginalUrl());

        return link.getOriginalUrl();
    }

    @Override
    public List<LinkResponse> getUserLinks(User user) {
        return linkRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public LinkResponse updateLink(UUID linkId, CreateLinkRequest request, User user) {
        Link link = linkRepository.findById(linkId)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found"));

        if (!link.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized to update this link"); // Should be Forbidden
        }

        link.setOriginalUrl(request.getOriginalUrl());
        link.setCustomAlias(request.getCustomAlias()); // Note: should check uniqueness if changed
        link.setPassword(request.getPassword());
        link.setExpiresAt(request.getExpiresAt());

        // Update QR Code if URL changed? Yes.
        String qrCode = qrCodeService.generateQRCode(request.getOriginalUrl(), 300, 300);
        link.setQrCodeBase64(qrCode);

        Link updatedLink = linkRepository.save(link);

        // Invalidate cache
        redisService.invalidateCache(link.getShortCode());
        if (request.getCustomAlias() != null) {
            redisService.invalidateCache(request.getCustomAlias());
        }

        return mapToResponse(updatedLink);
    }

    @Override
    @Transactional
    public void deleteLink(UUID linkId, User user) {
        Link link = linkRepository.findById(linkId)
                .orElseThrow(() -> new ResourceNotFoundException("Link not found"));

        if (!link.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized");
        }

        linkRepository.delete(link);
        redisService.invalidateCache(link.getShortCode());
    }

    @Async
    @Override
    @Transactional
    public void incrementClickCount(UUID linkId) {
        Link link = linkRepository.findById(linkId).orElse(null);
        if (link != null) {
            link.setClickCount(link.getClickCount() + 1);
            linkRepository.save(link);
        }
    }

    private String generateShortCode() {
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            sb.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }

    private LinkResponse mapToResponse(Link link) {
        // Construct full short URL (using a base URL or just code)
        // Ideally injecting base URL from properties
        String baseUrl = "http://localhost:8080/"; // Default
        return LinkResponse.builder()
                .id(link.getId())
                .originalUrl(link.getOriginalUrl())
                .shortUrl(baseUrl + link.getShortCode())
                .shortCode(link.getShortCode())
                .clickCount(link.getClickCount())
                .qrCodeBase64(link.getQrCodeBase64())
                .createdAt(link.getCreatedAt())
                .expiresAt(link.getExpiresAt())
                .isActive(link.getIsActive())
                .build();
    }
}
