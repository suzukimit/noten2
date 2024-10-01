package com.noten.backend.config

import com.noten.backend.entity.UserRepository
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationTrustResolverImpl
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import org.springframework.web.context.request.RequestAttributes
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.servlet.HandlerInterceptor
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.servlet.handler.MappedInterceptor

@Configuration
class WebMvcConfig(
    val loginUserResolver: LoginUserResolver,
) : WebMvcConfigurer {
    // TODO addしても動かず（MappedInterceptor で登録すれ動くので、とりあえずそっちで対応）
    // https://stackoverflow.com/questions/22633800/spring-mvc-interceptor-never-called
    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(loginUserResolver).addPathPatterns("/**")
    }

    @Bean
    fun mappedInterceptor() = MappedInterceptor(arrayOf("/**"), loginUserResolver)
}

@Component
class LoginUserResolver(
    val userRepository: UserRepository,
) : HandlerInterceptor {
    companion object {
        const val ATTRIBUTE_KEY = "loginUser"
    }

    override fun preHandle(
        request: HttpServletRequest,
        response: HttpServletResponse,
        handler: Any,
    ): Boolean {
        val authentication = SecurityContextHolder.getContext().authentication
        if (!AuthenticationTrustResolverImpl().isAnonymous(authentication)) {
            val email = (authentication.principal as? UserDetails)?.username ?: return true
            userRepository.findByEmail(email)?.let {
                RequestContextHolder.currentRequestAttributes().setAttribute(ATTRIBUTE_KEY, it, RequestAttributes.SCOPE_REQUEST)
            }
        }
        return true
    }
}
