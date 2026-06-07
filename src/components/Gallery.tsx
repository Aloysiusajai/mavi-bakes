"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

const galleryImages = [
    { id: 1, src: "/images/hero_cake.png", title: "Signature Wedding", size: "large", category: "Wedding" },
    { id: 2, src: "/images/chocolate_cake.png", title: "Dark Delight", size: "small", category: "Chocolate" },
    { id: 3, src: "/images/red_velvet_cake.png", title: "Velvet Love", size: "medium", category: "Red Velvet" },
    { id: 4, src: "/images/cupcakes.png", title: "Pastel Dreams", size: "large", category: "Cupcakes" },
    { id: 5, src: "/images/wedding_cake.png", title: "Floral Tier", size: "medium", category: "Wedding" },
    { id: 6, src: "/images/chocolate_cake.png", title: "Berry Ganache", size: "small", category: "Chocolate" },
];

export default function Gallery() {
    const [filter, setFilter] = useState<string>("All");
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const categories = Array.from(new Set(galleryImages.map(g => g.category)));
    const filteredImages = filter === "All" ? galleryImages : galleryImages.filter(g => g.category === filter);

    return (
        <section id="gallery" className="py-24 px-6 bg-cream/30">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-chocolate mb-4">
                        Our <span className="text-gold italic">Gallery</span>
                    </h2>
                    <p className="text-chocolate/60 max-w-xl mx-auto">
                        A visual feast of our most beloved creations. Each slice tells a story of
                        meticulous craftsmanship and sweet inspiration.
                    </p>
                </div>
                <div className="mb-8 flex items-center justify-center gap-3">
                    <button onClick={() => setFilter("All")} className={`px-4 py-2 rounded-full ${filter === 'All' ? 'btn-primary' : 'btn-secondary'}`}>All</button>
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-full ${filter === cat ? 'btn-primary' : 'btn-secondary'}`}>{cat}</button>
                    ))}
                </div>

                <div className="gallery-columns reveal-group">
                    {filteredImages.map((image, i) => (
                        <motion.div
                            key={image.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="relative group cursor-pointer rounded-3xl overflow-hidden shadow-lg card gallery-item"
                            onClick={() => setSelectedIndex(i)}
                        >
                            <Image
                                src={image.src}
                                alt={image.title}
                                width={800}
                                height={800}
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 parallax-img"
                            />
                            <div className="absolute inset-0 bg-chocolate/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-cream">
                                <ZoomIn size={40} className="mb-2" />
                                <p className="font-serif text-xl font-bold">{image.title}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedIndex !== null && (
                    <LightboxWrapper
                        images={filteredImages}
                        index={selectedIndex}
                        onClose={() => setSelectedIndex(null)}
                        onChangeIndex={(next) => setSelectedIndex(next)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}

function LightboxWrapper({ images, index, onClose, onChangeIndex }: { images: typeof galleryImages, index: number, onClose: () => void, onChangeIndex: (i: number) => void }) {
    // Manage keyboard navigation
    const handleKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowRight") onChangeIndex(Math.min(images.length - 1, index + 1));
        if (e.key === "ArrowLeft") onChangeIndex(Math.max(0, index - 1));
    };

    // attach listeners
    if (typeof window !== "undefined") {
        window.addEventListener("keydown", handleKey);
    }

    // Cleanup on unmount
    const cleanup = () => {
        if (typeof window !== "undefined") window.removeEventListener("keydown", handleKey);
    };

    // ensure cleanup when component unmounts
    try { /* noop to satisfy TS in this small wrapper */ } catch (e) {}

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 glass-dark"
            onClick={() => { cleanup(); onClose(); }}
        >
            <button
                className="absolute top-8 right-8 text-cream hover:text-gold transition-colors"
                onClick={(e) => { e.stopPropagation(); cleanup(); onClose(); }}
            >
                <X size={36} />
            </button>

            <button className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-cream" onClick={(e) => { e.stopPropagation(); onChangeIndex(Math.max(0, index - 1)); }} aria-label="Previous">
                ‹
            </button>

            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-5xl max-h-[80vh] w-full md:aspect-video rounded-3xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={images[index].src}
                    alt={images[index].title}
                    fill
                    className="object-contain"
                />
            </motion.div>

            <button className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-cream" onClick={(e) => { e.stopPropagation(); onChangeIndex(Math.min(images.length - 1, index + 1)); }} aria-label="Next">
                ›
            </button>
        </motion.div>
    );
}
