"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star, ArrowRight, ShoppingCart, Eye } from "lucide-react";
import { useState } from "react";
import QuickViewModal from "./QuickViewModal";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

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
    image: "/images/chocolate_cake.png",
    rating: 4.7,
  },
];

function CakeCard({ cake, onQuickView }) {
  const { addToCart } = useCart();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e) => {
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
      className="relative group w-full bg-white dark:bg-white/5 rounded-3xl overflow-hidden shadow-soft hover:shadow-2xl border border-chocolate/5 hover:border-gold/20 transition-all duration-300 flex flex-col h-[440px] cursor-pointer"
      onClick={() => onQuickView(cake)}
    >
      {/* Image Container */}
      <div className="relative w-full h-[240px] overflow-hidden bg-cream flex-shrink-0">
        <Image
          src={cake.image}
          alt={cake.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Dynamic Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Float Price Badge */}
        <div className="absolute top-4 right-4 bg-gold text-cream font-bold px-3 py-1 rounded-full text-sm shadow-md">
          {cake.price}
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 left-4 bg-white/95 dark:bg-black/70 backdrop-blur-sm text-chocolate dark:text-cream font-bold px-2.5 py-1 rounded-full text-xs flex items-center gap-1 shadow-md">
          <Star size={12} fill="currentColor" className="text-gold" />
          <span>{cake.rating}</span>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">
            {cake.category}
          </p>
          <h3 className="text-lg font-serif font-bold text-chocolate dark:text-cream group-hover:text-gold transition-colors duration-200 line-clamp-2">
            {cake.name}
          </h3>
        </div>

        <div>
          <div className="border-t border-chocolate/5 dark:border-white/5 my-3" />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(cake);
              }}
              className="flex-1 py-2.5 text-xs font-semibold rounded-full border border-chocolate/10 dark:border-white/10 text-chocolate dark:text-cream hover:bg-chocolate hover:text-cream transition-colors text-center flex items-center justify-center gap-1 bg-transparent"
              aria-label={`Quick view ${cake.name}`}
            >
              <Eye size={14} /> Quick View
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart({
                  id: cake.id,
                  name: cake.name,
                  price: cake.price,
                  quantity: 1,
                  image: cake.image,
                });
              }}
              className="flex-1 py-2.5 text-xs font-bold rounded-full bg-gold text-cream hover:bg-chocolate transition-colors text-center flex items-center justify-center gap-1 shadow-sm border border-transparent"
              aria-label={`Add ${cake.name} to cart`}
            >
              <ShoppingCart size={14} /> Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedCakes() {
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const openQuickView = (c) => {
    setSelected(c);
    setOpen(true);
  };

  const closeQuickView = () => {
    setSelected(null);
    setOpen(false);
  };

  return (
    <section id="collection" className="py-24 bg-cream/5">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-chocolate dark:text-cream mb-4">
              Explore Our <span className="text-gold italic">Sweet Creations</span>
            </h2>
            <p className="text-chocolate/70 dark:text-cream/70 leading-relaxed text-lg">
              From decadent chocolate masterpieces to ethereal wedding tiers,
              every cake tells a story through a perfect balance of flavor, texture,
              and artistry.
            </p>
          </div>
          <button className="text-chocolate dark:text-cream font-bold flex items-center gap-2 group hover:text-gold transition-colors">
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
              className="w-full"
            >
              <CakeCard cake={cake} onQuickView={openQuickView} />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <QuickViewModal onClose={closeQuickView} item={selected} />
        )}
      </AnimatePresence>
    </section>
  );
}
