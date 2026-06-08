"use client";

import { useEffect } from "react";
import { motion, useSpring } from "framer-motion";

export default function MouseGlow() {
    const springConfig = { damping: 25, stiffness: 150 };
    const mouseX = useSpring(0, springConfig);
    const mouseY = useSpring(0, springConfig);

    useEffect(() => {
        let raf: number | null = null;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);

        // ensure RAF loop keeps CSS vars in sync
        const loop = () => {
            document.documentElement.style.setProperty("--mouse-x", `${mouseX.get()}px`);
            document.documentElement.style.setProperty("--mouse-y", `${mouseY.get()}px`);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[60]">
            <motion.div
                className="absolute inset-0 glow-blob"
                style={{
                    background: `radial-gradient(500px at var(--mouse-x) var(--mouse-y), rgba(212,175,55,0.08), transparent 60%)`,
                }}
            />

            <motion.div
                className="absolute inset-0 glow-blob"
                style={{
                    background: `radial-gradient(300px at calc(var(--mouse-x) + 120px) calc(var(--mouse-y) - 80px), rgba(255,255,255,0.06), transparent 50%)`,
                    mixBlendMode: "overlay",
                    opacity: 0.8,
                }}
            />
        </div>
    );
}
