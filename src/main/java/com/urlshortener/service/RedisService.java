package com.urlshortener.service;

public interface RedisService {
    void cacheUrl(String shortCode, String originalUrl);

    String getCachedUrl(String shortCode);

    void invalidateCache(String shortCode);
}
