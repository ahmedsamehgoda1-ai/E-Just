package com.ejust.Backend.auth;

import com.ejust.Backend.user.User;
import com.ejust.Backend.user.UserDao;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class AuthControllerUnitTest {

    private final UserDao dao = mock(UserDao.class);
    private final AuthController controller = new AuthController(dao);

    @Test
    void register_savesAHashedPasswordAndReturnsTheNewUser() {
        when(dao.findByEmail("a@test.com"))
                .thenReturn(null)
                .thenReturn(new User(7L, "a@test.com", "stored"));

        AuthController.RegisterResponse res =
                controller.register(new AuthController.RegisterRequest("A@Test.com", "secret1"));

        assertEquals(7L, res.id());
        assertEquals("a@test.com", res.email());
        verify(dao).insert(eq("a@test.com"), argThat(hash -> !hash.equals("secret1") && hash.startsWith("$2")));
    }

    @Test
    void register_existingEmailThrowsConflictAndDoesNotInsert() {
        when(dao.findByEmail("a@test.com")).thenReturn(new User(1L, "a@test.com", "h"));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> controller.register(new AuthController.RegisterRequest("a@test.com", "secret1")));

        assertEquals(HttpStatus.CONFLICT.value(), ex.getStatusCode().value());
        verify(dao, never()).insert(anyString(), anyString());
    }

    @Test
    void login_correctPasswordReturnsEmail() {
        String hash = new BCryptPasswordEncoder().encode("secret1");
        when(dao.findByEmail("a@test.com")).thenReturn(new User(1L, "a@test.com", hash));

        assertEquals("a@test.com",
                controller.login(new AuthController.LoginRequest("A@test.com", "secret1")).email());
    }

    @Test
    void login_wrongPasswordThrowsUnauthorized() {
        String hash = new BCryptPasswordEncoder().encode("secret1");
        when(dao.findByEmail("a@test.com")).thenReturn(new User(1L, "a@test.com", hash));

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> controller.login(new AuthController.LoginRequest("a@test.com", "nope")));

        assertEquals(HttpStatus.UNAUTHORIZED.value(), ex.getStatusCode().value());
    }

    @Test
    void login_unknownUserThrowsUnauthorized() {
        when(dao.findByEmail(anyString())).thenReturn(null);

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> controller.login(new AuthController.LoginRequest("ghost@test.com", "secret1")));

        assertEquals(HttpStatus.UNAUTHORIZED.value(), ex.getStatusCode().value());
    }
}