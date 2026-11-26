package com.reusehub.backend.service;

import com.reusehub.backend.dto.ApiDtos;
import com.reusehub.backend.repository.CategoryRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<ApiDtos.CategoryResponse> list() {
        return categoryRepository.findAllByOrderByNameAsc().stream()
                .map(ApiMapper::category)
                .toList();
    }
}
