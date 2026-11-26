package com.reusehub.backend.service;

import com.reusehub.backend.domain.Category;
import com.reusehub.backend.domain.ItemRequest;
import com.reusehub.backend.domain.Listing;
import com.reusehub.backend.domain.ModerationReport;
import com.reusehub.backend.domain.Notification;
import com.reusehub.backend.domain.OrganizationVerification;
import com.reusehub.backend.domain.PlatformSettings;
import com.reusehub.backend.domain.User;
import com.reusehub.backend.dto.ApiDtos;
import java.util.List;
import java.util.Locale;

public final class ApiMapper {
    private ApiMapper() {
    }

    public static ApiDtos.UserResponse user(User user) {
        return new ApiDtos.UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name().toLowerCase(Locale.ROOT),
                display(user.getStatus().name()),
                user.isVerified(),
                user.getOrganization(),
                user.getLocation(),
                user.getPhone(),
                user.getBio(),
                user.getJoinedAt(),
                user.getAvatar());
    }

    public static ApiDtos.CategoryResponse category(Category category) {
        return new ApiDtos.CategoryResponse(category.getId(), category.getName(), category.getDescription());
    }

    public static ApiDtos.ListingResponse listing(Listing listing) {
        return new ApiDtos.ListingResponse(
                listing.getId(),
                listing.getTitle(),
                listing.getCategory().getName(),
                listing.getDescription(),
                listing.getQuantity(),
                listing.getAvailableQuantity(),
                listing.getCondition().getDisplayName(),
                listing.getLocation(),
                listing.getPickupWindow(),
                listing.getDonor().getId(),
                listing.getDonor().getName(),
                listing.getDonor().getOrganization(),
                listing.getDonor().isVerified(),
                display(listing.getStatus().name()),
                listing.getWeightKg(),
                listing.getCreatedAt().toLocalDate(),
                List.copyOf(listing.getImages()),
                List.copyOf(listing.getTags()));
    }

    public static ApiDtos.ItemRequestResponse itemRequest(ItemRequest request) {
        Listing listing = request.getListing();
        return new ApiDtos.ItemRequestResponse(
                request.getId(),
                listing.getId(),
                listing.getTitle(),
                listing.getCategory().getName(),
                listing.getImages().isEmpty() ? null : listing.getImages().get(0),
                request.getRequester().getId(),
                request.getRequester().getName(),
                request.getRequester().getOrganization(),
                listing.getDonor().getId(),
                listing.getDonor().getName(),
                listing.getLocation(),
                request.getQuantity(),
                request.getPurpose(),
                request.getPreferredDate(),
                request.getPreferredSlot(),
                display(request.getStatus().name()),
                request.getPickupCode(),
                request.getDonorNote(),
                request.getCreatedAt().toLocalDate(),
                request.getUpdatedAt().toLocalDate());
    }

    public static ApiDtos.NotificationResponse notification(Notification notification) {
        return new ApiDtos.NotificationResponse(
                notification.getId(),
                notification.getUser().getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.isRead(),
                notification.getCreatedAt(),
                notification.getLink());
    }

    public static ApiDtos.OrganizationVerificationResponse verification(OrganizationVerification verification) {
        return new ApiDtos.OrganizationVerificationResponse(
                verification.getId(),
                verification.getOrganizationName(),
                verification.getOrganizationType(),
                verification.getContactPerson(),
                verification.getEmail(),
                verification.getRegistrationNumber(),
                verification.getLocation(),
                verification.getSubmittedAt().toLocalDate(),
                display(verification.getStatus().name()),
                verification.getDocumentName(),
                verification.getDescription());
    }

    public static ApiDtos.ReportResponse report(ModerationReport report) {
        return new ApiDtos.ReportResponse(
                report.getId(),
                report.getListing().getId(),
                report.getListing().getTitle(),
                report.getReason(),
                report.getReportedBy().getName(),
                display(report.getSeverity().name()),
                display(report.getStatus().name()),
                report.getCreatedAt().toLocalDate());
    }

    public static ApiDtos.PlatformSettingsResponse settings(PlatformSettings settings) {
        return new ApiDtos.PlatformSettingsResponse(
                settings.isAutoApproveListings(),
                settings.getMaxActiveClaimsPerUser(),
                settings.isRequirePurposeStatement(),
                settings.isMaintenanceBanner(),
                settings.getPlatformEmail(),
                settings.getPickupGraceMinutes());
    }

    private static String display(String enumValue) {
        String[] words = enumValue.toLowerCase(Locale.ROOT).split("_");
        StringBuilder display = new StringBuilder();
        for (String word : words) {
            if (!display.isEmpty()) {
                display.append(' ');
            }
            display.append(Character.toUpperCase(word.charAt(0))).append(word.substring(1));
        }
        return display.toString();
    }
}
