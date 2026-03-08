import { describe, it, expect } from "vitest";
import { formatPrice, formatNumber, truncateText, isValidEmail } from "./helpers";

describe("Helper Functions", () => {
    describe("formatPrice", () => {
        it("should format number as Chilean peso", () => {
            expect(formatPrice(1000)).toBe("$1.000");
            expect(formatPrice(1000000)).toBe("$1.000.000");
            expect(formatPrice(999)).toBe("$999");
        });

        it("should handle string input", () => {
            expect(formatPrice("1500")).toBe("$1.500");
            expect(formatPrice("999999")).toBe("$999.999");
        });

        it("should return $0 for invalid input", () => {
            expect(formatPrice("invalid")).toBe("$0");
            expect(formatPrice(NaN)).toBe("$0");
        });

        it("should handle zero", () => {
            expect(formatPrice(0)).toBe("$0");
        });

        it("should handle negative numbers", () => {
            expect(formatPrice(-1000)).toBe("$-1.000");
        });

        it("should handle decimal numbers (truncated to integer)", () => {
            expect(formatPrice(1500.99)).toBe("$1.501");
        });
    });

    describe("formatNumber", () => {
        it("should format number with thousand separators", () => {
            expect(formatNumber(1000)).toBe("1.000");
            expect(formatNumber(1000000)).toBe("1.000.000");
        });

        it("should handle small numbers", () => {
            expect(formatNumber(999)).toBe("999");
            expect(formatNumber(1)).toBe("1");
        });

        it("should handle zero", () => {
            expect(formatNumber(0)).toBe("0");
        });

        it("should handle negative numbers", () => {
            expect(formatNumber(-1000)).toBe("-1.000");
        });
    });

    describe("truncateText", () => {
        it("should not truncate text shorter than maxLength", () => {
            expect(truncateText("Hello", 10)).toBe("Hello");
            expect(truncateText("Test", 10)).toBe("Test");
        });

        it("should truncate text longer than maxLength with ellipsis", () => {
            expect(truncateText("Hello World", 5)).toBe("Hello...");
            expect(truncateText("This is a long text", 7)).toBe("This is...");
        });

        it("should handle exact maxLength", () => {
            expect(truncateText("Testing", 7)).toBe("Testing");
        });

        it("should handle empty string", () => {
            expect(truncateText("", 5)).toBe("");
        });

        it("should handle maxLength of 0", () => {
            expect(truncateText("Hello", 0)).toBe("...");
        });
    });

    describe("isValidEmail", () => {
        it("should validate correct email addresses", () => {
            expect(isValidEmail("test@example.com")).toBe(true);
            expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
            expect(isValidEmail("valid_email@test123.org")).toBe(true);
        });

        it("should reject invalid email addresses", () => {
            expect(isValidEmail("notanemail")).toBe(false);
            expect(isValidEmail("@example.com")).toBe(false);
            expect(isValidEmail("user@")).toBe(false);
            expect(isValidEmail("user @example.com")).toBe(false);
            expect(isValidEmail("user@example")).toBe(false);
        });

        it("should handle empty string", () => {
            expect(isValidEmail("")).toBe(false);
        });

        it("should handle special characters", () => {
            expect(isValidEmail("user+tag@example.com")).toBe(true);
            expect(isValidEmail("user-name@example.com")).toBe(true);
        });
    });
});
