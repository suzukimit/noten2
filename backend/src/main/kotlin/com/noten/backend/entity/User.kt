package com.noten.backend.entity

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*
import jakarta.validation.constraints.NotEmpty
import org.hibernate.annotations.Filter
import org.hibernate.annotations.FilterDef
import org.hibernate.annotations.ParamDef
import org.springframework.data.annotation.Id
import org.springframework.data.rest.core.annotation.RepositoryEventHandler
import org.springframework.data.rest.core.annotation.RepositoryRestResource
import org.springframework.stereotype.Component
import org.springframework.validation.Errors
import org.springframework.validation.Validator
import org.springframework.web.bind.annotation.CrossOrigin
import kotlin.jvm.Transient

@Component
@Entity
@Table(uniqueConstraints = [(UniqueConstraint(columnNames = ["email"]))])
@Filter(name = UserFilterAdvisor.FILTER_NAME, condition = "user_id = :userId")
@FilterDef(name = UserFilterAdvisor.FILTER_NAME, parameters = [ParamDef(name = UserFilterAdvisor.PARAMETER, type = Long::class)])
class User : AbstractEntity() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    override var id: Long = 0

    @Column
    var name: String = ""

    @Column(nullable = false)
    @NotEmpty
    var email: String = ""

    @JsonIgnore
    @NotEmpty
    var password: String = ""

    @Transient
    var _password: String = ""
}

@CrossOrigin
@RepositoryRestResource
interface UserRepository : AbstractRepository<User> {
    fun findByName(name: String): User?

    fun findByEmail(email: String): User?
}

@Component
@RepositoryEventHandler(User::class)
class UserHandler

class UserValidator : Validator {
    override fun supports(clazz: Class<*>): Boolean = User::class.java.isAssignableFrom(clazz)

    override fun validate(
        target: Any,
        errors: Errors,
    ) {
        val user = target as User
        if (user.email.isEmpty()) {
            errors.rejectValue("email", "email.empty")
        }
        if (user.id == 0L && user._password.isEmpty()) {
            errors.rejectValue("password", "password.empty")
        }
    }
}
