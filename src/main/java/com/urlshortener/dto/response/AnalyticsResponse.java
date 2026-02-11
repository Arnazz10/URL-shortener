package com.urlshortener.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    private long totalClicks;
    private Map<String, Long> clicksByDate;
    private Map<String, Long> deviceDistribution;
    private List<CountryStat> topCountries;
    private List<ClickDetail> recentClicks;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CountryStat {
        private String country;
        private long count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClickDetail {
        private String clickedAt;
        private String ipAddress;
        private String deviceType;
        private String country;
    }
}
