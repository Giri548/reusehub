package com.reusehub.backend.repository;

import com.reusehub.backend.domain.Listing;
import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ListingRepository extends JpaRepository<Listing, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select l from Listing l where l.id = :id")
    Optional<Listing> findByIdForUpdate(@Param("id") Long id);

    List<Listing> findByDonorIdOrderByCreatedAtDesc(Long donorId);

    @Query("""
            select l from Listing l
            join fetch l.category
            join fetch l.donor
            where (:includeUnavailable = true or
                  (l.status = com.reusehub.backend.domain.ListingStatus.ACTIVE
                   and l.availableQuantity > 0))
              and (:search is null or
                   lower(l.title) like lower(concat('%', :search, '%')) or
                   lower(l.description) like lower(concat('%', :search, '%')) or
                   lower(l.location) like lower(concat('%', :search, '%')) or
                   lower(coalesce(l.donor.organization, '')) like lower(concat('%', :search, '%')))
              and (:category is null or lower(l.category.name) = lower(:category))
              and (:condition is null or lower(cast(l.condition as string)) = lower(:condition))
              and (:location is null or lower(l.location) like lower(concat('%', :location, '%')))
            order by l.createdAt desc
            """)
    List<Listing> search(
            @Param("includeUnavailable") boolean includeUnavailable,
            @Param("search") String search,
            @Param("category") String category,
            @Param("condition") String condition,
            @Param("location") String location);

    long countByStatus(com.reusehub.backend.domain.ListingStatus status);

    long countByStatusNot(com.reusehub.backend.domain.ListingStatus status);

    interface CategoryListingCount {
        String getCategoryName();

        long getListingCount();
    }

    @Query("""
            select c.name as categoryName, count(l) as listingCount
            from Listing l join l.category c
            where l.status <> com.reusehub.backend.domain.ListingStatus.REMOVED
            group by c.name
            """)
    List<CategoryListingCount> countListingsByCategory();
}
