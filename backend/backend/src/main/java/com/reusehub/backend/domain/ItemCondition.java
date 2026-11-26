package com.reusehub.backend.domain;

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
        for (ItemCondition condition : values()) {
            if (condition.displayName.equalsIgnoreCase(value)
                    || condition.name().equalsIgnoreCase(value)) {
                return condition;
            }
        }
        throw new IllegalArgumentException("Unsupported item condition");
    }
}
