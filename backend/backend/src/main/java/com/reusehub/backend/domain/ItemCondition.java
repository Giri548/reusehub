package com.reusehub.backend.domain;

import java.util.Locale;

public enum ItemCondition {
    LIKE_NEW("Like New"),
    GOOD("Good"),
    FAIR("Fair"),
    REFURBISHED("Refurbished");

    private final String displayName;

    ItemCondition(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static ItemCondition fromDisplayName(String value) {
        String normalizedValue = normalize(value);
        for (ItemCondition condition : values()) {
            if (normalize(condition.displayName).equals(normalizedValue)
                    || normalize(condition.name()).equals(normalizedValue)) {
                return condition;
            }
        }
        throw new IllegalArgumentException("Unsupported item condition");
    }

    private static String normalize(String value) {
        return value == null
                ? ""
                : value.replaceAll("[\\s_-]+", "").toLowerCase(Locale.ROOT);
    }
}
