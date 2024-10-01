package com.noten.backend.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "noten")
class NotenProperties {
    var security = SecurityProperties()

    class SecurityProperties {
        var secret = "TRZOSpdj36qfC9qmb705kgDtGJHe7jLsC9xw2eLMpvI=" // don't use this in production
        var expirationTimeMsec = 7200000L
    }
}
