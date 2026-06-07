"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heart, Award, Users, UtensilsCrossed } from "lucide-react";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = value;
            const duration = 2000;
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return <span ref={ref}>{count}{suffix}</span>;
}

export default function AboutUs() {
    const stats = [
        { icon: <Users className="text-gold" />, label: "Happy Customers", value: 1000, suffix: "+" },
        { icon: <UtensilsCrossed className="text-gold" />, label: "Cakes Delivered", value: 5000, suffix: "+" },
        { icon: <Award className="text-gold" />, label: "Years Experience", value: 5, suffix: "+" },
        { icon: <Heart className="text-gold" />, label: "Secret Recipes", value: 100, suffix: "%" },
    ];

    return (
        <section id="about" className="py-24 px-6 overflow-hidden bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 pt-12">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="rounded-3xl overflow-hidden shadow-xl aspect-[3/4] relative"
                                >
                                    <Image src="/images/cupcakes.png" alt="Baker working" fill className="object-cover" />
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="rounded-3xl overflow-hidden shadow-xl aspect-square relative"
                                >
                                    <Image src="/images/chocolate_cake.png" alt="Cake decorating" fill className="object-cover" />
                                </motion.div>
                            </div>
                            <div className="space-y-4">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="rounded-3xl overflow-hidden shadow-xl aspect-square relative"
                                >
                                    <Image src="/images/red_velvet_cake.png" alt="Storefront" fill className="object-cover" />
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="rounded-3xl overflow-hidden shadow-xl aspect-[3/4] relative"
                                >
                                    <Image src="/images/wedding_cake.png" alt="Fresh ingredients" fill className="object-cover" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Decorative badge */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gold rounded-full flex flex-col items-center justify-center text-cream shadow-2xl z-10 border-4 border-white">
                            <span className="text-sm uppercase font-bold tracking-tighter">Est.</span>
                            <span className="text-2xl font-serif font-black">2019</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h4 className="text-gold font-bold uppercase tracking-widest mb-4">Our Story</h4>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-chocolate mb-8 leading-tight">
                            Baking Dreams into <br />
                            <span className="italic">Delicious Reality</span>
                        </h2>
                        <p className="text-chocolate/80 text-lg leading-relaxed mb-6">
                            What started in a small home kitchen with a single whisk and a mountain of flour has grown into a destination for cake lovers. Our passion lies in the art of traditional baking, where every ingredient is handpicked and every recipe is perfected over time.
                        </p>
                        <p className="text-chocolate/80 text-lg leading-relaxed mb-10">
                            We believe that cakes are more than just dessert—they are central to life's most precious celebrations. That's why we pour our heart into every swirl of frosting and every layer of sponge.
                        </p>

                        <div className="grid grid-cols-2 gap-8">
                            {stats.map((stat, i) => (
                                <div key={i} className="flex flex-col">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                                            {stat.icon}
                                        </div>
                                        <span className="text-3xl font-serif font-bold text-chocolate">
                                            <Counter value={stat.value} suffix={stat.suffix} />
                                        </span>
                                    </div>
                                    <span className="text-sm text-chocolate/60 font-medium">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
