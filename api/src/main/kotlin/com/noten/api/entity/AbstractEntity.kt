package com.noten.api.entity

import com.noten.api.config.LoginUserResolver
import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.annotation.Around
import org.aspectj.lang.annotation.Aspect
import org.hibernate.Session
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.NoRepositoryBean
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.validation.Validator
import org.springframework.web.context.request.RequestAttributes
import org.springframework.web.context.request.RequestContextHolder
import java.io.Serializable
import java.time.Clock
import java.time.LocalDateTime
import javax.persistence.*

@MappedSuperclass
abstract class AbstractEntity: Serializable {
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
    fun enableOwnerFilter(joinPoint: ProceedingJoinPoint): Any {

        val session = em.unwrap(Session::class.java)
        val user = RequestContextHolder.getRequestAttributes()?.getAttribute(LoginUserResolver.ATTRIBUTE_KEY, RequestAttributes.SCOPE_REQUEST) as? User
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

@NoRepositoryBean
interface AbstractRepository<T>: JpaRepository<T, Long>

abstract class AbstractValidator<in T>: Validator {
    inline fun <reified T> defaultSupports(clazz: Class<*>) : Boolean = T::class.java.isAssignableFrom(clazz)
}
