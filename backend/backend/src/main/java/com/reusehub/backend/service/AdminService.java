package com.reusehub.backend.service;

import com.reusehub.backend.domain.AccountStatus;
import com.reusehub.backend.domain.ListingStatus;
import com.reusehub.backend.domain.RequestStatus;
import com.reusehub.backend.domain.User;
import com.reusehub.backend.dto.ApiDtos;
import com.reusehub.backend.repository.ItemRequestRepository;
import com.reusehub.backend.repository.ListingRepository;
import com.reusehub.backend.repository.UserRepository;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final ListingRepository listingRepository;
    private final ItemRequestRepository requestRepository;

    public AdminService(
            UserRepository userRepository,
            ListingRepository listingRepository,
            ItemRequestRepository requestRepository) {
        this.userRepository = userRepository;
        this.listingRepository = listingRepository;
        this.requestRepository = requestRepository;
    }

    @Transactional(readOnly = true)
    public ApiDtos.AdminDashboardResponse dashboard() {
        Map<String, Long> listingsByCategory = listingRepository.countListingsByCategory().stream()
                .collect(Collectors.toMap(
                        ListingRepository.CategoryListingCount::getCategoryName,
                        ListingRepository.CategoryListingCount::getListingCount));
        return new ApiDtos.AdminDashboardResponse(
                userRepository.count(),
                userRepository.countByStatus(AccountStatus.ACTIVE),
                listingRepository.countByStatusNot(ListingStatus.REMOVED),
                listingRepository.countByStatus(ListingStatus.ACTIVE),
                requestRepository.count(),
                requestRepository.countByStatus(RequestStatus.PENDING),
                requestRepository.countByStatus(RequestStatus.COMPLETED),
                listingsByCategory);
    }

    @Transactional(readOnly = true)
    public java.util.List<ApiDtos.UserResponse> users() {
        return userRepository.findAllByOrderByJoinedAtDesc().stream()
                .map(ApiMapper::user)
                .toList();
    }

    @Transactional
    public ApiDtos.UserResponse setUserStatus(User actor, Long userId, String statusValue) {
        if (actor.getId().equals(userId)) {
            throw ApiException.conflict("You cannot disable your own administrator account");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found"));
        AccountStatus status;
        try {
            status = AccountStatus.valueOf(statusValue.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw ApiException.badRequest("Unsupported account status");
        }
        user.setStatus(status);
        return ApiMapper.user(user);
    }
}
