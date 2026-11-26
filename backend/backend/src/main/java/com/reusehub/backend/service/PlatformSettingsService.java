package com.reusehub.backend.service;

import com.reusehub.backend.domain.PlatformSettings;
import com.reusehub.backend.dto.ApiDtos;
import com.reusehub.backend.repository.PlatformSettingsRepository;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PlatformSettingsService {
    private final PlatformSettingsRepository settingsRepository;

    public PlatformSettingsService(PlatformSettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    @Transactional(readOnly = true)
    public ApiDtos.PlatformSettingsResponse get() {
        return ApiMapper.settings(settingsRepository.findById(1L).orElseGet(PlatformSettings::new));
    }

    @Transactional
    public ApiDtos.PlatformSettingsResponse update(ApiDtos.PlatformSettingsRequest request) {
        PlatformSettings settings = settingsRepository.findById(1L).orElseGet(PlatformSettings::new);
        settings.setId(1L);
        settings.setAutoApproveListings(request.autoApproveListings());
        settings.setMaxActiveClaimsPerUser(request.maxActiveClaimsPerUser());
        settings.setRequirePurposeStatement(request.requirePurposeStatement());
        settings.setMaintenanceBanner(request.maintenanceBanner());
        settings.setPlatformEmail(request.platformEmail().trim().toLowerCase(Locale.ROOT));
        settings.setPickupGraceMinutes(request.pickupGraceMinutes());
        return ApiMapper.settings(settingsRepository.save(settings));
    }
}
