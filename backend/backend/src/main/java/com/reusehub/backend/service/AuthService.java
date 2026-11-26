package com.reusehub.backend.service;

import com.reusehub.backend.domain.AccountStatus;
import com.reusehub.backend.domain.Role;
import com.reusehub.backend.domain.User;
import com.reusehub.backend.dto.ApiDtos;
import com.reusehub.backend.repository.UserRepository;
import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public ApiDtos.AuthResponse register(ApiDtos.RegisterRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw ApiException.conflict("An account with this email already exists");
        }
        Role role = Role.valueOf(request.role().trim().toUpperCase(Locale.ROOT));
        if (role == Role.ADMIN) {
            throw ApiException.badRequest("Administrator accounts cannot be self-registered");
        }
        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(role);
        user.setStatus(AccountStatus.ACTIVE);
        user.setVerified(false);
        user.setOrganization(trimToNull(request.organization()));
        user.setLocation(trimToNull(request.location()));
        User saved = userRepository.save(user);
        return new ApiDtos.AuthResponse(jwtService.createToken(saved), ApiMapper.user(saved));
    }

    @Transactional(readOnly = true)
    public ApiDtos.AuthResponse login(ApiDtos.LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> ApiException.unauthorized("Email or password is incorrect"));
        if (user.getStatus() != AccountStatus.ACTIVE
                || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw ApiException.unauthorized("Email or password is incorrect");
        }
        return new ApiDtos.AuthResponse(jwtService.createToken(user), ApiMapper.user(user));
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
