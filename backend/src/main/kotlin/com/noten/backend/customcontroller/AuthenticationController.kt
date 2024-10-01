package com.noten.backend.customcontroller

import com.noten.backend.config.AuthenticationService
import com.noten.backend.config.JwtAuthenticationToken
import com.noten.backend.config.SigninRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.rest.webmvc.BasePathAwareController
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody

@BasePathAwareController
class AuthenticationController {
    @Autowired lateinit var authenticationService: AuthenticationService

    @PostMapping("/login")
    fun login(
        @RequestBody request: SigninRequest,
    ): ResponseEntity<JwtAuthenticationToken> = ResponseEntity.ok(authenticationService.signin(request))
}
