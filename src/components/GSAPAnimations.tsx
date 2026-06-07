"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function GSAPAnimations() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Fade in up for marked elements
        const fadeUpElements = document.querySelectorAll(".reveal-up");
        fadeUpElements.forEach((el) => {
            gsap.fromTo(
                el,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                }
            );
        });

        // Staggered reveal for groups (cards)
        const cardGroups = document.querySelectorAll(".reveal-group");
        cardGroups.forEach((group) => {
            const children = Array.from(group.querySelectorAll(".card"));
            gsap.fromTo(
                children,
                { opacity: 0, y: 30, rotate: -1 },
                {
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                    duration: 0.9,
                    stagger: 0.12,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: group,
                        start: "top 90%",
                        toggleActions: "play none none none",
                    },
                }
            );
        });

        // Parallax effect for images
        const parallaxImages = document.querySelectorAll(".parallax-img");
        parallaxImages.forEach((img) => {
            gsap.to(img, {
                yPercent: -20,
                ease: "none",
                scrollTrigger: {
                    trigger: img,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });
        });

        // subtle hue rotation on root to add color movement
        gsap.to(document.documentElement, {
            duration: 12,
            repeat: -1,
            ease: "none",
            onUpdate: function () {
                const t = this.progress();
                const hue = Math.round(5 + Math.sin(t * Math.PI * 2) * 6);
                document.documentElement.style.setProperty("filter", `hue-rotate(${hue}deg)`);
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return null;
}
