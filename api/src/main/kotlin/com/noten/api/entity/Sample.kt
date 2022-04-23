package com.noten.api.entity

import org.springframework.cache.annotation.Cacheable
import org.springframework.data.rest.core.annotation.RepositoryRestResource
import org.springframework.data.rest.webmvc.RepositoryRestController
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import org.springframework.stereotype.Repository
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.*
import javax.persistence.Entity

@Entity
class Sample: AbstractEntity() {
    val name = ""
}

@Repository
@RepositoryRestResource
interface SampleRepository: AbstractRepository<Sample>

/**
 * TODO classに@RequestMapping付与しないとなぜか404になる (https://stackoverflow.com/questions/40480509/custom-repositoryrestcontroller-mapping-url-throws-404-in-spring-data-rest0
 */
@RepositoryRestController
@RequestMapping("cachedSamples")
class SampleController(val service: SampleService) {

    /**
     * TODO 普通にエラーになるconfigurationが悪い？
     */
    @RequestMapping(method = [RequestMethod.GET], value = "samples/{id}")
    @ResponseBody
    fun get(@PathVariable("id") id: Long): ResponseEntity<Sample> {
        return service.get(id)?.let { sample ->
            ResponseEntity.ok(sample)
        } ?: ResponseEntity.notFound().build()
    }
}

@Component
class SampleService(val repo: SampleRepository) {

    @Cacheable
    fun get(id: Long): Sample? {
        return repo.findById(id).orElse(null)
    }
}
