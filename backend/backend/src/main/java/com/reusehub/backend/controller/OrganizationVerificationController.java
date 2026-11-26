package com.reusehub.backend.controller;

import com.reusehub.backend.dto.ApiDtos;
import com.reusehub.backend.service.CurrentUserService;
import com.reusehub.backend.service.OrganizationVerificationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/organizations/verifications")
public class OrganizationVerificationController {
    private final CurrentUserService currentUserService;
    private final OrganizationVerificationService verificationService;

    public OrganizationVerificationController(
            CurrentUserService currentUserService,
            OrganizationVerificationService verificationService) {
        this.currentUserService = currentUserService;
        this.verificationService = verificationService;
    }

    @GetMapping("/mine")
    public List<ApiDtos.OrganizationVerificationResponse> mine() {
        return verificationService.mine(currentUserService.requireCurrentUser());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiDtos.OrganizationVerificationResponse submit(
            @Valid @RequestBody ApiDtos.OrganizationVerificationRequest request) {
        return verificationService.submit(currentUserService.requireCurrentUser(), request);
    }
}
