package com.noten.api.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "noten")
class NotenProperties {
    var security = SecurityProperties()
    class SecurityProperties {
        var secret = "noten"
        var expirationTimeMsec = 7200000L
    }
}