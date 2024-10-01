package com.noten.backend.config

import com.noten.backend.entity.UserRepository
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.authority.AuthorityUtils
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.OncePerRequestFilter
import java.util.Date
import javax.crypto.SecretKey
import kotlin.collections.HashMap

/**
 * via: https://qiita.com/rubytomato@github/items/6c6318c948398fa62275
 */
@EnableWebSecurity
@EnableMethodSecurity
@Configuration
class WebSecurityConfig {
    @Autowired lateinit var userService: LoginUserDetailsService

    @Autowired lateinit var jwtAuthenticationFilter: JwtAuthenticationFilter

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http.authorizeHttpRequests { authorize ->
            authorize
                .requestMatchers("/login", "/signup")
                .permitAll()
                .anyRequest()
                .authenticated()
        }

        http.sessionManagement { session ->
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        }

        http.exceptionHandling { exceptions ->
            // 未認証の状態で認証の必要なAPIにアクセスしたときの処理（401）
            exceptions.authenticationEntryPoint(CustomAuthenticationEntryPoint())
            // 認証済みだが未認可のリソースへアクセスしたときの処理は、accessDeniedHandlerで設定できる。
            // rollが存在しないサービスなので、今回は気にしない。
        }

        http.logout { logout ->
            logout.logoutSuccessHandler(HttpStatusReturningLogoutSuccessHandler())
        }

        http.headers { headers ->
            headers.cacheControl { it.disable() }
        }

        http.csrf { csrf -> csrf.disable() }
        http.cors { cors -> cors.configurationSource(corsConfigurationSource()) }

        http.authenticationProvider(authenticationProvider())

        http.addFilterBefore(
            jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter::class.java,
        )

        return http.build()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun authenticationProvider(): AuthenticationProvider =
        DaoAuthenticationProvider().apply {
            setUserDetailsService(userService)
            setPasswordEncoder(passwordEncoder())
        }

    @Bean
    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager = config.authenticationManager

    /**
     * CORSの設定
     * https://tomokazu-kozuma.com/configure-cors-with-spring-security/
     * https://qiita.com/opengl-8080/items/db0aa1ec0be36886953b
     */
    private fun corsConfigurationSource(): CorsConfigurationSource =
        UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration(
                "/**",
                CorsConfiguration().apply {
                    addAllowedMethod(CorsConfiguration.ALL)
                    addAllowedHeader(CorsConfiguration.ALL)
                    allowCredentials = true
                    addExposedHeader("authorization")
                    // TODO 開発用
                    addAllowedOrigin("http://localhost:4200")
                },
            )
        }

    /**
     * 未認証の状態で認証の必要なAPIにアクセスしたときの処理（401）
     */
    class CustomAuthenticationEntryPoint : AuthenticationEntryPoint {
        override fun commence(
            request: HttpServletRequest,
            response: HttpServletResponse,
            exception: AuthenticationException,
        ) {
            if (response.isCommitted) {
                return
            }
            response.sendError(HttpStatus.UNAUTHORIZED.value(), HttpStatus.UNAUTHORIZED.reasonPhrase)
        }
    }
}

data object SecurityConstants {
    val TOKEN_PREFIX = "Bearer "
    val HEADER_STRING = "Authorization"
}

@Component
class LoginUserDetailsService : UserDetailsService {
    @Autowired
    lateinit var userRepository: UserRepository

    override fun loadUserByUsername(username: String?): UserDetails {
        userRepository.findByEmail(username ?: "")?.let {
            return org.springframework.security.core.userdetails.User(
                it.email,
                it.password,
                AuthorityUtils.createAuthorityList("ROLE_USER"),
            )
        } ?: throw UsernameNotFoundException("username: $username not found")
    }
}

interface JwtService {
    fun extractUserName(token: String): String

    fun generateToken(userDetails: UserDetails): String

    fun isTokenValid(
        token: String,
        userDetails: UserDetails,
    ): Boolean
}

@Service
class JwtServiceImpl : JwtService {
    @Autowired lateinit var notenProperties: NotenProperties

    override fun extractUserName(token: String): String = extractClaim(token) { obj: Claims -> obj.subject }

    override fun generateToken(userDetails: UserDetails): String = generateToken(HashMap(), userDetails)

    override fun isTokenValid(
        token: String,
        userDetails: UserDetails,
    ): Boolean {
        val userName = extractUserName(token)
        return (userName == userDetails.username) && !isTokenExpired(token)
    }

    private fun <T> extractClaim(
        token: String,
        claimsResolvers: (Claims) -> T,
    ): T {
        val claims = extractAllClaims(token)
        return claimsResolvers(claims)
    }

    private fun generateToken(
        extraClaims: Map<String, Any>,
        userDetails: UserDetails,
    ): String =
        Jwts
            .builder()
            .claims(extraClaims)
            .subject(userDetails.username)
            .issuedAt(Date(System.currentTimeMillis()))
            .expiration(Date(System.currentTimeMillis() + 1000 * 60 * 24))
            .signWith(signingKey, Jwts.SIG.HS256)
            .compact()

    private fun isTokenExpired(token: String): Boolean = extractExpiration(token).before(Date())

    private fun extractExpiration(token: String): Date = extractClaim(token) { obj: Claims -> obj.expiration }

    private fun extractAllClaims(token: String): Claims =
        Jwts
            .parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .payload

    private val signingKey: SecretKey
        get() {
            val keyBytes: ByteArray = Decoders.BASE64.decode(notenProperties.security.secret)
            return Keys.hmacShaKeyFor(keyBytes)
        }
}

@Component
class JwtAuthenticationFilter : OncePerRequestFilter() {
    @Autowired lateinit var jwtService: JwtService

    @Autowired lateinit var userDetailsService: UserDetailsService

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        // TODO SecurityFilterChain で permitAll しているが、なぜか効いてないので再度チェックしている。。
        val requestPath = request.requestURI
        if (requestPath == "/login" || requestPath == "/signup") {
            filterChain.doFilter(request, response)
            return
        }

        val authHeader = request.getHeader(SecurityConstants.HEADER_STRING)
        val userEmail: String
        if (authHeader.isEmpty() || !authHeader.startsWith(SecurityConstants.TOKEN_PREFIX)) {
            filterChain.doFilter(request, response)
            return
        }
        val jwt = authHeader.substring(SecurityConstants.TOKEN_PREFIX.length)
        userEmail = jwtService.extractUserName(jwt)
        if (userEmail.isNotEmpty() &&
            SecurityContextHolder.getContext().authentication == null
        ) {
            val userDetails: UserDetails = userDetailsService.loadUserByUsername(userEmail)
            if (jwtService.isTokenValid(jwt, userDetails)) {
                val context = SecurityContextHolder.createEmptyContext()
                val authToken =
                    UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.authorities,
                    )
                authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                context.authentication = authToken
                SecurityContextHolder.setContext(context)
            }
        }
        filterChain.doFilter(request, response)
    }
}

data class JwtAuthenticationToken(
    val value: String,
)

data class SignupRequest(
    val email: String,
    val password: String,
)

data class SigninRequest(
    val username: String,
    val password: String,
)

interface AuthenticationService {
    fun signup(request: SignupRequest): JwtAuthenticationToken

    fun signin(request: SigninRequest): JwtAuthenticationToken
}

@Service
class AuthenticationServiceImpl : AuthenticationService {
    @Autowired lateinit var userRepository: UserRepository

    @Autowired lateinit var jwtService: JwtService

    @Autowired lateinit var authenticationManager: AuthenticationManager

    override fun signup(request: SignupRequest): JwtAuthenticationToken {
        TODO()
    }

    override fun signin(request: SigninRequest): JwtAuthenticationToken {
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.username, request.password),
        )
        val user =
            userRepository.findByEmail(request.username)?.let {
                org.springframework.security.core.userdetails.User(
                    it.email,
                    it.password,
                    AuthorityUtils.createAuthorityList("ROLE_USER"),
                )
            } ?: throw UsernameNotFoundException("username: ${request.username} not found")

        val jwt = jwtService.generateToken(user)
        return JwtAuthenticationToken(jwt)
    }
}
