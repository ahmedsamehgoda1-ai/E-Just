package com.ejust.Backend.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.*;

/** Tests the DAO directly against the in-memory H2 database. */
@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:daotest")
class UserDaoTest {

	@Autowired
	UserDao userDao;

	@Autowired
	JdbcTemplate jdbc;

	@BeforeEach
	void emptyUsersTable() {
		jdbc.update("DELETE FROM users");
	}

	@Test
	void insertThenFindByEmail() {
		userDao.insert("a@x.com", "hash1");

		User found = userDao.findByEmail("a@x.com");

		assertNotNull(found);
		assertEquals("a@x.com", found.email());
		assertEquals("hash1", found.passwordHash());
		assertNotNull(found.id());
	}

	@Test
	void findByEmailReturnsNullWhenMissing() {
		assertNull(userDao.findByEmail("missing@x.com"));
	}

	@Test
	void uniqueConstraintRejectsDuplicateEmail() {
		userDao.insert("a@x.com", "h1");

		assertThrows(org.springframework.dao.DuplicateKeyException.class,
				() -> userDao.insert("a@x.com", "h2"));
	}
}
