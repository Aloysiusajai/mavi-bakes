"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function QuickViewModal({ open, onClose, item }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  if (!item) return null;

  const handleAdd = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: qty,
      image: item.image,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 glass-dark"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative max-w-3xl w-full bg-cream rounded-2xl overflow-hidden shadow-2xl border border-chocolate/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4 p-2 rounded-full text-chocolate hover:text-gold transition-colors z-10"
          onClick={onClose}
          aria-label="Close quick view"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-square w-full h-full min-h-[300px]">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-gold uppercase tracking-wider">
                {item.category}
              </span>
              <h3 className="text-2xl font-serif font-bold text-chocolate mt-1 mb-2">
                {item.name}
              </h3>
              <p className="text-2xl font-extrabold text-chocolate mb-6">
                {item.price}
              </p>
              <p className="text-sm text-chocolate/70 leading-relaxed mb-6">
                Made with premium organic ingredients. Every bite is handcrafted
                to perfection, ensuring the most delightful and authentic flavors.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center border border-chocolate/20 rounded-xl overflow-hidden bg-white/50">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-chocolate hover:bg-chocolate/5 transition-colors font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold text-chocolate text-center min-w-[40px]">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="px-3 py-2 text-chocolate hover:bg-chocolate/5 transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 px-6 rounded-xl bg-gold text-cream font-bold hover:bg-chocolate shadow-md hover:shadow-lg transition-all text-center"
                >
                  Add to cart
                </button>
              </div>

              <p className="text-xs text-chocolate/50 italic">
                ✨ Note: Please order 48 hours in advance for custom quantities.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
