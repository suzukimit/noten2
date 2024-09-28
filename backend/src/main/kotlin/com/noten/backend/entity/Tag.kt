package com.noten.backend.entity

import jakarta.persistence.*
import org.hibernate.annotations.Filter
import org.springframework.data.rest.core.annotation.RepositoryRestResource
import org.springframework.stereotype.Component
import org.springframework.web.bind.annotation.CrossOrigin

@Component
@Entity
@Filter(name = UserFilterAdvisor.FILTER_NAME, condition = "user_id = :userId")
class Tag : AbstractEntity() {
    @Column(nullable = false)
    var name: String = ""

    @ManyToMany
    var phrases = mutableSetOf<Phrase>()
}

@CrossOrigin
@RepositoryRestResource
interface TagRepository : AbstractRepository<Tag>
