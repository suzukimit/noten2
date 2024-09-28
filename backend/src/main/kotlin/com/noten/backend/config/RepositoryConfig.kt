package com.noten.backend.config

import com.noten.backend.entity.AbstractEntity
import com.noten.backend.entity.UserValidator
import org.springframework.aop.aspectj.AspectJExpressionPointcut
import org.springframework.aop.support.DefaultPointcutAdvisor
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.security.SecurityProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.rest.core.config.RepositoryRestConfiguration
import org.springframework.data.rest.core.event.ValidatingRepositoryEventListener
import org.springframework.data.rest.core.mapping.RepositoryDetectionStrategy
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer
import org.springframework.transaction.PlatformTransactionManager
import org.springframework.transaction.interceptor.DefaultTransactionAttribute
import org.springframework.transaction.interceptor.NameMatchTransactionAttributeSource
import org.springframework.transaction.interceptor.TransactionInterceptor
import org.springframework.web.servlet.config.annotation.CorsRegistry

// @EnableJpaAuditing
@Configuration
class RepositoryConfig : RepositoryRestConfigurer {
    @Autowired
    lateinit var securityProperties: SecurityProperties

    @Autowired
    lateinit var entities: List<AbstractEntity>

    @Autowired
    lateinit var txManager: PlatformTransactionManager

    override fun configureRepositoryRestConfiguration(
        config: RepositoryRestConfiguration?,
        cors: CorsRegistry?,
    ) {
        config?.let {
            it
                .exposeIdsFor(*entities.map { it.javaClass }.toTypedArray())
                .setRepositoryDetectionStrategy(RepositoryDetectionStrategy.RepositoryDetectionStrategies.ANNOTATED)
        }
    }

    override fun configureValidatingRepositoryEventListener(validatingListener: ValidatingRepositoryEventListener?) {
        // TODO 全部登録する
        validatingListener?.addValidator("beforeCreate", UserValidator())
    }

    @Bean
    fun txAdvice() =
        TransactionInterceptor(
            txManager,
            NameMatchTransactionAttributeSource().apply {
                addTransactionalMethod("post*", DefaultTransactionAttribute())
                addTransactionalMethod("put*", DefaultTransactionAttribute())
                addTransactionalMethod("delete*", DefaultTransactionAttribute())
                addTransactionalMethod("patch*", DefaultTransactionAttribute())
            },
        )

    @Bean
    fun txAdvisor() =
        DefaultPointcutAdvisor(
            AspectJExpressionPointcut().apply {
                expression = "execution(* org.springframework.data.rest.webmvc.RepositoryEntityController.*(..))"
            },
            txAdvice(),
        )

//    @Bean
//    fun auditorProvider(): AuditorAware<User> {
//        return AuditorAwareImpl()
//    }
}

// class AuditorAwareImpl : AuditorAware<User> {
//    override fun getCurrentAuditor() = Optional.ofNullable(RequestContextHolder.currentRequestAttributes().loginUser)
// }
