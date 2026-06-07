"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Collection", href: "#collection" },
    { name: "About", href: "#about" },
    { name: "Gallery", href: "#gallery" },
    { name: "Custom Order", href: "#order" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
                isScrolled ? "py-3" : "py-6"
            )}
        >
            <nav
                className={cn(
                    "max-w-7xl mx-auto flex items-center justify-between rounded-full px-6 transition-all duration-300",
                    isScrolled ? "glass py-2 shadow-lg" : "bg-transparent py-4"
                )}
            >
                <Link href="/" className="flex items-center gap-2">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center font-serif text-xl font-bold"
                        style={{ background: 'linear-gradient(135deg, var(--color-pastry), var(--color-cinnamon))', color: 'var(--color-cream)' }}
                    >
                        M
                    </motion.div>
                    <span className="font-serif text-2xl font-bold tracking-tight text-chocolate">
                        Mavi<span className="text-gold">Bakes</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <ul className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                href={link.href}
                                className="text-chocolate font-medium hover:text-gold transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full" />
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-chocolate hover:text-gold transition-colors">
                        <ShoppingCart size={24} />
                        <span className="absolute top-0 right-0 w-4 h-4 bg-gold text-cream text-[10px] flex items-center justify-center rounded-full">
                            0
                        </span>
                    </button>

                    <button
                        className="md:hidden p-2 text-chocolate"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-4 py-2 rounded-full font-medium transition-colors"
                            style={{ background: "transparent", color: "var(--color-chocolate)", border: "1px solid rgba(0,0,0,0.06)" }}
                        >
                            Login
                        </Link>

                        <Link
                            href="#order"
                            className="px-6 py-2.5 rounded-full font-medium btn-primary"
                        >
                            Order Now
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-6 right-6 mt-2 glass rounded-3xl p-6 shadow-2xl md:hidden"
                    >
                        <ul className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-chocolate text-lg font-medium block py-2 hover:text-gold"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                            <hr className="border-chocolate/10" />
                            <li>
                                <Link
                                    href="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block w-full text-chocolate py-2 font-medium hover:text-gold"
                                >
                                    Login
                                </Link>
                            </li>
                            <li className="flex justify-between items-center pt-2">
                                <div className="flex gap-4">
                                    <div className="w-5 h-5 bg-chocolate" />
                                    <div className="w-5 h-5 bg-chocolate" />
                                </div>
                                <Link
                                    href="#order"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="bg-gold text-cream px-6 py-2 rounded-full font-medium shadow-md"
                                >
                                    Order Now
                                </Link>
                            </li>
                        </ul>
                    </motion.div>
                ))}
            </AnimatePresence>
        </header>
    );
}
