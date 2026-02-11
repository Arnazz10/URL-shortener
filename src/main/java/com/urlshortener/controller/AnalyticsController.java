package com.urlshortener.controller;

import com.urlshortener.dto.response.AnalyticsResponse;
import com.urlshortener.entity.User;
import com.urlshortener.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/{linkId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<AnalyticsResponse> getAnalytics(
            @PathVariable UUID linkId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(analyticsService.getAnalytics(linkId, user));
    }
}
