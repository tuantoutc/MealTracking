package com.example.demomealcheck.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "jwt")
@Getter
@Setter
public class JwtProperties {
    private String secret;
    // 5 days = 432,000,000 ms
    private long accessTokenExpiration = 432000000L;
    // 7 days = 604,800,000 ms
    private long refreshTokenExpiration = 604800000L;
}
