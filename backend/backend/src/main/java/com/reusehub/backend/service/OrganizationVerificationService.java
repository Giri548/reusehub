package com.reusehub.backend.service;

import com.reusehub.backend.domain.OrganizationVerification;
import com.reusehub.backend.domain.ReviewStatus;
import com.reusehub.backend.domain.User;
import com.reusehub.backend.dto.ApiDtos;
import com.reusehub.backend.repository.OrganizationVerificationRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrganizationVerificationService {
    private final OrganizationVerificationRepository verificationRepository;
    private final NotificationService notificationService;

    public OrganizationVerificationService(
            OrganizationVerificationRepository verificationRepository,
            NotificationService notificationService) {
        this.verificationRepository = verificationRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<ApiDtos.OrganizationVerificationResponse> mine(User user) {
        return verificationRepository.findBySubmittedByIdOrderBySubmittedAtDesc(user.getId()).stream()
                .map(ApiMapper::verification)
                .toList();
    }

    @Transactional
    public ApiDtos.OrganizationVerificationResponse submit(
            User user, ApiDtos.OrganizationVerificationRequest input) {
        if (user.isVerified()) {
            throw ApiException.conflict("This organization is already verified");
        }
        boolean pendingExists = verificationRepository
                .findBySubmittedByIdOrderBySubmittedAtDesc(user.getId()).stream()
                .anyMatch(item -> item.getStatus() == ReviewStatus.PENDING);
        if (pendingExists) {
            throw ApiException.conflict("An organization verification is already pending");
        }
        OrganizationVerification verification = new OrganizationVerification();
        verification.setSubmittedBy(user);
        verification.setOrganizationName(input.orgName().trim());
        verification.setOrganizationType(input.type().trim());
        verification.setContactPerson(input.contactPerson().trim());
        verification.setEmail(input.email().trim().toLowerCase(Locale.ROOT));
        verification.setRegistrationNumber(input.regNumber().trim());
        verification.setLocation(input.location().trim());
        verification.setDocumentName(trimToNull(input.documentName()));
        verification.setDescription(trimToNull(input.description()));
        user.setOrganization(input.orgName().trim());
        user.setLocation(input.location().trim());
        return ApiMapper.verification(verificationRepository.save(verification));
    }

    @Transactional(readOnly = true)
    public List<ApiDtos.OrganizationVerificationResponse> adminList() {
        return verificationRepository.findAllByOrderBySubmittedAtDesc().stream()
                .map(ApiMapper::verification)
                .toList();
    }

    @Transactional
    public ApiDtos.OrganizationVerificationResponse review(Long verificationId, String statusValue) {
        OrganizationVerification verification = verificationRepository.findById(verificationId)
                .orElseThrow(() -> ApiException.notFound("Verification request not found"));
        if (verification.getStatus() != ReviewStatus.PENDING) {
            throw ApiException.conflict("This verification request has already been reviewed");
        }
        ReviewStatus status = parseStatus(statusValue);
        verification.setStatus(status);
        User user = verification.getSubmittedBy();
        user.setVerified(status == ReviewStatus.APPROVED);
        if (status == ReviewStatus.APPROVED) {
            user.setOrganization(verification.getOrganizationName());
        }
        notificationService.create(
                user,
                status == ReviewStatus.APPROVED ? "Organization verified" : "Verification update",
                status == ReviewStatus.APPROVED
                        ? "Your organization has been verified"
                        : "Your organization verification request was not approved",
                "verification",
                "/profile");
        return ApiMapper.verification(verification);
    }

    private ReviewStatus parseStatus(String value) {
        try {
            return ReviewStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw ApiException.badRequest("Unsupported verification status");
        }
    }

    private String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
