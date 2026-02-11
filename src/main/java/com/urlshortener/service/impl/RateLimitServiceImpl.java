package com.urlshortener.service.impl;

import com.urlshortener.service.RateLimitService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RateLimitServiceImpl implements RateLimitService {

    private final StringRedisTemplate redisTemplate;
    private static final String KEY_PREFIX = "rate_limit:";
    private static final int MAX_REQUESTS = 10;

    @Override
    public boolean checkRateLimit(String userId) {
        String key = KEY_PREFIX + userId;
        Long count = redisTemplate.opsForValue().increment(key);

        if (count != null && count == 1) {
            redisTemplate.expire(key, 1, TimeUnit.MINUTES);
        }

        return count != null && count <= MAX_REQUESTS;
    }
}
