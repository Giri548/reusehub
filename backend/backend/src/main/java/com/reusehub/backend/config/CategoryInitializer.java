package com.reusehub.backend.config;

import com.reusehub.backend.domain.Category;
import com.reusehub.backend.repository.CategoryRepository;
import java.util.List;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CategoryInitializer {
    @Bean
    ApplicationRunner initializeCategories(CategoryRepository categories) {
        return args -> {
            List<Category> defaults = List.of(
                    new Category("Books", "Textbooks, novels, study guides and stories"),
                    new Category("Furniture", "Desks, chairs, bookshelves and tables"),
                    new Category("Electronics", "Laptops, monitors, calculators and accessories"),
                    new Category("Stationery", "Notebooks, art supplies, binders and office kits"),
                    new Category("Others", "Tools, sports gear, storage and other resources"));
            for (Category category : defaults) {
                if (!categories.existsByNameIgnoreCase(category.getName())) {
                    categories.save(category);
                }
            }
        };
    }
}
