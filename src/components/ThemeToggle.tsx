import React, { useEffect, useState } from "react";
import "./ThemeToggle.css";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark" | null>(null);

    useEffect(() => {
        // Initial check
        if (
            localStorage.getItem("color-theme") === "dark" ||
            (!("color-theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            setTheme("dark");
            document.documentElement.classList.add("dark");
        } else {
            setTheme("light");
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("color-theme", newTheme);

        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    // Prevent hydration mismatch by not rendering until mounted (optional strategy),
    // but for a toggle in header, we might want it visible.
    // Ideally, we render a placeholder or the button.
    // The state is 'null' initially to indicate "unknown".
    // However, for SSG/SSR, we might want to default to something or accept a prop.
    // Since Astro is static, the initial HTML won't have the 'dark' class logic running until JS loads.
    // The original script handled this inline to prevent FOUC (flash of unstyled content) or mismatch.
    // React components hydrate later.

    return (
        <button
            id="theme-toggle-react"
            type="button"
            onClick={toggleTheme}
            className="theme-toggle text-neutral-400 hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold/50 rounded-full text-sm p-2.5 transition-colors"
            aria-label="Alternar modo oscuro/claro"
        >
            <svg
                className="sun-and-moon"
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
            >
                <mask className="moon" id="moon-mask-react">
                    <rect x="0" y="0" width="100%" height="100%" fill="white"></rect>
                    <circle cx="24" cy="10" r="6" fill="black"></circle>
                </mask>
                <circle
                    className="sun"
                    cx="12"
                    cy="12"
                    r="6"
                    mask="url(#moon-mask-react)"
                    fill="currentColor"
                ></circle>
                <g className="sun-beams" stroke="currentColor">
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </g>
            </svg>
        </button>
    );
}
