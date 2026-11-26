package com.reusehub.backend.repository;

import com.reusehub.backend.domain.ModerationReport;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModerationReportRepository extends JpaRepository<ModerationReport, Long> {
    List<ModerationReport> findAllByOrderByCreatedAtDesc();
}
