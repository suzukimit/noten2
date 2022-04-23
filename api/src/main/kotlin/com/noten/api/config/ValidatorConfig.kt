package com.noten.api.config

import com.noten.api.entity.UserValidator
import org.springframework.context.annotation.Configuration
import org.springframework.data.rest.core.event.ValidatingRepositoryEventListener
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurerAdapter

@Configuration
open class ValidatorConfig : RepositoryRestConfigurerAdapter() {
    override fun configureValidatingRepositoryEventListener(v: ValidatingRepositoryEventListener?) {
        v?.addValidator("beforeCreate", UserValidator())
    }
}
