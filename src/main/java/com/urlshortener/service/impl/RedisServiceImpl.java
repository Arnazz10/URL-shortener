package com.urlshortener.service.impl;

import com.urlshortener.service.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisServiceImpl implements RedisService {

    private final StringRedisTemplate redisTemplate;

    // Key prefix to avoid collisions if any
    private static final String KEY_PREFIX = "link:";

    @Override
    public void cacheUrl(String shortCode, String originalUrl) {
        redisTemplate.opsForValue().set(KEY_PREFIX + shortCode, originalUrl, 1, TimeUnit.HOURS);
    }

    @Override
    public String getCachedUrl(String shortCode) {
        return redisTemplate.opsForValue().get(KEY_PREFIX + shortCode);
    }

    @Override
    public void invalidateCache(String shortCode) {
        redisTemplate.delete(KEY_PREFIX + shortCode);
    }
}
