package com.reusehub.backend.service;

import com.reusehub.backend.domain.ItemRequest;
import com.reusehub.backend.domain.Listing;
import com.reusehub.backend.domain.ListingStatus;
import com.reusehub.backend.domain.RequestStatus;
import com.reusehub.backend.domain.Role;
import com.reusehub.backend.domain.User;
import com.reusehub.backend.dto.ApiDtos;
import com.reusehub.backend.repository.ItemRequestRepository;
import com.reusehub.backend.repository.ListingRepository;
import com.reusehub.backend.repository.PlatformSettingsRepository;
import java.security.SecureRandom;
import java.util.EnumSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ItemRequestService {
    private static final Set<RequestStatus> ACTIVE_STATUSES = EnumSet.of(
            RequestStatus.PENDING,
            RequestStatus.APPROVED);
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final ItemRequestRepository requestRepository;
    private final ListingRepository listingRepository;
    private final PlatformSettingsRepository settingsRepository;
    private final NotificationService notificationService;

    public ItemRequestService(
            ItemRequestRepository requestRepository,
            ListingRepository listingRepository,
            PlatformSettingsRepository settingsRepository,
            NotificationService notificationService) {
        this.requestRepository = requestRepository;
        this.listingRepository = listingRepository;
        this.settingsRepository = settingsRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public ApiDtos.ItemRequestResponse create(User receiver, ApiDtos.ItemRequestCreateRequest input) {
        requireRole(receiver, Role.RECEIVER);
        Listing listing = listingRepository.findByIdForUpdate(input.listingId())
                .orElseThrow(() -> ApiException.notFound("Listing not found"));
        if (listing.getStatus() != ListingStatus.ACTIVE || listing.getAvailableQuantity() < 1) {
            throw ApiException.conflict("This listing is not currently available");
        }
        if (listing.getDonor().getId().equals(receiver.getId())) {
            throw ApiException.badRequest("You cannot request your own listing");
        }
        if (input.quantity() > listing.getAvailableQuantity()) {
            throw ApiException.conflict("The requested quantity is no longer available");
        }
        if (requestRepository.existsByListingIdAndRequesterIdAndStatusIn(
                listing.getId(), receiver.getId(), ACTIVE_STATUSES)) {
            throw ApiException.conflict("You already have an active request for this listing");
        }
        boolean purposeRequired = settingsRepository.findById(1L)
                .map(settings -> settings.isRequirePurposeStatement())
                .orElse(true);
        if (purposeRequired && (input.purpose() == null || input.purpose().trim().length() < 12)) {
            throw ApiException.badRequest("Please provide a purpose statement of at least 12 characters");
        }
        int maxActiveClaims = settingsRepository.findById(1L)
                .map(settings -> settings.getMaxActiveClaimsPerUser())
                .orElse(5);
        long activeRequests = requestRepository.findByRequesterIdOrderByCreatedAtDesc(receiver.getId())
                .stream()
                .filter(request -> ACTIVE_STATUSES.contains(request.getStatus()))
                .count();
        if (activeRequests >= maxActiveClaims) {
            throw ApiException.conflict("You have reached the active request limit");
        }

        ItemRequest request = new ItemRequest();
        request.setListing(listing);
        request.setRequester(receiver);
        request.setQuantity(input.quantity());
        request.setPurpose(input.purpose() == null ? "" : input.purpose().trim());
        request.setPreferredDate(input.preferredDate());
        request.setPreferredSlot(input.preferredSlot().trim());
        request.setPickupCode(generatePickupCode());
        ItemRequest saved = requestRepository.save(request);
        notificationService.create(
                listing.getDonor(),
                "New resource request",
                receiver.getName() + " requested " + listing.getTitle(),
                "request",
                "/donor/claims");
        return ApiMapper.itemRequest(saved);
    }

    @Transactional(readOnly = true)
    public List<ApiDtos.ItemRequestResponse> listFor(User user) {
        List<ItemRequest> requests = switch (user.getRole()) {
            case DONOR -> requestRepository.findByListingDonorIdOrderByCreatedAtDesc(user.getId());
            case RECEIVER -> requestRepository.findByRequesterIdOrderByCreatedAtDesc(user.getId());
            case ADMIN -> requestRepository.findAllByOrderByCreatedAtDesc();
        };
        return requests.stream().map(ApiMapper::itemRequest).toList();
    }

    @Transactional
    public ApiDtos.ItemRequestResponse updateStatus(
            User actor, Long requestId, ApiDtos.RequestStatusRequest input) {
        RequestStatus requestedStatus = parseStatus(input.status());
        if (requestedStatus == RequestStatus.COMPLETED) {
            throw ApiException.badRequest("Use pickup-code verification to complete a request");
        }
        ItemRequest request = requestRepository.findByIdForUpdate(requestId)
                .orElseThrow(() -> ApiException.notFound("Request not found"));
        Listing listing = listingRepository.findByIdForUpdate(request.getListing().getId())
                .orElseThrow(() -> ApiException.notFound("Listing not found"));

        if (requestedStatus == RequestStatus.CANCELLED) {
            requireOwner(actor, request.getRequester());
            if (request.getStatus() != RequestStatus.PENDING && request.getStatus() != RequestStatus.APPROVED) {
                throw ApiException.conflict("Only pending or approved requests can be cancelled");
            }
            if (request.getStatus() == RequestStatus.APPROVED) {
                listing.setAvailableQuantity(listing.getAvailableQuantity() + request.getQuantity());
            }
            request.setStatus(RequestStatus.CANCELLED);
            notificationService.create(
                    listing.getDonor(),
                    "Request cancelled",
                    request.getRequester().getName() + " cancelled the request for " + listing.getTitle(),
                    "request",
                    "/donor/claims");
        } else {
            requireOwner(actor, listing.getDonor());
            if (request.getStatus() != RequestStatus.PENDING) {
                throw ApiException.conflict("Only pending requests can be approved or rejected");
            }
            if (requestedStatus == RequestStatus.APPROVED) {
                if (listing.getStatus() != ListingStatus.ACTIVE
                        || request.getQuantity() > listing.getAvailableQuantity()) {
                    throw ApiException.conflict("There is not enough available quantity to approve this request");
                }
                listing.setAvailableQuantity(listing.getAvailableQuantity() - request.getQuantity());
            } else if (requestedStatus != RequestStatus.REJECTED) {
                throw ApiException.badRequest("Unsupported request status");
            }
            request.setStatus(requestedStatus);
            request.setDonorNote(trimToNull(input.donorNote()));
            notificationService.create(
                    request.getRequester(),
                    requestedStatus == RequestStatus.APPROVED ? "Request approved" : "Request update",
                    requestedStatus == RequestStatus.APPROVED
                            ? "Your request for " + listing.getTitle() + " was approved"
                            : "Your request for " + listing.getTitle() + " was not approved",
                    "request",
                    "/receiver/claims");
        }
        return ApiMapper.itemRequest(request);
    }

    @Transactional
    public ApiDtos.ItemRequestResponse verifyPickup(User donor, Long requestId, String pickupCode) {
        ItemRequest request = requestRepository.findByIdForUpdate(requestId)
                .orElseThrow(() -> ApiException.notFound("Request not found"));
        requireOwner(donor, request.getListing().getDonor());
        if (request.getStatus() != RequestStatus.APPROVED) {
            throw ApiException.conflict("Only approved requests can be completed");
        }
        if (!request.getPickupCode().equalsIgnoreCase(pickupCode.trim())) {
            throw ApiException.badRequest("The pickup code does not match");
        }
        request.setStatus(RequestStatus.COMPLETED);
        notificationService.create(
                request.getRequester(),
                "Pickup completed",
                "The pickup for " + request.getListing().getTitle() + " has been completed",
                "request",
                "/receiver/claims");
        return ApiMapper.itemRequest(request);
    }

    private String generatePickupCode() {
        for (int attempt = 0; attempt < 5; attempt++) {
            String code = String.format(Locale.ROOT, "%06d", SECURE_RANDOM.nextInt(1_000_000));
            if (!requestRepository.existsByPickupCodeIgnoreCase(code)) {
                return code;
            }
        }
        String code = UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase(Locale.ROOT);
        if (requestRepository.existsByPickupCodeIgnoreCase(code)) {
            throw ApiException.conflict("Could not generate a unique pickup code");
        }
        return code;
    }

    private RequestStatus parseStatus(String value) {
        try {
            return RequestStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw ApiException.badRequest("Unsupported request status");
        }
    }

    private void requireRole(User user, Role role) {
        if (user.getRole() != role) {
            throw ApiException.forbidden("This action is not available for your account role");
        }
    }

    private void requireOwner(User actor, User owner) {
        if (actor.getRole() != Role.ADMIN && !actor.getId().equals(owner.getId())) {
            throw ApiException.forbidden("You do not own this request");
        }
    }

    private String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
