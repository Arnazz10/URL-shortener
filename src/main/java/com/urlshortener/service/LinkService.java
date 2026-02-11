package com.urlshortener.service;

import com.urlshortener.dto.request.CreateLinkRequest;
import com.urlshortener.dto.response.LinkResponse;
import com.urlshortener.entity.User;

import java.util.List;
import java.util.UUID;

public interface LinkService {
    LinkResponse createLink(CreateLinkRequest request, User user);

    String getOriginalUrl(String shortCode); // returns original URL

    List<LinkResponse> getUserLinks(User user);

    LinkResponse updateLink(UUID linkId, CreateLinkRequest request, User user);

    void deleteLink(UUID linkId, User user);

    void incrementClickCount(UUID linkId);
}
