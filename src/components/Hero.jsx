"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

const blobs = [
  {
    x: "8%",
    y: "12%",
    scale: 0.72,
    width: "280px",
    height: "360px",
    duration: 12,
  },
  {
    x: "72%",
    y: "8%",
    scale: 0.94,
    width: "430px",
    height: "310px",
    duration: 16,
  },
  {
    x: "46%",
    y: "62%",
    scale: 0.64,
    width: "260px",
    height: "420px",
    duration: 14,
  },
  {
    x: "18%",
    y: "76%",
    scale: 0.82,
    width: "390px",
    height: "260px",
    duration: 18,
  },
  {
    x: "82%",
    y: "54%",
    scale: 0.58,
    width: "240px",
    height: "300px",
    duration: 13,
  },
  {
    x: "58%",
    y: "30%",
    scale: 0.76,
    width: "340px",
    height: "340px",
    duration: 17,
  },
];

const sparkles = Array.from({ length: 20 }, (_, index) => ({
  top: `${(index * 17 + 9) % 96}%`,
  left: `${(index * 29 + 13) % 94}%`,
  duration: 2 + (index % 5) * 0.7,
  delay: (index % 6) * 0.45,
}));

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-animated-gradient"
    >
      {/* Floating Elements Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {blobs.map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gold/10 blur-3xl"
            initial={{ x: b.x, y: b.y, scale: b.scale }}
            animate={{ y: ["-20%", "20%"], x: ["-10%", "10%"] }}
            transition={{
              duration: b.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            style={{ width: b.width, height: b.height }}
          />
        ))}

        {/* Sugar Sparkles */}
        {sparkles.map((s, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-gold rounded-full"
            style={{ top: s.top, left: s.left }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              delay: s.delay,
            }}
          />
        ))}
      </div>

      <div className="container grid md:grid-cols-2 gap-12 items-center relative z-10">
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
          <h1 className="hero-title text-chocolate font-serif mb-6">
            Freshly Baked <br />
            <span className="text-gradient">Homemade Cakes</span> <br />
            Made with Love
          </h1>
          <p className="lead mb-10">
            Custom Cakes for Birthdays, Weddings, Anniversaries & Special
            Moments. Experience the magic of authentic homemade flavors crafted
            to perfection.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/#order" className="inline-block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-2 cursor-pointer"
              >
                Order Now <ArrowRight size={20} />
              </motion.div>
            </Link>
            <Link href="/#collection" className="inline-block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center gap-2 cursor-pointer"
              >
                <Play size={18} fill="currentColor" /> View Collection
              </motion.div>
            </Link>
          </div>

          {/* Stats quick view */}
          <div className="mt-12 flex gap-8">
            <div>
              <p className="text-3xl font-bold font-serif text-chocolate">
                5k+
              </p>
              <p className="text-sm text-chocolate/60">Cakes Delivered</p>
            </div>
            <div className="w-px h-12 bg-chocolate/10" />
            <div>
              <p className="text-3xl font-bold font-serif text-chocolate">
                1k+
              </p>
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
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-cream"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-pastry), var(--color-cinnamon))",
                  }}
                >
                  <span className="text-xl font-bold">100%</span>
                </div>
                <div>
                  <p className="font-bold text-chocolate whitespace-nowrap">
                    Organic Ingredients
                  </p>
                  <p className="text-xs text-chocolate/60">
                    Freshly sourced daily
                  </p>
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
