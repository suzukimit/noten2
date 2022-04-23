package com.noten.api.entity

import org.springframework.data.rest.core.annotation.RepositoryRestResource
import org.springframework.data.rest.core.config.Projection
import org.springframework.stereotype.Component
import org.springframework.validation.Errors
import org.springframework.web.bind.annotation.CrossOrigin
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.OneToMany
import javax.validation.constraints.NotEmpty

@Component
@Entity
class Notebook : AbstractEntity() {
    @Column(nullable = false)
    @NotEmpty
    //TODO ユニーク制約
    var name: String = ""

    @OneToMany(mappedBy = "notebook")
    var phrases = mutableSetOf<Phrase>()
}

@CrossOrigin
@RepositoryRestResource
interface NotebookRepository : AbstractRepository<Notebook>

@Component
class NotebookValidator : AbstractValidator<Notebook>() {
    override fun supports(clazz: Class<*>) : Boolean = defaultSupports<Notebook>(clazz)
    override fun validate(target: Any, errors: Errors) {
        (target as? Notebook)?.let {
            if (it.name.isEmpty()) {
                errors.rejectValue("title", "title is empty")
            }
        }
    }
}

@Projection(name = "list", types = [Notebook::class])
interface NotebookListProjection {
    val id: Long
    val name: String
}
