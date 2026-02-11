package com.urlshortener.dto.request;

import com.urlshortener.util.validators.ValidUrl;
import jakarta.validation.constraints.Future;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateLinkRequest {

    @ValidUrl
    private String originalUrl;

    // Optional, can be null
    private String customAlias;

    // Optional, can be null
    private String password;

    @Future(message = "Expiration date must be in the future")
    private LocalDateTime expiresAt;
}
