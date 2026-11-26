package com.reusehub.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public final class ApiDtos {
    private ApiDtos() {
    }

    public record RegisterRequest(
            @NotBlank @Size(min = 2, max = 120) String name,
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank @Size(min = 8, max = 72) String password,
            @NotBlank @Pattern(regexp = "(?i)donor|receiver") String role,
            @Size(max = 160) String organization,
            @Size(max = 180) String location) {
    }

    public record LoginRequest(
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank String password) {
    }

    public record AuthResponse(String token, UserResponse user) {
    }

    public record UserResponse(
            Long id,
            String name,
            String email,
            String role,
            String status,
            boolean verified,
            String organization,
            String location,
            String phone,
            String bio,
            LocalDate joinedAt,
            String avatar) {
    }

    public record ProfileUpdateRequest(
            @NotBlank @Size(min = 2, max = 120) String name,
            @Size(max = 160) String organization,
            @NotBlank @Size(max = 180) String location,
            @Size(max = 40) String phone,
            @Size(max = 1000) String bio) {
    }

    public record ListingCreateRequest(
            @NotBlank @Size(min = 5, max = 180) String title,
            @NotBlank @Size(min = 15, max = 4000) String description,
            @NotBlank @Size(max = 80) String category,
            @NotBlank @Size(max = 30) String condition,
            @Min(1) int quantity,
            @NotBlank @Size(max = 180) String location,
            @Size(max = 160) String pickupWindow,
            @DecimalMin("0.0") BigDecimal weightKg,
            @Size(max = 4) List<@NotBlank @Size(max = 2_000_000) String> images,
            @Size(max = 20) List<@NotBlank @Size(max = 100) String> tags) {
    }

    public record ListingUpdateRequest(
            @Size(min = 5, max = 180) String title,
            @Size(min = 15, max = 4000) String description,
            @Size(max = 80) String category,
            @Size(max = 30) String condition,
            @Min(1) Integer quantity,
            @Size(max = 180) String location,
            @Size(max = 160) String pickupWindow,
            @DecimalMin("0.0") BigDecimal weightKg,
            @Size(max = 4) List<@NotBlank @Size(max = 2_000_000) String> images,
            @Size(max = 20) List<@NotBlank @Size(max = 100) String> tags) {
    }

    public record ListingStatusRequest(@NotBlank @Size(max = 30) String status) {
    }

    public record ListingResponse(
            Long id,
            String title,
            String category,
            String description,
            int quantity,
            int availableQuantity,
            String condition,
            String location,
            String pickupWindow,
            Long donorId,
            String donorName,
            String donorOrg,
            boolean donorVerified,
            String status,
            BigDecimal weightKg,
            LocalDate createdAt,
            List<String> images,
            List<String> tags) {
    }

    public record ItemRequestCreateRequest(
            @NotNull Long listingId,
            @Min(1) int quantity,
            @Size(max = 2000) String purpose,
            @NotNull @FutureOrPresent LocalDate preferredDate,
            @NotBlank @Size(max = 80) String preferredSlot) {
    }

    public record RequestStatusRequest(
            @NotBlank @Size(max = 20) String status,
            @Size(max = 1000) String donorNote) {
    }

    public record PickupVerificationRequest(@NotBlank @Size(max = 32) String pickupCode) {
    }

    public record ItemRequestResponse(
            Long id,
            Long resourceId,
            String resourceTitle,
            String resourceCategory,
            String resourceImage,
            Long receiverId,
            String receiverName,
            String receiverOrg,
            Long donorId,
            String donorName,
            String pickupLocation,
            int quantity,
            String purpose,
            LocalDate preferredDate,
            String preferredSlot,
            String status,
            String pickupCode,
            String donorNote,
            LocalDate createdAt,
            LocalDate updatedAt) {
    }

    public record CategoryResponse(Long id, String name, String description) {
    }

    public record NotificationResponse(
            Long id,
            Long userId,
            String title,
            String message,
            String type,
            boolean read,
            LocalDateTime createdAt,
            String link) {
    }

    public record OrganizationVerificationRequest(
            @NotBlank @Size(max = 180) String orgName,
            @NotBlank @Size(max = 100) String type,
            @NotBlank @Size(max = 120) String contactPerson,
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank @Size(max = 120) String regNumber,
            @NotBlank @Size(max = 180) String location,
            @Size(max = 255) String documentName,
            @Size(max = 2000) String description) {
    }

    public record ReviewStatusRequest(@NotBlank @Size(max = 20) String status) {
    }

    public record UserStatusRequest(@NotBlank @Size(max = 20) String status) {
    }

    public record OrganizationVerificationResponse(
            Long id,
            String orgName,
            String type,
            String contactPerson,
            String email,
            String regNumber,
            String location,
            LocalDate submittedAt,
            String status,
            String documentName,
            String description) {
    }

    public record ReportRequest(
            @NotBlank @Size(min = 5, max = 2000) String reason,
            String severity) {
    }

    public record ReportResponse(
            Long id,
            Long listingId,
            String listingTitle,
            String reason,
            String reportedBy,
            String severity,
            String status,
            LocalDate createdAt) {
    }

    public record PlatformSettingsRequest(
            boolean autoApproveListings,
            @Min(1) @jakarta.validation.constraints.Max(20) int maxActiveClaimsPerUser,
            boolean requirePurposeStatement,
            boolean maintenanceBanner,
            @NotBlank @Email @Size(max = 254) String platformEmail,
            @Min(0) @jakarta.validation.constraints.Max(1440) int pickupGraceMinutes) {
    }

    public record PlatformSettingsResponse(
            boolean autoApproveListings,
            int maxActiveClaimsPerUser,
            boolean requirePurposeStatement,
            boolean maintenanceBanner,
            String platformEmail,
            int pickupGraceMinutes) {
    }

    public record AdminDashboardResponse(
            long totalUsers,
            long activeUsers,
            long totalListings,
            long activeListings,
            long totalRequests,
            long pendingRequests,
            long completedExchanges,
            Map<String, Long> listingsByCategory) {
    }
}
