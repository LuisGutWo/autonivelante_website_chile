import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, expect, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// ========================================
// CLEANUP AFTER EACH TEST
// ========================================
afterEach(() => {
    cleanup();
});

// ========================================
// MOCK NEXT/NAVIGATION
// ========================================
vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
        prefetch: vi.fn(),
        pathname: "/",
    }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({}),
}));

// ========================================
// MOCK NEXT/IMAGE
// ========================================

vi.mock("next/image", () => ({
    default: (props: any) => props,
}));
// ========================================
// GLOBAL MOCKS
// ========================================
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// ========================================
// SUPPRESS CONSOLE WARNINGS IN TESTS
// ========================================
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
    console.error = vi.fn((...args) => {
        if (
            typeof args[0] === "string" &&
            args[0].includes("Warning: ReactDOM.render")
        ) {
            return;
        }

        originalError.call(console, ...args);
    });

    console.warn = vi.fn((...args) => {
        if (typeof args[0] === "string" && args[0].includes("Warning:")) {
            return;
        }
        originalWarn.call(console, ...args);
    });
});

afterAll(() => {
    console.error = originalError;
    console.warn = originalWarn;
});
