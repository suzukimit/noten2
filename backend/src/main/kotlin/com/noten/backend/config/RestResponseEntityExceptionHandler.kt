package com.noten.backend.config

import jakarta.validation.ConstraintViolationException
import org.springframework.data.rest.core.RepositoryConstraintViolationException
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.context.request.WebRequest
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler

@RestControllerAdvice
class RestResponseEntityExceptionHandler : ResponseEntityExceptionHandler() {
    @ExceptionHandler(RepositoryConstraintViolationException::class)
    fun handleAccessDeniedException(
        e: RepositoryConstraintViolationException,
        request: WebRequest,
    ): ResponseEntity<ErrorMessage> {
        logger.error(e)
        val msg = e.errors.allErrors.joinToString("\n") { it.toString() }
        return ResponseEntity(ErrorMessage(msg), HttpHeaders(), HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(ConstraintViolationException::class)
    fun handleException(
        e: ConstraintViolationException,
        request: WebRequest,
    ): ResponseEntity<ErrorFieldMessages> {
        logger.error(e)
        val errors = e.constraintViolations.map { ErrorFieldMessage(it.propertyPath.toString(), it.message) }
        return ResponseEntity(ErrorFieldMessages(errors), HttpHeaders(), HttpStatus.UNPROCESSABLE_ENTITY)
    }

    @ExceptionHandler(Exception::class)
    fun handleThrowable(
        e: Exception,
        request: WebRequest,
    ): ResponseEntity<Any>? {
        logger.error(e)

        e.findCause(org.hibernate.exception.ConstraintViolationException::class.java)?.let { exception ->
            @Suppress("WHEN_ENUM_CAN_BE_NULL_IN_JAVA")
            return when (exception.kind) {
                org.hibernate.exception.ConstraintViolationException.ConstraintKind.UNIQUE ->
                    ResponseEntity(ErrorMessage("conflict occurred"), HttpHeaders(), HttpStatus.CONFLICT)
                org.hibernate.exception.ConstraintViolationException.ConstraintKind.OTHER ->
                    ResponseEntity(ErrorMessage(""), HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR)
            }
        }

        return super.handleException(e, request)
    }

    data class ErrorMessage(
        val message: String,
    )

    data class ErrorFieldMessage(
        val field: String,
        val message: String,
    )

    data class ErrorFieldMessages(
        val errors: List<ErrorFieldMessage>,
    )

    private fun <T : Throwable> Throwable.findCause(cause: Class<T>): T? =
        this.cause?.let {
            if (cause.isInstance(it)) {
                cause.cast(it) // 'it' を安全に T にキャスト
            } else {
                it.findCause(cause) // 再帰的に原因を探す
            }
        }
}
