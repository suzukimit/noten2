package com.noten.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters
import org.springframework.web.servlet.config.annotation.EnableWebMvc

@SpringBootApplication(scanBasePackageClasses = [NotenApplication::class])
@EntityScan(basePackageClasses = [NotenApplication::class, Jsr310JpaConverters::class])
@EnableCaching
@EnableWebMvc
class NotenApplication

fun main(args: Array<String>) {
    runApplication<NotenApplication>(*args)
}
