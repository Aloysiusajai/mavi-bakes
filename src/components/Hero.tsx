"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useEffect, useState } from "react";

export default function Hero() {
    const [mounted, setMounted] = useState(false);
    const [blobs, setBlobs] = useState<{
        x: string;
        y: string;
        scale: number;
        width: string;
        height: string;
    }[] | null>(null);
    const [sparkles, setSparkles] = useState<{ top: string; left: string }[] | null>(null);

    useEffect(() => {
        setMounted(true);

        // Generate deterministic random-like values on the client only
        const b = [...Array(6)].map(() => ({
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.5,
            width: Math.round(Math.random() * 400 + 200) + "px",
            height: Math.round(Math.random() * 400 + 200) + "px",
        }));
        setBlobs(b);

        const s = [...Array(20)].map(() => ({
            top: Math.random() * 100 + "%",
            left: Math.random() * 100 + "%",
        }));
        setSparkles(s);
    }, []);

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-animated-gradient"
        >
            {/* Floating Elements Backdrop */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {mounted && blobs
                    ? blobs.map((b, i) => (
                          <motion.div
                              key={i}
                              className="absolute rounded-full bg-gold/10 blur-3xl"
                              initial={{ x: b.x, y: b.y, scale: b.scale }}
                              animate={{ y: ["-20%", "20%"], x: ["-10%", "10%"] }}
                              transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                              style={{ width: b.width, height: b.height }}
                          />
                      ))
                    : null}

                {/* Sugar Sparkles */}
                {mounted && sparkles
                    ? sparkles.map((s, i) => (
                          <motion.div
                              key={`sparkle-${i}`}
                              className="absolute w-1 h-1 bg-gold rounded-full"
                              style={{ top: s.top, left: s.left }}
                              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                              transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
                          />
                      ))
                    : null}
            </div>

            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold font-medium mb-6 backdrop-blur-sm border border-gold/20"
                    >
                        Handcrafted with love since 2019
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-chocolate leading-tight mb-6">
                        Freshly Baked <br />
                        <span className="text-gradient">Homemade Cakes</span> <br />
                        Made with Love
                    </h1>
                    <p className="text-lg text-chocolate/80 mb-10 max-w-lg leading-relaxed">
                        Custom Cakes for Birthdays, Weddings, Anniversaries & Special Moments.
                        Experience the magic of authentic homemade flavors crafted to perfection.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary flex items-center gap-2"
                        >
                            Order Now <ArrowRight size={20} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Play size={18} fill="currentColor" /> View Collection
                        </motion.button>
                    </div>

                    {/* Stats quick view */}
                    <div className="mt-12 flex gap-8">
                        <div>
                            <p className="text-3xl font-bold font-serif text-chocolate">5k+</p>
                            <p className="text-sm text-chocolate/60">Cakes Delivered</p>
                        </div>
                        <div className="w-px h-12 bg-chocolate/10" />
                        <div>
                            <p className="text-3xl font-bold font-serif text-chocolate">1k+</p>
                            <p className="text-sm text-chocolate/60">Happy Clients</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative"
                >
                    <div className="relative z-10 animate-float">
                        <div className="relative w-full aspect-square max-w-[500px] mx-auto rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(62,39,35,0.3)]">
                            <Image
                                src="/images/hero_cake.png"
                                alt="Signature Cake"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Overlay badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-10 -left-10 glass p-6 rounded-2xl shadow-2xl z-20 hidden lg:block"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-cream" style={{ background: 'linear-gradient(135deg, var(--color-pastry), var(--color-cinnamon))' }}>
                                    <span className="text-xl font-bold">100%</span>
                                </div>
                                <div>
                                    <p className="font-bold text-chocolate whitespace-nowrap">Organic Ingredients</p>
                                    <p className="text-xs text-chocolate/60">Freshly sourced daily</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Decorative ornaments */}
                    <div className="absolute top-1/2 -right-12 w-24 h-24 bg-blush rounded-full blur-2xl opacity-60" />
                    <div className="absolute -top-12 left-1/4 w-32 h-32 bg-beige rounded-full blur-2xl opacity-60" />
                </motion.div>
            </div>
        </section>
    );
}
