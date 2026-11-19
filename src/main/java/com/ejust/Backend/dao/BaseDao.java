package com.ejust.Backend.dao;

import org.springframework.jdbc.core.JdbcTemplate;

/** Base class for all DAOs: holds the database connection helper they all share. */
public abstract class BaseDao {

	protected final JdbcTemplate jdbc;

	protected BaseDao(JdbcTemplate jdbc) {
		this.jdbc = jdbc;
	}
}
