package com.ejust.Backend;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

/** Turns errors into the format from api.md: { status, error, message }. */
@RestControllerAdvice
public class ApiExceptionHandler {

	@ExceptionHandler(ResponseStatusException.class)
	public ResponseEntity<Map<String, Object>> handleStatus(ResponseStatusException ex) {
		return build(HttpStatus.valueOf(ex.getStatusCode().value()), ex.getReason());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
		return build(HttpStatus.BAD_REQUEST, "Invalid input");
	}

	private ResponseEntity<Map<String, Object>> build(HttpStatus status, String message) {
		return ResponseEntity.status(status).body(Map.of(
				"status", status.value(),
				"error", status.getReasonPhrase(),
				"message", message));
	}
}
