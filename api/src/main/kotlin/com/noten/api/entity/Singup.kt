package com.noten.api.entity

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Example
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.rest.core.annotation.HandleBeforeCreate
import org.springframework.data.rest.core.annotation.RepositoryEventHandler
import org.springframework.data.rest.core.annotation.RestResource
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import org.springframework.validation.Errors
import org.springframework.validation.Validator
import org.springframework.web.bind.annotation.CrossOrigin
import java.util.*
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Table
import javax.validation.constraints.NotEmpty

/**
 * Signupと同テーブルを参照する。ユーザー登録時のPOSTのみに利用される。
 */
@Component
@Entity
@Table(name = "user")
class Signup: AbstractEntity() {
    @Column(nullable = false)
    @NotEmpty
    var email: String = ""

    @Column(nullable = false)
    var password: String = ""
}

/**
 * POSTのみ許可するよう設定（RepositoryConfig）
 */
@CrossOrigin
@RestResource(path = "signup")
interface SignupRepository : AbstractRepository<Signup>

@Component
@RepositoryEventHandler(Signup::class)
class SignupHandler {
    @Autowired
    lateinit var passwordEncoder: PasswordEncoder

    @HandleBeforeCreate
    fun encodePassword(Signup: Signup) {
        if (Signup.password.isNotEmpty()) {
            Signup.password = passwordEncoder.encode(Signup.password)
        }
    }
}

class SignupValidator : Validator {
    override fun supports(clazz: Class<*>): Boolean {
        return Signup::class.java.isAssignableFrom(clazz)
    }

    override fun validate(target: Any, errors: Errors) {
        val Signup = target as Signup
        if (Signup.email.isEmpty()) {
            errors.rejectValue("email", "email.empty")
        }
        if (Signup.id == 0L && Signup.password.isEmpty()) {
            errors.rejectValue("password", "password.empty")
        }
    }
}
