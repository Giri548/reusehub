package com.reusehub.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "organization_verifications")
@Getter
@Setter
@NoArgsConstructor
public class OrganizationVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "submitted_by_id", nullable = false)
    private User submittedBy;

    @Column(name = "organization_name", nullable = false, length = 180)
    private String organizationName;

    @Column(name = "organization_type", nullable = false, length = 100)
    private String organizationType;

    @Column(name = "contact_person", nullable = false, length = 120)
    private String contactPerson;

    @Column(nullable = false, length = 254)
    private String email;

    @Column(name = "registration_number", nullable = false, length = 120)
    private String registrationNumber;

    @Column(nullable = false, length = 180)
    private String location;

    @Column(name = "document_name", length = 255)
    private String documentName;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReviewStatus status = ReviewStatus.PENDING;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    void setSubmittedAt() {
        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
    }
}
