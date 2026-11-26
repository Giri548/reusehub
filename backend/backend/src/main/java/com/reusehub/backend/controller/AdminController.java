package com.reusehub.backend.controller;

import com.reusehub.backend.domain.User;
import com.reusehub.backend.dto.ApiDtos;
import com.reusehub.backend.service.AdminService;
import com.reusehub.backend.service.CurrentUserService;
import com.reusehub.backend.service.ItemRequestService;
import com.reusehub.backend.service.ListingService;
import com.reusehub.backend.service.ModerationService;
import com.reusehub.backend.service.OrganizationVerificationService;
import com.reusehub.backend.service.PlatformSettingsService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final CurrentUserService currentUserService;
    private final AdminService adminService;
    private final ListingService listingService;
    private final ItemRequestService itemRequestService;
    private final OrganizationVerificationService verificationService;
    private final ModerationService moderationService;
    private final PlatformSettingsService platformSettingsService;

    public AdminController(
            CurrentUserService currentUserService,
            AdminService adminService,
            ListingService listingService,
            ItemRequestService itemRequestService,
            OrganizationVerificationService verificationService,
            ModerationService moderationService,
            PlatformSettingsService platformSettingsService) {
        this.currentUserService = currentUserService;
        this.adminService = adminService;
        this.listingService = listingService;
        this.itemRequestService = itemRequestService;
        this.verificationService = verificationService;
        this.moderationService = moderationService;
        this.platformSettingsService = platformSettingsService;
    }

    @GetMapping("/dashboard")
    public ApiDtos.AdminDashboardResponse dashboard() {
        return adminService.dashboard();
    }

    @GetMapping("/users")
    public List<ApiDtos.UserResponse> users() {
        return adminService.users();
    }

    @PatchMapping("/users/{userId}/status")
    public ApiDtos.UserResponse setUserStatus(
            @PathVariable Long userId,
            @Valid @RequestBody ApiDtos.UserStatusRequest request) {
        return adminService.setUserStatus(
                currentUserService.requireCurrentUser(), userId, request.status());
    }

    @GetMapping("/listings")
    public List<ApiDtos.ListingResponse> listings() {
        return listingService.adminList();
    }

    @PatchMapping("/listings/{listingId}/status")
    public ApiDtos.ListingResponse setListingStatus(
            @PathVariable Long listingId,
            @Valid @RequestBody ApiDtos.ListingStatusRequest request) {
        return listingService.adminSetStatus(listingId, request.status());
    }

    @GetMapping("/requests")
    public List<ApiDtos.ItemRequestResponse> requests() {
        User admin = currentUserService.requireCurrentUser();
        return itemRequestService.listFor(admin);
    }

    @GetMapping("/verifications")
    public List<ApiDtos.OrganizationVerificationResponse> verifications() {
        return verificationService.adminList();
    }

    @PatchMapping("/verifications/{verificationId}/status")
    public ApiDtos.OrganizationVerificationResponse reviewVerification(
            @PathVariable Long verificationId,
            @Valid @RequestBody ApiDtos.ReviewStatusRequest request) {
        return verificationService.review(verificationId, request.status());
    }

    @GetMapping("/reports")
    public List<ApiDtos.ReportResponse> reports() {
        return moderationService.adminList();
    }

    @PatchMapping("/reports/{reportId}/status")
    public ApiDtos.ReportResponse reviewReport(
            @PathVariable Long reportId,
            @Valid @RequestBody ApiDtos.ReviewStatusRequest request) {
        return moderationService.review(reportId, request.status());
    }

    @GetMapping("/settings")
    public ApiDtos.PlatformSettingsResponse settings() {
        return platformSettingsService.get();
    }

    @PutMapping("/settings")
    public ApiDtos.PlatformSettingsResponse updateSettings(
            @Valid @RequestBody ApiDtos.PlatformSettingsRequest request) {
        return platformSettingsService.update(request);
    }
}
