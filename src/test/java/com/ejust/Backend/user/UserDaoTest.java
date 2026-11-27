package com.ejust.Backend.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:daotest")
class UserDaoTest {

    @Autowired
    private UserDao userDao;

    @Autowired
    private JdbcTemplate jdbc;

    @BeforeEach
    void cleanTable() {
        jdbc.update("DELETE FROM users");
    }

    @Test
    void insert_thenFindByEmail_returnsTheSavedUser() {
        userDao.insert("a@test.com", "hash123");

        User user = userDao.findByEmail("a@test.com");

        assertNotNull(user);
        assertNotNull(user.id());
        assertEquals("a@test.com", user.email());
        assertEquals("hash123", user.passwordHash());
    }

    @Test
    void findByEmail_unknownEmailReturnsNull() {
        assertNull(userDao.findByEmail("nobody@test.com"));
    }

    @Test
    void findByEmail_returnsOnlyTheMatchingUser() {
        userDao.insert("one@test.com", "h1");
        userDao.insert("two@test.com", "h2");

        User user = userDao.findByEmail("two@test.com");

        assertEquals("two@test.com", user.email());
        assertEquals("h2", user.passwordHash());
    }

    @Test
    void insert_assignsDifferentIds() {
        userDao.insert("one@test.com", "h1");
        userDao.insert("two@test.com", "h2");

        assertNotEquals(userDao.findByEmail("one@test.com").id(),
                userDao.findByEmail("two@test.com").id());
    }

    @Test
    void insert_duplicateEmailIsRejectedByTheDatabase() {
        userDao.insert("dup@test.com", "h1");

        assertThrows(DataIntegrityViolationException.class,
                () -> userDao.insert("dup@test.com", "h2"));
    }

    @Test
    void userRecord_holdsItsValues() {
        User user = new User(1L, "x@test.com", "h");

        assertEquals(1L, user.id());
        assertEquals("x@test.com", user.email());
        assertEquals("h", user.passwordHash());
        assertEquals(new User(1L, "x@test.com", "h"), user);
    }
}