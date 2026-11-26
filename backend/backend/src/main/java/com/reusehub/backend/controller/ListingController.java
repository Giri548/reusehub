package com.reusehub.backend.controller;

import com.reusehub.backend.domain.User;
import com.reusehub.backend.dto.ApiDtos;
import com.reusehub.backend.service.CurrentUserService;
import com.reusehub.backend.service.ListingService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/listings")
public class ListingController {
    private final ListingService listingService;
    private final CurrentUserService currentUserService;

    public ListingController(ListingService listingService, CurrentUserService currentUserService) {
        this.listingService = listingService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public List<ApiDtos.ListingResponse> search(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) String location) {
        return listingService.search(search, category, condition, location, false);
    }

    @GetMapping("/{listingId}")
    public ApiDtos.ListingResponse get(@PathVariable Long listingId) {
        return listingService.getPublic(listingId);
    }

    @GetMapping("/mine")
    public List<ApiDtos.ListingResponse> mine() {
        return listingService.mine(currentUserService.requireCurrentUser());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiDtos.ListingResponse create(@Valid @RequestBody ApiDtos.ListingCreateRequest request) {
        return listingService.create(currentUserService.requireCurrentUser(), request);
    }

    @PutMapping("/{listingId}")
    public ApiDtos.ListingResponse update(
            @PathVariable Long listingId,
            @Valid @RequestBody ApiDtos.ListingUpdateRequest request) {
        return listingService.update(currentUserService.requireCurrentUser(), listingId, request);
    }

    @PatchMapping("/{listingId}/status")
    public ApiDtos.ListingResponse changeStatus(
            @PathVariable Long listingId,
            @Valid @RequestBody ApiDtos.ListingStatusRequest request) {
        return listingService.changeStatus(currentUserService.requireCurrentUser(), listingId, request.status());
    }

    @DeleteMapping("/{listingId}")
    public ApiDtos.ListingResponse remove(@PathVariable Long listingId) {
        return listingService.remove(currentUserService.requireCurrentUser(), listingId);
    }
}
