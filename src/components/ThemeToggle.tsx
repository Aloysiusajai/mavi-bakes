"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (typeof window === "undefined") return "light";
        return (localStorage.getItem("theme") as "light" | "dark") || "light";
    });

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute("data-theme", theme);
        try {
            localStorage.setItem("theme", theme);
        } catch {
            // ignore
        }
    }, [theme]);

    const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

    return (
        <button
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            onClick={toggle}
            className="p-2 rounded-full btn-secondary flex items-center justify-center"
            title="Toggle theme"
        >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
    );
}
