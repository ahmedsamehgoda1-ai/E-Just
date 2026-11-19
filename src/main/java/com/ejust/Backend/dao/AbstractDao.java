package com.ejust.Backend.dao;

import org.springframework.jdbc.core.JdbcTemplate;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/** Base class: code shared by all DAOs lives here, so subclasses don't repeat it. */
public abstract class AbstractDao<T> implements Dao<T> {

	protected final JdbcTemplate jdbc;
	private final String table;

	protected AbstractDao(JdbcTemplate jdbc, String table) {
		this.jdbc = jdbc;
		this.table = table;
	}

	/** Each subclass says how one database row becomes an object. */
	protected abstract T mapRow(ResultSet rs, int rowNum) throws SQLException;

	@Override
	public List<T> findAll() {
		return jdbc.query("SELECT * FROM " + table, this::mapRow);
	}
}
