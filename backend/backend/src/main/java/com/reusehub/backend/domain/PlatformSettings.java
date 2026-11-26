package com.reusehub.backend.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "platform_settings")
@Getter
@Setter
@NoArgsConstructor
public class PlatformSettings {
    @Id
    private Long id = 1L;

    @Column(name = "auto_approve_listings", nullable = false)
    private boolean autoApproveListings = true;

    @Column(name = "max_active_claims_per_user", nullable = false)
    private int maxActiveClaimsPerUser = 5;

    @Column(name = "require_purpose_statement", nullable = false)
    private boolean requirePurposeStatement = true;

    @Column(name = "maintenance_banner", nullable = false)
    private boolean maintenanceBanner;

    @Column(name = "platform_email", nullable = false, length = 254)
    private String platformEmail = "support@reusehub.org";

    @Column(name = "pickup_grace_minutes", nullable = false)
    private int pickupGraceMinutes = 30;
}
