"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { MousePointer2, Star } from "lucide-react";

const cakes = [
    {
        id: 1,
        name: "Classic Chocolate Royale",
        category: "Chocolate Cakes",
        price: "$45",
        image: "/images/chocolate_cake.png",
        rating: 4.9,
    },
    {
        id: 2,
        name: "Velvet Crimson Dream",
        category: "Red Velvet Cakes",
        price: "$50",
        image: "/images/red_velvet_cake.png",
        rating: 5.0,
    },
    {
        id: 3,
        name: "Golden Elegance Tier",
        category: "Wedding Cakes",
        price: "$250+",
        image: "/images/wedding_cake.png",
        rating: 5.0,
    },
    {
        id: 4,
        name: "Pastel Party Cupcakes",
        category: "Cupcakes",
        price: "$35/doz",
        image: "/images/cupcakes.png",
        rating: 4.8,
    },
    {
        id: 5,
        name: "Signature White Rose",
        category: "Theme Cakes",
        price: "$85",
        image: "/images/hero_cake.png",
        rating: 4.9,
    },
    {
        id: 6,
        name: "Divine Berry Ganache",
        category: "Specialty",
        price: "$65",
        image: "/images/chocolate_cake.png", // Reusing for variety in layout
        rating: 4.7,
    },
];

function CakeCard({ cake }: { cake: typeof cakes[0] }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="relative group h-[400px] w-full rounded-3xl bg-cream cursor-pointer card-float card"
        >
            <div
                style={{
                    transform: "translateZ(50px)",
                    transformStyle: "preserve-3d",
                }}
                className="absolute inset-4 rounded-2xl overflow-hidden bg-white shadow-xl group-hover:shadow-2xl transition-shadow"
            >
                <Image
                    src={cake.image}
                    alt={cake.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 parallax-img"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Card Content (Floating above) */}
                <div
                    style={{ transform: "translateZ(30px)" }}
                    className="absolute bottom-6 left-6 right-6 text-white"
                >
                    <div className="flex items-center gap-1 text-gold mb-1">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-bold">{cake.rating}</span>
                    </div>
                    <p className="text-xs text-cream/70 font-medium uppercase tracking-widest">{cake.category}</p>
                    <h3 className="text-xl font-serif font-bold group-hover:text-gold transition-colors">{cake.name}</h3>
                </div>

                <motion.div
                    style={{ transform: "translateZ(40px)" }}
                    className="absolute top-6 right-6 bg-gold text-cream w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg"
                >
                    {cake.price}
                </motion.div>
            </div>

            {/* Behind background glow */}
            <div className="absolute -inset-1 bg-gold opacity-0 group-hover:opacity-20 blur-2xl transition-opacity active:opacity-50" />
        </motion.div>
    );
}

export default function FeaturedCakes() {
    return (
        <section id="collection" className="py-24 px-6 bg-cream">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-chocolate mb-4">
                            Explore Our <span className="text-gold italic">Sweet Creations</span>
                        </h2>
                        <p className="text-chocolate/70 leading-relaxed text-lg">
                            From decadent chocolate masterpieces to ethereal wedding tiers, every cake is
                            told through a perfect balance of flavor, texture, and artistry.
                        </p>
                    </div>
                    <button className="text-chocolate font-bold flex items-center gap-2 group">
                        View All Collection
                        <span className="w-8 h-8 rounded-full bg-chocolate text-cream flex items-center justify-center group-hover:bg-gold transition-colors">
                            <ArrowRight size={16} />
                        </span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 reveal-group">
                    {cakes.map((cake, index) => (
                        <motion.div
                            key={cake.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="card"
                        >
                            <CakeCard cake={cake} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

import { ArrowRight } from "lucide-react";
