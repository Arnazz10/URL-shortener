package com.urlshortener.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        // For value, we might store Strings (originalUrl) or JSON.
        // Spec says: Cache short_code -> original_url. So String is fine.
        // It also says RateLimit.
        // So StringRedisSerializer for value is good for URL mapping.
        template.setValueSerializer(new StringRedisSerializer());
        return template;
    }
}
