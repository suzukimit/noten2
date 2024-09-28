package com.noten.backend.customcontroller

import com.noten.backend.config.SigninRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.rest.webmvc.RepositoryRestController
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody


@RepositoryRestController
class AuthenticationController {
    @Autowired lateinit var authenticationService:
    @PostMapping("/login")
    fun login(@RequestBody request: SigninRequest): ResponseEntity<JwtAuthenticationResponse> {
        return ResponseEntity.ok(authenticationService.signin(request))
    }
}
