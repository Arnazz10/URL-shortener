package com.urlshortener.controller;

import com.urlshortener.dto.request.CreateLinkRequest;
import com.urlshortener.dto.response.LinkResponse;
import com.urlshortener.entity.User;
import com.urlshortener.exception.BadRequestException;
import com.urlshortener.service.LinkService;
import com.urlshortener.service.RateLimitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/links")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')") // Wait, ROLE_ prefix is handled by Spring Security?
// Usually hasRole('USER') checks for authority 'ROLE_USER'. In my User entity I
// returned 'ROLE_USER'.
// So hasRole('USER') is correct.
public class LinkController {

    private final LinkService linkService;
    private final RateLimitService rateLimitService;

    @PostMapping
    public ResponseEntity<LinkResponse> createLink(
            @Valid @RequestBody CreateLinkRequest request,
            @AuthenticationPrincipal User user) {
        if (!rateLimitService.checkRateLimit(user.getId().toString())) {
            throw new BadRequestException("Rate limit exceeded. Max 10 links per minute.");
        }
        return ResponseEntity.ok(linkService.createLink(request, user));
    }

    @GetMapping
    public ResponseEntity<List<LinkResponse>> getUserLinks(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(linkService.getUserLinks(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LinkResponse> updateLink(
            @PathVariable UUID id,
            @Valid @RequestBody CreateLinkRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(linkService.updateLink(id, request, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLink(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        linkService.deleteLink(id, user);
        return ResponseEntity.noContent().build();
    }
}
