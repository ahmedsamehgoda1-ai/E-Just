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

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:authtest")
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private JdbcTemplate jdbc;

    @BeforeEach
    void cleanTable() {
        jdbc.update("DELETE FROM users");
    }

    private ResultActions post(String url, String json) throws Exception {
        return mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post(url).contentType(MediaType.APPLICATION_JSON).content(json));    }

    private ResultActions register(String email, String password) throws Exception {
        return post("/auth/register", "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}");
    }

    private ResultActions login(String email, String password) throws Exception {
        return post("/auth/login", "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}");
    }

    @Test
    void register_createsUserAndReturns201() throws Exception {
        register("new@test.com", "secret1")
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.email").value("new@test.com"));
    }

    @Test
    void register_lowercasesEmail() throws Exception {
        register("Mixed@Test.COM", "secret1")
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("mixed@test.com"));
    }

    @Test
    void register_storesAHashNotThePlainPassword() throws Exception {
        register("hash@test.com", "secret1").andExpect(status().isCreated());

        String stored = jdbc.queryForObject(
                "SELECT password_hash FROM users WHERE email = ?", String.class, "hash@test.com");

        assertNotEquals("secret1", stored);
        assertEquals(60, stored.length());
    }

    @Test
    void register_duplicateEmailReturns409InApiFormat() throws Exception {
        register("dup@test.com", "secret1").andExpect(status().isCreated());

        register("dup@test.com", "secret2")
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Conflict"))
                .andExpect(jsonPath("$.message").value("Email already registered"));
    }

    @Test
    void register_duplicateIgnoresEmailCase() throws Exception {
        register("case@test.com", "secret1").andExpect(status().isCreated());

        register("CASE@test.com", "secret1").andExpect(status().isConflict());
    }

    @Test
    void register_invalidEmailReturns400() throws Exception {
        register("not-an-email", "secret1")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Invalid input"));
    }

    @Test
    void register_shortPasswordReturns400() throws Exception {
        register("short@test.com", "12345").andExpect(status().isBadRequest());
    }

    @Test
    void register_blankFieldsReturn400() throws Exception {
        post("/auth/register", "{\"email\":\"\",\"password\":\"\"}")
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_missingFieldsReturn400() throws Exception {
        post("/auth/register", "{}").andExpect(status().isBadRequest());
    }

    @Test
    void login_withCorrectCredentialsReturns200() throws Exception {
        register("log@test.com", "secret1").andExpect(status().isCreated());

        login("log@test.com", "secret1")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("log@test.com"));
    }

    @Test
    void login_emailIsCaseInsensitive() throws Exception {
        register("log@test.com", "secret1").andExpect(status().isCreated());

        login("LOG@Test.com", "secret1").andExpect(status().isOk());
    }

    @Test
    void login_wrongPasswordReturns401() throws Exception {
        register("log@test.com", "secret1").andExpect(status().isCreated());

        login("log@test.com", "wrongpass")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"))
                .andExpect(jsonPath("$.message").value("Wrong email or password"));
    }

    @Test
    void login_unknownEmailReturns401() throws Exception {
        login("ghost@test.com", "secret1")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Wrong email or password"));
    }

    @Test
    void login_blankFieldsReturn400() throws Exception {
        post("/auth/login", "{\"email\":\"\",\"password\":\"\"}")
                .andExpect(status().isBadRequest());
    }
}