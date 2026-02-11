package com.urlshortener.repository;

import com.urlshortener.entity.Analytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AnalyticsRepository extends JpaRepository<Analytics, UUID> {

    List<Analytics> findByLinkIdOrderByClickedAtDesc(UUID linkId);

    // Using JPQL for aggregation

    @Query("SELECT a.deviceType, COUNT(a) FROM Analytics a WHERE a.link.id = :linkId GROUP BY a.deviceType")
    List<Object[]> findDeviceDistributionByLinkId(UUID linkId);

    @Query("SELECT a.country, COUNT(a) FROM Analytics a WHERE a.link.id = :linkId GROUP BY a.country ORDER BY COUNT(a) DESC")
    List<Object[]> findTopCountriesByLinkId(UUID linkId);

    @Query("SELECT FUNCTION('date', a.clickedAt), COUNT(a) FROM Analytics a WHERE a.link.id = :linkId GROUP BY FUNCTION('date', a.clickedAt) ORDER BY FUNCTION('date', a.clickedAt) ASC")
    List<Object[]> findClickCountByDate(UUID linkId);
}
