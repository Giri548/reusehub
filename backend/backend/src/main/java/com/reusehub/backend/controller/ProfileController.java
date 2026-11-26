package com.reusehub.backend.controller;

import com.reusehub.backend.dto.ApiDtos;
import com.reusehub.backend.service.CurrentUserService;
import com.reusehub.backend.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final CurrentUserService currentUserService;
    private final ProfileService profileService;

    public ProfileController(CurrentUserService currentUserService, ProfileService profileService) {
        this.currentUserService = currentUserService;
        this.profileService = profileService;
    }

    @GetMapping
    public ApiDtos.UserResponse get() {
        return profileService.get(currentUserService.requireCurrentUser());
    }

    @PutMapping
    public ApiDtos.UserResponse update(@Valid @RequestBody ApiDtos.ProfileUpdateRequest request) {
        return profileService.update(currentUserService.requireCurrentUser(), request);
    }
}
