package com.noten.api.entity

import com.fasterxml.jackson.annotation.JsonIgnore
import org.hibernate.annotations.Filter
import org.hibernate.annotations.FilterDef
import org.hibernate.annotations.ParamDef
import org.springframework.data.rest.core.annotation.RepositoryEventHandler
import org.springframework.data.rest.core.annotation.RepositoryRestResource
import org.springframework.stereotype.Component
import org.springframework.validation.Errors
import org.springframework.validation.Validator
import org.springframework.web.bind.annotation.CrossOrigin
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Table
import javax.persistence.UniqueConstraint
import javax.validation.constraints.NotEmpty

@Component
@Entity
@Table(uniqueConstraints = [(UniqueConstraint(columnNames = ["email"]))])
@Filter(name = UserFilterAdvisor.FILTER_NAME, condition = "user_id = :userId")
@FilterDef(name = UserFilterAdvisor.FILTER_NAME, parameters = [ParamDef(name = UserFilterAdvisor.PARAMETER, type = "long")])
class User: AbstractEntity() {
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
class UserHandler {
}

class UserValidator : Validator {
    override fun supports(clazz: Class<*>): Boolean {
        return User::class.java.isAssignableFrom(clazz)
    }

    override fun validate(target: Any, errors: Errors) {
        val user = target as User
        if (user.email.isEmpty()) {
            errors.rejectValue("email", "email.empty")
        }
        if (user.id == 0L && user._password.isEmpty()) {
            errors.rejectValue("password", "password.empty")
        }
    }
}
