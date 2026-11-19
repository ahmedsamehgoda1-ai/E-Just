package com.ejust.Backend.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/** Tests the DAO directly, including findAll() inherited from AbstractDao. */
@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:daotest")
class UserDaoImplTest {

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

		Optional<User> found = userDao.findByEmail("a@x.com");

		assertTrue(found.isPresent());
		assertEquals("a@x.com", found.get().email());
		assertEquals("hash1", found.get().passwordHash());
		assertNotNull(found.get().id());
	}

	@Test
	void findByEmailReturnsEmptyWhenMissing() {
		assertTrue(userDao.findByEmail("missing@x.com").isEmpty());
	}

	@Test
	void findAllReturnsEveryUser() {
		userDao.insert("a@x.com", "h1");
		userDao.insert("b@x.com", "h2");

		List<User> all = userDao.findAll();

		assertEquals(2, all.size());
		assertEquals(List.of("a@x.com", "b@x.com"), all.stream().map(User::email).toList());
	}

	@Test
	void findAllOnEmptyTableReturnsEmptyList() {
		assertTrue(userDao.findAll().isEmpty());
	}

	@Test
	void uniqueConstraintRejectsDuplicateEmail() {
		userDao.insert("a@x.com", "h1");

		assertThrows(org.springframework.dao.DuplicateKeyException.class,
				() -> userDao.insert("a@x.com", "h2"));
	}
}
