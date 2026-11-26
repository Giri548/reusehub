package com.reusehub.backend.repository;

import com.reusehub.backend.domain.ItemRequest;
import com.reusehub.backend.domain.RequestStatus;
import jakarta.persistence.LockModeType;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ItemRequestRepository extends JpaRepository<ItemRequest, Long> {
    boolean existsByListingIdAndRequesterIdAndStatusIn(
            Long listingId, Long requesterId, Collection<RequestStatus> statuses);

    List<ItemRequest> findByRequesterIdOrderByCreatedAtDesc(Long requesterId);

    List<ItemRequest> findByListingDonorIdOrderByCreatedAtDesc(Long donorId);

    List<ItemRequest> findAllByOrderByCreatedAtDesc();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select r from ItemRequest r where r.id = :id")
    Optional<ItemRequest> findByIdForUpdate(@Param("id") Long id);

    Optional<ItemRequest> findByPickupCodeIgnoreCaseAndListingDonorId(
            String pickupCode, Long donorId);

    boolean existsByPickupCodeIgnoreCase(String pickupCode);

    long countByStatus(RequestStatus status);
}
