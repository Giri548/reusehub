package com.reusehub.backend.service;

import com.reusehub.backend.domain.User;
import com.reusehub.backend.dto.ApiDtos;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {
    @Transactional(readOnly = true)
    public ApiDtos.UserResponse get(User user) {
        return ApiMapper.user(user);
    }

    @Transactional
    public ApiDtos.UserResponse update(User user, ApiDtos.ProfileUpdateRequest request) {
        user.setName(request.name().trim());
        user.setOrganization(trimToNull(request.organization()));
        user.setLocation(request.location().trim());
        user.setPhone(trimToNull(request.phone()));
        user.setBio(trimToNull(request.bio()));
        return ApiMapper.user(user);
    }

    private String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
