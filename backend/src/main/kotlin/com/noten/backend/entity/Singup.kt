package com.noten.backend.entity

import jakarta.persistence.*
import jakarta.validation.constraints.NotEmpty
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.rest.core.annotation.HandleAfterCreate
import org.springframework.data.rest.core.annotation.HandleBeforeCreate
import org.springframework.data.rest.core.annotation.RepositoryEventHandler
import org.springframework.data.rest.core.annotation.RestResource
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import org.springframework.validation.Errors
import org.springframework.validation.Validator
import org.springframework.web.bind.annotation.CrossOrigin

/**
 * Signupと同テーブルを参照する。ユーザー登録時のPOSTのみに利用される。
 *
 * TODO RestResourceとして定義するのはちょっと違和感あるかも。AuthenticationController を作ったほうが良さそう
 */
@Component
@Entity
@Table(name = "user")
class Signup : AbstractEntity() {
    @Column(nullable = false)
    @NotEmpty
    var email: String = ""

    // TODO writeonlyにしないと
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

    @Autowired
    lateinit var notebookRepository: NotebookRepository

    @Autowired
    lateinit var phraseRepository: PhraseRepository

    @HandleBeforeCreate
    fun handleBeforeCreate(signup: Signup) {
        if (signup.password.isNotEmpty()) {
            signup.password = passwordEncoder.encode(signup.password)
        }
    }

    @HandleAfterCreate
    fun handleAfterCreate(signup: Signup) {
        val me = User().apply { id = signup.id }
        signup.user = me

        // サンプルデータのセットアップ
        // TODO Repository直操作でなくServiceクラスを経由したい
        val notebook =
            notebookRepository.save(
                Notebook().apply {
                    name = "1st book"
                    user = me
                },
            )
        val phrase =
            phraseRepository.save(
                Phrase().apply {
                    title = "Fly me to the Moon（サンプル）"
                    meter = "4/4"
                    length = "1/8"
                    reference = "Bart Howard"
                    key = "C"
                    abc = """"Am7" c3BA2 GF-| "Dm7"FG3A2c2|"G7"B3AG2FE-|"C△7 C"E8|
"F△7" A3GF2ED-|"Bm7(♭5)"DE3F2A2|"E7"^G3FE2DC-|"Am7"C6 "A7" ^C2||
"Dm7"DA2A-A4-|"G7"A4c2B2|"C△7"G8-|"A7"G6 D2|
"Dm7"CF2F-F4-|"G7"A4 A2G2|"C△7"F3E-E4|"Bm7(b5)"-E4|
"""
                    this.notebook = notebook
                    user = me
                },
            )
    }
}

class SignupValidator : Validator {
    override fun supports(clazz: Class<*>): Boolean = Signup::class.java.isAssignableFrom(clazz)

    override fun validate(
        target: Any,
        errors: Errors,
    ) {
        val Signup = target as Signup
        if (Signup.email.isEmpty()) {
            errors.rejectValue("email", "email.empty")
        }
        if (Signup.id == 0L && Signup.password.isEmpty()) {
            errors.rejectValue("password", "password.empty")
        }
    }
}
