package com.urlshortener.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync
// If we were configuring TaskExecutor manually, we would do it here.
// But Spring Boot autoconfigures it based on properties.
// So this class is primarily to enable async processing.
public class AsyncConfig {
}
