package com.reusehub.backend.service;

import com.reusehub.backend.domain.AccountStatus;
import com.reusehub.backend.domain.User;
import com.reusehub.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class CurrentUserService {
    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User requireCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw ApiException.unauthorized("A valid login is required");
        }
        try {
            return requireActiveUser(Long.valueOf(jwt.getSubject()));
        } catch (NumberFormatException exception) {
            throw ApiException.unauthorized("The login is invalid");
        }
    }

    public User requireActiveUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> ApiException.unauthorized("The account is unavailable"));
        if (user.getStatus() != AccountStatus.ACTIVE) {
            throw ApiException.forbidden("This account is disabled");
        }
        return user;
    }

    public User requireUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("User not found"));
    }
}
