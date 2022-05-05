package com.noten.api.config

import com.fasterxml.jackson.databind.ObjectMapper
import com.noten.api.config.SecurityConstants.HEADER_STRING
import com.noten.api.config.SecurityConstants.TOKEN_PREFIX
import com.noten.api.entity.UserRepository
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.security.SecurityProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.annotation.Order
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.Authentication
import org.springframework.security.core.AuthenticationException
import org.springframework.security.core.authority.AuthorityUtils
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
import org.springframework.security.web.savedrequest.HttpSessionRequestCache
import org.springframework.security.web.savedrequest.RequestCache
import org.springframework.stereotype.Component
import org.springframework.util.StringUtils
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import java.io.IOException
import java.util.*
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse


/**
 * via: https://qiita.com/rubytomato@github/items/6c6318c948398fa62275
 */
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Order(SecurityProperties.BASIC_AUTH_ORDER)
@Configuration
open class WebSecurityConfig : WebSecurityConfigurerAdapter() {

    @Autowired lateinit var userDetailsService: LoginUserDetailsService
    @Autowired lateinit var notenProperties: NotenProperties

    override fun configure(http: HttpSecurity?) {
        http?.let {
                it.authorizeRequests()
                    .antMatchers("/login", "/signup")
                        .permitAll()
                    .anyRequest()
                        .authenticated()
                    .and()
                .addFilter(JWTAuthenticationFilter(authenticationManager(), notenProperties))
                .addFilter(JWTAuthorizationFilter(authenticationManager(), notenProperties))
                .sessionManagement().
                    sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    .and()
                .exceptionHandling()
                    //未認証の状態で認証の必要なAPIにアクセスしたときの処理（401）
                    .authenticationEntryPoint(CustomAuthenticationEntryPoint())
                    //認証済みだが未認可のリソースへアクセスしたときの処理は、accessDeniedHandlerで設定できる。
                    //rollが存在しないサービスなので、今回は気にしない。
                    .and()
                .formLogin()
                    .loginProcessingUrl("/login").permitAll()
                        .usernameParameter("username")
                        .passwordParameter("password")
                    //認証が成功した場合（200）
                    .successHandler(CustomAuthenticationSuccessHandler())
                    //認証が失敗した場合（401）
                    .failureHandler(SimpleUrlAuthenticationFailureHandler())
                    .and()
                .logout()
                    //ログアウトが正常終了した場合（200）
                    .logoutSuccessHandler(HttpStatusReturningLogoutSuccessHandler())
                    .and()
                .headers()
                    .cacheControl().disable()
                    .and()
                .csrf()
                    .disable()
                .cors()
                    .configurationSource(corsConfigurationSource())
        }
    }

    override fun configure(auth: AuthenticationManagerBuilder?) {
        auth?.let {
            it.eraseCredentials(true)
                    .userDetailsService(userDetailsService)
                    .passwordEncoder(passwordEncoder())
        }
        super.configure(auth)
    }

    @Bean
    open fun passwordEncoder() : PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    /**
     * CORSの設定
     * https://tomokazu-kozuma.com/configure-cors-with-spring-security/
     * https://qiita.com/opengl-8080/items/db0aa1ec0be36886953b
     */
    private fun corsConfigurationSource(): CorsConfigurationSource {
        return UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/**", CorsConfiguration().apply {
                addAllowedMethod(CorsConfiguration.ALL)
                addAllowedHeader(CorsConfiguration.ALL)
                allowCredentials = true
                addExposedHeader("authorization")
                // TODO 開発用
                addAllowedOrigin("http://localhost:4200")
            })
        }
    }

    /**
     * 未認証の状態で認証の必要なAPIにアクセスしたときの処理（401）
     */
    class CustomAuthenticationEntryPoint : AuthenticationEntryPoint {
        override fun commence(request: HttpServletRequest,
                              response: HttpServletResponse,
                              exception: AuthenticationException) {
            if (response.isCommitted) {
                return
            }
            response.sendError(HttpStatus.UNAUTHORIZED.value(), HttpStatus.UNAUTHORIZED.reasonPhrase)
        }
    }

    /**
     * 認証が成功した場合（200）
     * TODO requestCache とかって何だっけ？
     */
    class CustomAuthenticationSuccessHandler: SimpleUrlAuthenticationSuccessHandler() {
        private var requestCache: RequestCache = HttpSessionRequestCache()
        override fun onAuthenticationSuccess(request: HttpServletRequest, response: HttpServletResponse, authentication: Authentication) {
            requestCache.getRequest(request, response)?.let {
                if (isAlwaysUseDefaultTargetUrl || (targetUrlParameter != null && StringUtils.hasText(request.getParameter(targetUrlParameter)))) {
                    requestCache.removeRequest(request, response)
                }
            }
            clearAuthenticationAttributes(request)
        }
    }
}

object SecurityConstants {
    val TOKEN_PREFIX = "Bearer "
    val HEADER_STRING = "Authorization"
}

class JWTAuthenticationFilter(val am: AuthenticationManager, val notenProperties: NotenProperties): UsernamePasswordAuthenticationFilter() {

    companion object {
        val logger = LoggerFactory.getLogger(JWTAuthenticationFilter::class.java)
    }
    class User {
        var username: String = ""
        var password: String = ""
    }

    override fun attemptAuthentication(req: HttpServletRequest?, res: HttpServletResponse?): Authentication {
        try {
            val user = ObjectMapper().readValue(req!!.inputStream, User::class.java)
            return am.authenticate(UsernamePasswordAuthenticationToken(user.username, user.password, emptyList()))
        } catch (e: IOException) {
            logger.error(e.message)
            throw RuntimeException(e)
        }
    }

    override fun successfulAuthentication(req: HttpServletRequest?, res: HttpServletResponse?, chain: FilterChain?, auth: Authentication?) {
        val token = Jwts.builder()
                .setSubject((auth!!.principal as org.springframework.security.core.userdetails.User).username)
                .setExpiration(Date(System.currentTimeMillis() + notenProperties.security.expirationTimeMsec))
                .signWith(SignatureAlgorithm.HS512, notenProperties.security.secret.toByteArray())
                .compact()
        res!!.addHeader(HEADER_STRING, TOKEN_PREFIX + token)
        //super.successfulAuthentication(req, res, chain, auth)
    }
}

class JWTAuthorizationFilter(am: AuthenticationManager?, val notenProperties: NotenProperties) : BasicAuthenticationFilter(am) {

    override fun doFilterInternal(req: HttpServletRequest, res: HttpServletResponse, chain: FilterChain) {
        //TODO permitAllでもfilterは常に通る。Authorizationヘッダーが不適切な場合に例外が出るのを避けるため、直書きで回避。
        if (req.requestURI != "/signup") {
            req.getHeader(HEADER_STRING)?.let { token ->
                if (token.startsWith(TOKEN_PREFIX)) {
                    SecurityContextHolder.getContext().authentication = getAuthentication(token)
                }
            }
        }

        chain.doFilter(req, res)
    }

    private fun getAuthentication(token: String): UsernamePasswordAuthenticationToken? {
        val user = Jwts.parser()
                .setSigningKey(notenProperties.security.secret.toByteArray())
                .parseClaimsJws(token.replace(TOKEN_PREFIX, ""))
                .body
                .subject
        return if (user != null) {
            UsernamePasswordAuthenticationToken(user, null, emptyList())
        } else {
            null
        }
    }
}

@Component
class LoginUserDetailsService: UserDetailsService {
    @Autowired
    lateinit var userRepository: UserRepository

    override fun loadUserByUsername(username: String?): UserDetails {
        userRepository.findByEmail(username ?: "")?.let {
            return org.springframework.security.core.userdetails.User(
                    it.email,
                    it.password,
                    AuthorityUtils.createAuthorityList("ROLE_USER")
            )
        } ?: throw UsernameNotFoundException("username: $username not found")
    }
}


