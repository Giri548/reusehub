package com.reusehub.backend.repository;

import com.reusehub.backend.domain.OrganizationVerification;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationVerificationRepository
        extends JpaRepository<OrganizationVerification, Long> {
    List<OrganizationVerification> findAllByOrderBySubmittedAtDesc();

    List<OrganizationVerification> findBySubmittedByIdOrderBySubmittedAtDesc(Long submittedById);
}
