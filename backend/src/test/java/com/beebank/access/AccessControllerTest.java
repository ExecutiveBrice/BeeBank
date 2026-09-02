package com.beebank.access;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AccessControllerTest {

    private final AccessController controller = new AccessController("secret-from-environment");

    @Test
    void authorizesTheConfiguredPassword() {
        AccessResponse response = controller.verify(new VerifyPasswordRequest("secret-from-environment"));

        assertThat(response.authorized()).isTrue();
    }

    @Test
    void rejectsAnotherPassword() {
        AccessResponse response = controller.verify(new VerifyPasswordRequest("wrong-password"));

        assertThat(response.authorized()).isFalse();
    }
}
