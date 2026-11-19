package com.ejust.Backend.user;

import com.ejust.Backend.dao.AbstractDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

/** H2 implementation of UserDao. Inherits findAll() and jdbc from AbstractDao. */
@Repository
public class UserDaoImpl extends AbstractDao<User> implements UserDao {

	public UserDaoImpl(JdbcTemplate jdbc) {
		super(jdbc, "users");
	}

	@Override
	protected User mapRow(ResultSet rs, int rowNum) throws SQLException {
		return new User(rs.getLong("id"), rs.getString("email"), rs.getString("password_hash"));
	}

	@Override
	public void insert(String email, String passwordHash) {
		jdbc.update("INSERT INTO users (email, password_hash) VALUES (?, ?)", email, passwordHash);
	}

	@Override
	public Optional<User> findByEmail(String email) {
		return jdbc.query("SELECT * FROM users WHERE email = ?", this::mapRow, email).stream().findFirst();
	}
}
