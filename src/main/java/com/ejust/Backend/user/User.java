package com.ejust.Backend.user;

/** One row of the users table. */
public record User(Long id, String email, String passwordHash) {
}
