package com.ejust.Backend.auth;

import com.ejust.Backend.user.User;
import com.ejust.Backend.user.UserDao;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
public class AuthController {

	public record RegisterRequest(@NotBlank @Email String email, @NotBlank @Size(min = 6) String password) {
	}

	public record LoginRequest(@NotBlank String email, @NotBlank String password) {
	}

	private final UserDao userDao;
	private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

	public AuthController(UserDao userDao) {
		this.userDao = userDao;
	}

	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	public Object register(@Valid @RequestBody RegisterRequest req) {
		String email = req.email().trim().toLowerCase();
		if (userDao.findByEmail(email).isPresent()) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
		}
		userDao.insert(email, encoder.encode(req.password()));
		User user = userDao.findByEmail(email).orElseThrow();
		return java.util.Map.of("id", user.id(), "email", user.email());
	}

	@PostMapping("/login")
	public Object login(@Valid @RequestBody LoginRequest req) {
		String email = req.email().trim().toLowerCase();
		User user = userDao.findByEmail(email)
				.filter(u -> encoder.matches(req.password(), u.passwordHash()))
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong email or password"));
		return java.util.Map.of("email", user.email());
	}
}
