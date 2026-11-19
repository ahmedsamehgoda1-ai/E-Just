package com.ejust.Backend.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Tests the register/login endpoints end to end against an in-memory H2 database. */
@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:authtest")
@AutoConfigureMockMvc
class AuthControllerTest {

	@Autowired
	MockMvc mvc;

	@Autowired
	JdbcTemplate jdbc;

	@BeforeEach
	void emptyUsersTable() {
		jdbc.update("DELETE FROM users");
	}

	private ResultActions postJson(String url, String json) throws Exception {
		return mvc.perform(post(url).contentType(MediaType.APPLICATION_JSON).content(json));
	}

	private ResultActions register(String email, String password) throws Exception {
		return postJson("/auth/register", "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}");
	}

	private ResultActions login(String email, String password) throws Exception {
		return postJson("/auth/login", "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}");
	}

	@Test
	void registerCreatesUser() throws Exception {
		register("a@x.com", "secret1")
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.email").value("a@x.com"))
				.andExpect(jsonPath("$.id").isNumber());
	}

	@Test
	void registerStoresHashedPassword() throws Exception {
		register("a@x.com", "secret1").andExpect(status().isCreated());

		String stored = jdbc.queryForObject("SELECT password_hash FROM users WHERE email = ?", String.class, "a@x.com");

		assertNotEquals("secret1", stored);
	}

	@Test
	void registerLowercasesEmail() throws Exception {
		register("A@X.com", "secret1")
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.email").value("a@x.com"));
	}

	@Test
	void registerDuplicateEmailIsConflict() throws Exception {
		register("a@x.com", "secret1").andExpect(status().isCreated());

		register("a@x.com", "other12")
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("Email already registered"));
	}

	@Test
	void registerRejectsInvalidEmail() throws Exception {
		register("not-an-email", "secret1").andExpect(status().isBadRequest());
	}

	@Test
	void registerRejectsShortPassword() throws Exception {
		register("a@x.com", "123").andExpect(status().isBadRequest());
	}

	@Test
	void loginWithCorrectPasswordSucceeds() throws Exception {
		register("a@x.com", "secret1").andExpect(status().isCreated());

		login("a@x.com", "secret1")
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.email").value("a@x.com"));
	}

	@Test
	void loginWithWrongPasswordIsUnauthorized() throws Exception {
		register("a@x.com", "secret1").andExpect(status().isCreated());

		login("a@x.com", "wrongpass")
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.message").value("Wrong email or password"));
	}

	@Test
	void loginWithUnknownEmailIsUnauthorized() throws Exception {
		login("nobody@x.com", "secret1").andExpect(status().isUnauthorized());
	}

	@Test
	void loginWithBlankFieldsIsBadRequest() throws Exception {
		login("", "").andExpect(status().isBadRequest());
	}

	@Test
	void usersTableHasOneRowAfterRegister() throws Exception {
		register("a@x.com", "secret1").andExpect(status().isCreated());

		Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM users", Integer.class);

		assertEquals(1, count);
	}
}
