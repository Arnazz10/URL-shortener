package com.urlshortener.service;

public interface RateLimitService {
    boolean checkRateLimit(String userId);
}
