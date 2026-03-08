import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    test: {
        // ========================================
        // ENVIRONMENT SETUP
        // ========================================
        environment: "happy-dom",
        globals: true, // Enable global describe, it, expect

        // ========================================
        // SETUP FILES
        // ========================================
        setupFiles: ["./vitest.setup.ts"],

        // ========================================
        // COVERAGE & REPORTING
        // ========================================
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            exclude: [
                "node_modules/",
                "vitest.setup.ts",
                "**/*.stories.tsx",
                "**/*.test.ts",
                "**/*.test.tsx",
            ],
        },

        // ========================================
        // PERFORMANCE
        // ========================================
        testTimeout: 10000,
        hookTimeout: 10000,

        // ========================================
        // UI & REPORTING
        // ========================================
        reporters: ["default"],
        outputFile: "./test-results.json",
    },

    // ========================================
    // RESOLVE CONFIG
    // ========================================
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./"),
            "@/src": path.resolve(__dirname, "./src"),
            "@/redis": path.resolve(__dirname, "./redux"),
            "@/app": path.resolve(__dirname, "./app"),
            "@/public": path.resolve(__dirname, "./public"),
        },
    },
});
