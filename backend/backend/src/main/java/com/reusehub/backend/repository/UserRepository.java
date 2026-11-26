package com.reusehub.backend.repository;

import com.reusehub.backend.domain.AccountStatus;
import com.reusehub.backend.domain.Role;
import com.reusehub.backend.domain.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    List<User> findAllByOrderByJoinedAtDesc();

    List<User> findByRoleOrderByJoinedAtDesc(Role role);

    long countByStatus(AccountStatus status);
}
