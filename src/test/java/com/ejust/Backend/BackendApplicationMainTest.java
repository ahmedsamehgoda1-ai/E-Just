package com.ejust.Backend;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

/** Runs the real main() once so the application entry point is covered. */
class BackendApplicationMainTest {

	@Test
	void main_startsTheApplication() {
		BackendApplication.main(new String[] {
				"--server.port=0",
				"--spring.datasource.url=jdbc:h2:mem:maintest"
		});
		assertNotNull(new BackendApplication());
	}
}
