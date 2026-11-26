package com.reusehub.backend.controller;

import com.reusehub.backend.dto.ApiDtos;
import com.reusehub.backend.service.CurrentUserService;
import com.reusehub.backend.service.ModerationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/listings/{listingId}/reports")
public class ModerationController {
    private final CurrentUserService currentUserService;
    private final ModerationService moderationService;

    public ModerationController(CurrentUserService currentUserService, ModerationService moderationService) {
        this.currentUserService = currentUserService;
        this.moderationService = moderationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiDtos.ReportResponse report(
            @PathVariable Long listingId,
            @Valid @RequestBody ApiDtos.ReportRequest request) {
        return moderationService.report(currentUserService.requireCurrentUser(), listingId, request);
    }
}
