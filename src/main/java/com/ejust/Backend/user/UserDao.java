package com.ejust.Backend.user;

import com.ejust.Backend.dao.Dao;

import java.util.Optional;

/** What the app can do with users. Gets findAll() by extending Dao. */
public interface UserDao extends Dao<User> {

	void insert(String email, String passwordHash);

	Optional<User> findByEmail(String email);
}
