"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Bride",
        content: "The wedding cake was beyond my expectations! Not only was it stunningly beautiful, but every layer was incredibly moist and flavorful. Our guests couldn't stop talking about it.",
        image: "/images/wedding_cake.png",
        rating: 5,
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Birthday Boy",
        content: "Ordered a custom chocolate cake for my graduation. The ganache was so rich and the presentation was top-tier. Best homemade cake in the city, hands down!",
        image: "/images/chocolate_cake.png",
        rating: 5,
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        role: "Party Planner",
        content: "I've worked with many bakeries, but the attention to detail here is unmatched. The cupcakes were consistent, elegant, and absolutely delicious. Highly recommend!",
        image: "/images/cupcakes.png",
        rating: 5,
    },
];

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    useEffect(() => {
        const timer = setInterval(next, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-24 px-6 bg-chocolate text-cream relative overflow-hidden">
            {/* Decorative bg element */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blush/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-5xl mx-auto relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16"
                >
                    <Quote size={60} className="text-gold opacity-30 mx-auto mb-6" />
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                        Sweet Words from <span className="text-gold">Our Clients</span>
                    </h2>
                </motion.div>

                <div className="relative reveal-group">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="glass p-12 md:p-16 rounded-[40px] border-white/10 card"
                        >
                            <div className="flex flex-col items-center">
                                <div className="flex gap-1 mb-8">
                                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                        <Star key={i} size={20} fill="#D4AF37" className="text-gold" />
                                    ))}
                                </div>

                                <p className="text-2xl md:text-3xl font-serif italic mb-10 leading-relaxed">
                                    "{testimonials[currentIndex].content}"
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold relative">
                                        <Image
                                            src={testimonials[currentIndex].image}
                                            alt={testimonials[currentIndex].name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-xl">{testimonials[currentIndex].name}</h4>
                                        <p className="text-gold/80 text-sm font-medium">{testimonials[currentIndex].role}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-center gap-4 mt-12">
                        <button
                            onClick={prev}
                            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all"
                        >
                            <ChevronLeft size={28} />
                        </button>
                        <button
                            onClick={next}
                            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:border-gold transition-all"
                        >
                            <ChevronRight size={28} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
