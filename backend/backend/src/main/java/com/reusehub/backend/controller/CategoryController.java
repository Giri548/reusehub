package com.reusehub.backend.controller;

import com.reusehub.backend.dto.ApiDtos;
import com.reusehub.backend.service.CategoryService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<ApiDtos.CategoryResponse> list() {
        return categoryService.list();
    }
}
