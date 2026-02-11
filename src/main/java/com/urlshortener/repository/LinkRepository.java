package com.urlshortener.repository;

import com.urlshortener.entity.Link;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LinkRepository extends JpaRepository<Link, UUID> {

    Optional<Link> findByShortCode(String shortCode);

    Optional<Link> findByCustomAlias(String customAlias);

    List<Link> findByUserIdOrderByCreatedAtDesc(UUID userId);

    boolean existsByShortCode(String shortCode);

    boolean existsByCustomAlias(String customAlias);

    @Query("SELECT COUNT(l) FROM Link l WHERE l.user.id = :userId AND l.isActive = true")
    long countActiveLinksByUserId(UUID userId);
}
