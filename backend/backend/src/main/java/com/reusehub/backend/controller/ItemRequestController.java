package com.reusehub.backend.controller;

import com.reusehub.backend.dto.ApiDtos;
import com.reusehub.backend.service.CurrentUserService;
import com.reusehub.backend.service.ItemRequestService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/requests")
public class ItemRequestController {
    private final CurrentUserService currentUserService;
    private final ItemRequestService itemRequestService;

    public ItemRequestController(
            CurrentUserService currentUserService,
            ItemRequestService itemRequestService) {
        this.currentUserService = currentUserService;
        this.itemRequestService = itemRequestService;
    }

    @GetMapping
    public List<ApiDtos.ItemRequestResponse> list() {
        return itemRequestService.listFor(currentUserService.requireCurrentUser());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiDtos.ItemRequestResponse create(@Valid @RequestBody ApiDtos.ItemRequestCreateRequest request) {
        return itemRequestService.create(currentUserService.requireCurrentUser(), request);
    }

    @PatchMapping("/{requestId}/status")
    public ApiDtos.ItemRequestResponse updateStatus(
            @PathVariable Long requestId,
            @Valid @RequestBody ApiDtos.RequestStatusRequest request) {
        return itemRequestService.updateStatus(currentUserService.requireCurrentUser(), requestId, request);
    }

    @PostMapping("/{requestId}/verify-pickup")
    public ApiDtos.ItemRequestResponse verifyPickup(
            @PathVariable Long requestId,
            @Valid @RequestBody ApiDtos.PickupVerificationRequest request) {
        return itemRequestService.verifyPickup(
                currentUserService.requireCurrentUser(), requestId, request.pickupCode());
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        List<ApiDtos.ItemRequestResponse> requests =
                itemRequestService.listFor(currentUserService.requireCurrentUser());
        long active = requests.stream()
                .filter(request -> request.status().equalsIgnoreCase("pending")
                        || request.status().equalsIgnoreCase("approved"))
                .count();
        long completed = requests.stream()
                .filter(request -> request.status().equalsIgnoreCase("completed"))
                .count();
        return Map.of("total", requests.size(), "active", active, "completed", completed);
    }
}
