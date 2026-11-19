package com.ejust.Backend.user;

import com.ejust.Backend.dao.BaseDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/** Reads and writes the users table. Gets jdbc from BaseDao. */
@Repository
public class UserDao extends BaseDao {

	public UserDao(JdbcTemplate jdbc) {
		super(jdbc);
	}

	public void insert(String email, String passwordHash) {
		jdbc.update("INSERT INTO users (email, password_hash) VALUES (?, ?)", email, passwordHash);
	}

	/** Returns the user with this email, or null if there is none. */
	public User findByEmail(String email) {
		List<User> users = jdbc.query("SELECT * FROM users WHERE email = ?", this::mapRow, email);
		if (users.isEmpty()) {
			return null;
		}
		return users.get(0);
	}

	private User mapRow(ResultSet rs, int rowNum) throws SQLException {
		return new User(rs.getLong("id"), rs.getString("email"), rs.getString("password_hash"));
	}
}
