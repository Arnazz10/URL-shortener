package com.urlshortener.service;

public interface QRCodeService {
    String generateQRCode(String url, int width, int height);
}
