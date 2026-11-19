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


}
