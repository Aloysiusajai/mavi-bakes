"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PromoModal({ open, onClose, endDate }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!open) return;
    const target = new Date(endDate).getTime();
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${days}d ${hrs}h ${mins}m ${secs}s`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [open, endDate]);

  if (!open) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="relative z-10 max-w-xl w-full bg-cream rounded-3xl p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-chocolate hover:text-gold"
        >
          <X size={24} />
        </button>
        <h3 className="text-2xl font-serif font-bold text-chocolate mb-2">
          Limited Time Offer
        </h3>
        <p className="text-chocolate/70 mb-4">
          Get 20% off on all custom orders placed within the countdown. Use code{" "}
          <strong>MAVI20</strong> at checkout.
        </p>
        <div className="flex items-center justify-between bg-cream/30 p-4 rounded-xl border border-chocolate/10 mb-6">
          <div>
            <p className="text-sm text-chocolate/60">Offer ends in</p>
            <p className="text-xl font-bold text-chocolate">{timeLeft}</p>
          </div>
          <div>
            <Link
              href="/#order"
              onClick={onClose}
              className="bg-chocolate text-cream px-6 py-3 rounded-full font-bold hover:bg-gold transition-all cursor-pointer inline-block"
            >
              Order Now
            </Link>
          </div>
        </div>
        <p className="text-sm text-chocolate/60">
          Free customization on orders over $75. Limited slots each week.
        </p>
      </motion.div>
    </motion.div>
  );
}
