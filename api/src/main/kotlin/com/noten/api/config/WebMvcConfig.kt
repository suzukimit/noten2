package com.noten.api.config

import com.noten.api.entity.UserRepository
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationTrustResolverImpl
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.context.request.RequestAttributes
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.servlet.HandlerInterceptor
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import org.springframework.web.servlet.handler.MappedInterceptor
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Configuration
class WebMvcConfig(val loginUserResolver: LoginUserResolver): WebMvcConfigurer {
    //TODO addしても動かず（MappedInterceptor で登録すれ動くので、とりあえずそっちで対応）
    //https://stackoverflow.com/questions/22633800/spring-mvc-interceptor-never-called
    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(loginUserResolver).addPathPatterns("/**")
    }
    @Bean
    fun mappedInterceptor() = MappedInterceptor(arrayOf("/**"), loginUserResolver)
}

@Component
class LoginUserResolver(val userRepository: UserRepository): HandlerInterceptor {
    companion object {
        const val ATTRIBUTE_KEY = "loginUser"
    }
    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
        val authentication = SecurityContextHolder.getContext().authentication
        if (!AuthenticationTrustResolverImpl().isAnonymous(authentication)) {
            userRepository.findByEmail(authentication.principal as String)?.let {
                RequestContextHolder.currentRequestAttributes().setAttribute(ATTRIBUTE_KEY, it, RequestAttributes.SCOPE_REQUEST)
            }
        }
        return true
    }
}