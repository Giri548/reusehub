package com.reusehub.backend.controller;

import com.reusehub.backend.domain.User;
import com.reusehub.backend.dto.ApiDtos;
import com.reusehub.backend.service.CurrentUserService;
import com.reusehub.backend.service.NotificationService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final CurrentUserService currentUserService;
    private final NotificationService notificationService;

    public NotificationController(
            CurrentUserService currentUserService,
            NotificationService notificationService) {
        this.currentUserService = currentUserService;
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<ApiDtos.NotificationResponse> list() {
        User user = currentUserService.requireCurrentUser();
        return notificationService.list(user);
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unreadCount() {
        return Map.of("count", notificationService.unreadCount(currentUserService.requireCurrentUser()));
    }

    @PatchMapping("/{notificationId}/read")
    public ApiDtos.NotificationResponse markRead(@PathVariable Long notificationId) {
        return notificationService.markRead(currentUserService.requireCurrentUser(), notificationId);
    }

    @PatchMapping("/read-all")
    public Map<String, String> markAllRead() {
        notificationService.markAllRead(currentUserService.requireCurrentUser());
        return Map.of("status", "ok");
    }
}
