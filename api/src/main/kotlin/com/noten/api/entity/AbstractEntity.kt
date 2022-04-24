package com.noten.api.entity

import org.aspectj.lang.ProceedingJoinPoint
import org.aspectj.lang.annotation.Around
import org.aspectj.lang.annotation.Aspect
import org.hibernate.Session
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.NoRepositoryBean
import org.springframework.stereotype.Component
import org.springframework.validation.Errors
import org.springframework.validation.Validator
import java.io.Serializable
import java.time.Clock
import java.time.LocalDateTime
import javax.persistence.*

@MappedSuperclass
//@EntityListeners(AuditingEntityListener::class)
abstract class AbstractEntity: Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    open var id: Long = 0

    @ManyToOne
//    @CreatedBy
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

//@Component
//@Aspect
//class UserFilterAdvisor {
//
//    @PersistenceContext
//    lateinit var em: EntityManager
//
//    @Around("target(com.noten.api.entity.AbstractRepository)")
//    fun enableOwnerFilter(joinPoint: ProceedingJoinPoint): Any {
//
//        val session = em.unwrap(Session::class.java)
//        return try {
//            session.enableFilter("userFilter").apply {
////                setParameter("userId", ch.brand!!.id)
//            }
//
//            joinPoint.proceed()
//        } finally {
//            session.disableFilter("userFilter")
//        }
//    }
//}

@NoRepositoryBean
interface AbstractRepository<T>: JpaRepository<T, Long>

abstract class AbstractValidator<in T>: Validator {
    inline fun <reified T> defaultSupports(clazz: Class<*>) : Boolean = T::class.java.isAssignableFrom(clazz)
}
