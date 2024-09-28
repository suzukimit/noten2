package com.noten.backend.entity

import com.noten.backend.config.LoginUserResolver
import jakarta.persistence.*
import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.annotation.Around
import org.aspectj.lang.annotation.Aspect
import org.aspectj.lang.reflect.MethodSignature
import org.hibernate.Session
import org.springframework.aop.aspectj.MethodInvocationProceedingJoinPoint
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.NoRepositoryBean
import org.springframework.stereotype.Component
import org.springframework.validation.Validator
import org.springframework.web.context.request.RequestAttributes
import org.springframework.web.context.request.RequestContextHolder
import java.io.Serializable
import java.time.Clock
import java.time.LocalDateTime

@MappedSuperclass
abstract class AbstractEntity : Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    open var id: Long = 0

    @ManyToOne
    open var user: User? = null

    @Column(updatable = false)
    open var createdAt: LocalDateTime? = null

    @Column
    open var updatedAt: LocalDateTime? = null

    @PrePersist
    fun prePersist() {
        LocalDateTime.now(Clock.systemUTC()).apply {
            createdAt = this
            updatedAt = this
        }
        (
            RequestContextHolder.getRequestAttributes()?.getAttribute(
                LoginUserResolver.ATTRIBUTE_KEY,
                RequestAttributes.SCOPE_REQUEST,
            ) as? User
        )?.let {
            user = it
        }
    }

    @PreUpdate
    fun preUpdate() {
        LocalDateTime.now(Clock.systemUTC()).apply {
            updatedAt = this
        }
    }

    @Version
    open val version: Long = 0L
}

@Component
@Aspect
class UserFilterAdvisor {
    companion object {
        const val FILTER_NAME = "userFilter"
        const val PARAMETER = "userId"
    }

    @PersistenceContext
    lateinit var em: EntityManager

    @Around("target(com.noten.api.entity.AbstractRepository)")
    fun enableOwnerFilter(joinPoint: ProceedingJoinPoint): Any? {
        val disable =
            ((joinPoint as MethodInvocationProceedingJoinPoint).signature as MethodSignature).method.isAnnotationPresent(
                DisableOwnerFilter::class.java,
            )
        if (disable) {
            return joinPoint.proceed()
        }
        val session = em.unwrap(Session::class.java)
        val user =
            RequestContextHolder.getRequestAttributes()?.getAttribute(
                LoginUserResolver.ATTRIBUTE_KEY,
                RequestAttributes.SCOPE_REQUEST,
            ) as? User
        return try {
            user?.let {
                session.enableFilter(FILTER_NAME).apply {
                    setParameter(PARAMETER, it.id)
                }
            }
            joinPoint.proceed()
        } finally {
            session.disableFilter(FILTER_NAME)
        }
    }
}

@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class DisableOwnerFilter

@NoRepositoryBean
interface AbstractRepository<T> : JpaRepository<T, Long>

abstract class AbstractValidator<in T> : Validator {
    inline fun <reified T> defaultSupports(clazz: Class<*>): Boolean = T::class.java.isAssignableFrom(clazz)
}
