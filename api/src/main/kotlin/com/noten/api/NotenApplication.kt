package com.noten.api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters

@SpringBootApplication(scanBasePackageClasses = [NotenApplication::class])
@EntityScan(basePackageClasses = arrayOf(NotenApplication::class, Jsr310JpaConverters::class))
@EnableCaching
class NotenApplication

fun main(args: Array<String>) {
    runApplication<NotenApplication>(*args)
}
