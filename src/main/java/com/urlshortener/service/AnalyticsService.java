package com.urlshortener.service;

import com.urlshortener.dto.response.AnalyticsResponse;
import com.urlshortener.entity.User;

import java.util.UUID;

public interface AnalyticsService {
    void logClick(String shortCode, String ipAddress, String userAgent, String referer);

    AnalyticsResponse getAnalytics(UUID linkId, User user);
}
