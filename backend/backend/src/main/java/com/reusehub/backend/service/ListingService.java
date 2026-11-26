package com.reusehub.backend.service;

import com.reusehub.backend.domain.Category;
import com.reusehub.backend.domain.ItemCondition;
import com.reusehub.backend.domain.Listing;
import com.reusehub.backend.domain.ListingStatus;
import com.reusehub.backend.domain.Role;
import com.reusehub.backend.domain.User;
import com.reusehub.backend.dto.ApiDtos;
import com.reusehub.backend.repository.CategoryRepository;
import com.reusehub.backend.repository.ListingRepository;
import com.reusehub.backend.repository.PlatformSettingsRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListingService {
    private final ListingRepository listingRepository;
    private final CategoryRepository categoryRepository;
    private final PlatformSettingsRepository settingsRepository;

    public ListingService(
            ListingRepository listingRepository,
            CategoryRepository categoryRepository,
            PlatformSettingsRepository settingsRepository) {
        this.listingRepository = listingRepository;
        this.categoryRepository = categoryRepository;
        this.settingsRepository = settingsRepository;
    }

    @Transactional(readOnly = true)
    public List<ApiDtos.ListingResponse> search(
            String search, String category, String condition, String location, boolean includeUnavailable) {
        String normalizedCondition = trimToNull(condition);
        if (normalizedCondition != null) {
            normalizedCondition = ItemCondition.fromDisplayName(normalizedCondition).name();
        }
        return listingRepository.search(
                        includeUnavailable,
                        trimToNull(search),
                        trimToNull(category),
                        normalizedCondition,
                        trimToNull(location))
                .stream()
                .map(ApiMapper::listing)
                .toList();
    }

    @Transactional(readOnly = true)
    public ApiDtos.ListingResponse getPublic(Long listingId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> ApiException.notFound("Listing not found"));
        if (listing.getStatus() != ListingStatus.ACTIVE || listing.getAvailableQuantity() < 1) {
            throw ApiException.notFound("Listing not found");
        }
        return ApiMapper.listing(listing);
    }

    @Transactional(readOnly = true)
    public List<ApiDtos.ListingResponse> mine(User user) {
        requireRole(user, Role.DONOR);
        return listingRepository.findByDonorIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(ApiMapper::listing)
                .toList();
    }

    @Transactional
    public ApiDtos.ListingResponse create(User donor, ApiDtos.ListingCreateRequest request) {
        requireRole(donor, Role.DONOR);
        Category category = findCategory(request.category());
        Listing listing = new Listing();
        listing.setTitle(request.title().trim());
        listing.setDescription(request.description().trim());
        listing.setCategory(category);
        listing.setCondition(ItemCondition.fromDisplayName(request.condition().trim()));
        listing.setQuantity(request.quantity());
        listing.setAvailableQuantity(request.quantity());
        listing.setLocation(request.location().trim());
        listing.setPickupWindow(trimToNull(request.pickupWindow()));
        listing.setWeightKg(request.weightKg());
        listing.setDonor(donor);
        listing.setImages(request.images() == null ? List.of() : List.copyOf(request.images()));
        listing.setTags(request.tags() == null ? List.of() : List.copyOf(request.tags()));
        boolean autoApprove = settingsRepository.findById(1L)
                .map(settings -> settings.isAutoApproveListings())
                .orElse(true);
        listing.setStatus(autoApprove ? ListingStatus.ACTIVE : ListingStatus.PENDING_REVIEW);
        return ApiMapper.listing(listingRepository.save(listing));
    }

    @Transactional
    public ApiDtos.ListingResponse update(User actor, Long listingId, ApiDtos.ListingUpdateRequest request) {
        Listing listing = listingRepository.findByIdForUpdate(listingId)
                .orElseThrow(() -> ApiException.notFound("Listing not found"));
        requireOwnerOrAdmin(actor, listing);
        if (listing.getStatus() == ListingStatus.REMOVED) {
            throw ApiException.conflict("A removed listing cannot be edited");
        }
        if (request.title() != null) listing.setTitle(request.title().trim());
        if (request.description() != null) listing.setDescription(request.description().trim());
        if (request.category() != null) listing.setCategory(findCategory(request.category()));
        if (request.condition() != null) {
            listing.setCondition(ItemCondition.fromDisplayName(request.condition().trim()));
        }
        if (request.quantity() != null) {
            int claimedQuantity = listing.getQuantity() - listing.getAvailableQuantity();
            if (request.quantity() < claimedQuantity) {
                throw ApiException.conflict("Quantity cannot be lower than the amount already claimed");
            }
            listing.setQuantity(request.quantity());
            listing.setAvailableQuantity(request.quantity() - claimedQuantity);
        }
        if (request.location() != null) listing.setLocation(request.location().trim());
        if (request.pickupWindow() != null) listing.setPickupWindow(trimToNull(request.pickupWindow()));
        if (request.weightKg() != null) listing.setWeightKg(request.weightKg());
        if (request.images() != null) listing.setImages(List.copyOf(request.images()));
        if (request.tags() != null) listing.setTags(List.copyOf(request.tags()));
        return ApiMapper.listing(listing);
    }

    @Transactional
    public ApiDtos.ListingResponse remove(User actor, Long listingId) {
        Listing listing = listingRepository.findByIdForUpdate(listingId)
                .orElseThrow(() -> ApiException.notFound("Listing not found"));
        requireOwnerOrAdmin(actor, listing);
        listing.setStatus(ListingStatus.REMOVED);
        return ApiMapper.listing(listing);
    }

    @Transactional
    public ApiDtos.ListingResponse changeStatus(User actor, Long listingId, String statusValue) {
        Listing listing = listingRepository.findByIdForUpdate(listingId)
                .orElseThrow(() -> ApiException.notFound("Listing not found"));
        requireOwnerOrAdmin(actor, listing);
        ListingStatus status = parseStatus(statusValue);
        if (status == ListingStatus.PENDING_REVIEW || status == ListingStatus.REMOVED
                || status == ListingStatus.FLAGGED) {
            throw ApiException.badRequest("This listing status cannot be set by its owner");
        }
        if (listing.getStatus() == ListingStatus.REMOVED) {
            throw ApiException.conflict("A removed listing cannot be reopened");
        }
        listing.setStatus(status);
        return ApiMapper.listing(listing);
    }

    @Transactional
    public ApiDtos.ListingResponse adminSetStatus(Long listingId, String statusValue) {
        Listing listing = listingRepository.findByIdForUpdate(listingId)
                .orElseThrow(() -> ApiException.notFound("Listing not found"));
        ListingStatus status = parseStatus(statusValue);
        listing.setStatus(status);
        return ApiMapper.listing(listing);
    }

    @Transactional(readOnly = true)
    public List<ApiDtos.ListingResponse> adminList() {
        return listingRepository.search(true, null, null, null, null).stream()
                .map(ApiMapper::listing)
                .toList();
    }

    private Category findCategory(String name) {
        return categoryRepository.findByNameIgnoreCase(name.trim())
                .orElseThrow(() -> ApiException.badRequest("Choose a valid listing category"));
    }

    private void requireOwnerOrAdmin(User actor, Listing listing) {
        if (actor.getRole() != Role.ADMIN && !listing.getDonor().getId().equals(actor.getId())) {
            throw ApiException.forbidden("You can only manage your own listings");
        }
    }

    private void requireRole(User user, Role role) {
        if (user.getRole() != role) {
            throw ApiException.forbidden("This action is not available for your account role");
        }
    }

    private ListingStatus parseStatus(String value) {
        try {
            return ListingStatus.valueOf(value.trim().replace('-', '_').toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw ApiException.badRequest("Unsupported listing status");
        }
    }

    private String trimToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
