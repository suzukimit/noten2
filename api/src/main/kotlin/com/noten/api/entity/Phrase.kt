package com.noten.api.entity

import org.hibernate.annotations.Filter
import org.springframework.data.rest.core.annotation.RepositoryRestResource
import org.springframework.data.rest.core.config.Projection
import org.springframework.stereotype.Component
import org.springframework.validation.Errors
import org.springframework.web.bind.annotation.CrossOrigin
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.ManyToMany
import javax.persistence.ManyToOne
import javax.validation.constraints.NotEmpty

@Component
@Entity
@Filter(name = UserFilterAdvisor.FILTER_NAME, condition = "user_id = :userId")
class Phrase: AbstractEntity() {
    @Column(nullable = false)
    @NotEmpty
    var title: String = ""

    @Column(nullable = false)
    @NotEmpty
    var meter: String = ""

    @Column(nullable = false)
    @NotEmpty
    var length: String = ""

    @Column
    var reference: String = ""

    @Column(name = "`key`", nullable = false)
    @NotEmpty
    var key: String = ""

    @Column(nullable = false)
    @NotEmpty
    var abc: String = ""

    @ManyToOne
    var notebook: Notebook? = null

    @ManyToMany(mappedBy = "phrases")
    var tags = mutableSetOf<Tag>()
}

@CrossOrigin
@RepositoryRestResource
interface PhraseRepository : AbstractRepository<Phrase> {
    //TODO ただの部分一致検索なのでパフォーマンス的に厳しいかも
    fun findByTitleContaining(title: String): List<Phrase>

    @DisableOwnerFilter
    //TODO なぜかNUllPointerになってしまうので暫定でフィルターを無視
    override fun deleteById(id: Long)
}

@Component
class PhraseValidator : AbstractValidator<Phrase>() {
    override fun supports(clazz: Class<*>) : Boolean = defaultSupports<Phrase>(clazz)
    override fun validate(target: Any, errors: Errors) {
        (target as? Phrase)?.let {
            if (it.title.isEmpty()) {
                errors.rejectValue("title", "title is empty")
            }
        }

        //TODO 他のもちゃんとやる
    }
}

@Projection(name = "list", types = [Phrase::class])
interface PhraseListProjection {
    val id: Long
    val title: String
    val meter: String
    val length: String
    val reference: String
    val key: String
    val abc: String
    val notebook: NotebookListProjection?
}

@Projection(name = "detail", types = [Phrase::class])
interface PhraseDetailProjection: PhraseListProjection
