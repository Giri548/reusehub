package com.reusehub.backend.service;

import com.reusehub.backend.domain.Listing;
import com.reusehub.backend.domain.ModerationReport;
import com.reusehub.backend.domain.ReportSeverity;
import com.reusehub.backend.domain.ReportStatus;
import com.reusehub.backend.domain.User;
import com.reusehub.backend.dto.ApiDtos;
import com.reusehub.backend.repository.ListingRepository;
import com.reusehub.backend.repository.ModerationReportRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ModerationService {
    private final ModerationReportRepository reportRepository;
    private final ListingRepository listingRepository;

    public ModerationService(
            ModerationReportRepository reportRepository,
            ListingRepository listingRepository) {
        this.reportRepository = reportRepository;
        this.listingRepository = listingRepository;
    }

    @Transactional
    public ApiDtos.ReportResponse report(User reporter, Long listingId, ApiDtos.ReportRequest input) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> ApiException.notFound("Listing not found"));
        ModerationReport report = new ModerationReport();
        report.setListing(listing);
        report.setReportedBy(reporter);
        report.setReason(input.reason().trim());
        report.setSeverity(parseSeverity(input.severity()));
        return ApiMapper.report(reportRepository.save(report));
    }

    @Transactional(readOnly = true)
    public List<ApiDtos.ReportResponse> adminList() {
        return reportRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(ApiMapper::report)
                .toList();
    }

    @Transactional
    public ApiDtos.ReportResponse review(Long reportId, String statusValue) {
        ModerationReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> ApiException.notFound("Report not found"));
        ReportStatus status;
        try {
            status = ReportStatus.valueOf(statusValue.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw ApiException.badRequest("Unsupported report status");
        }
        report.setStatus(status);
        return ApiMapper.report(report);
    }

    private ReportSeverity parseSeverity(String value) {
        if (value == null || value.isBlank()) {
            return ReportSeverity.MEDIUM;
        }
        try {
            return ReportSeverity.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw ApiException.badRequest("Unsupported report severity");
        }
    }
}
