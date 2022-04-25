package com.noten.api

import org.slf4j.LoggerFactory
import org.springframework.data.rest.core.RepositoryConstraintViolationException
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.context.request.WebRequest
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import javax.validation.ConstraintViolationException


//TODO レスポンスボディのフォーマットを統一する？
@RestControllerAdvice
class RestResponseEntityExceptionHandler : ResponseEntityExceptionHandler() {

    @ExceptionHandler(RepositoryConstraintViolationException::class)
    fun handleAccessDeniedException(ex: Exception, request: WebRequest): ResponseEntity<ErrorMessage> {
        logger.error(ex)
        val nevEx = ex as RepositoryConstraintViolationException
        val msg = nevEx.errors.allErrors.map { it.toString() }.joinToString("\n")
        return ResponseEntity(ErrorMessage(msg), HttpHeaders(), HttpStatus.BAD_REQUEST)
    }

    @ExceptionHandler(ConstraintViolationException::class)
    fun handleException(e: ConstraintViolationException, request: WebRequest): ResponseEntity<ErrorFieldMessages> {
        logger.error(e)
        val errors = e.constraintViolations.map { ErrorFieldMessage(it.propertyPath.toString(), it.message) }
        return ResponseEntity(ErrorFieldMessages(errors), HttpHeaders(), HttpStatus.UNPROCESSABLE_ENTITY)
    }

    @ExceptionHandler(Throwable::class)
    fun handleThrowable(e: Exception, request: WebRequest): ResponseEntity<Any>? {
        logger.error(e)
        return super.handleException(e, request)
    }

    data class ErrorMessage(val message: String)
    data class ErrorFieldMessage(val field: String, val message: String)
    data class ErrorFieldMessages(val errors: List<ErrorFieldMessage>)

    companion object {
        val logger = LoggerFactory.getLogger(RestResponseEntityExceptionHandler::class.java)
    }
}