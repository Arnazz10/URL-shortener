package com.urlshortener.util.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.apache.commons.validator.routines.UrlValidator;

public class UrlConstraintValidator implements ConstraintValidator<ValidUrl, String> {

    @Override
    public boolean isValid(String url, ConstraintValidatorContext context) {
        if (url == null || url.isEmpty()) {
            return false;
        }
        String[] schemes = { "http", "https" };
        UrlValidator validator = new UrlValidator(schemes);
        return validator.isValid(url);
    }
}
