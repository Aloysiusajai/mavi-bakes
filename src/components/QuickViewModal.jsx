"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useState } from "react";

export default function QuickViewModal({ open, onClose, item }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
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
    showToast({ title: "Added to cart", description: `${qty}× ${item.name}` });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
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
            className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 p-2 rounded-full"
              onClick={onClose}
              aria-label="Close quick view"
            >
              <X />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-square">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-serif font-bold mb-2">
                  {item.name}
                </h3>
                <p className="text-chocolate/70 mb-4">{item.category}</p>
                <p className="text-xl font-bold text-chocolate mb-6">
                  {item.price}
                </p>

                <div className="flex items-center gap-3 mb-6">
                  <label htmlFor="qty" className="sr-only">
                    Quantity
                  </label>
                  <input
                    id="qty"
                    type="number"
                    min={1}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-24 p-2 rounded-md border"
                  />
                  <button onClick={handleAdd} className="btn-primary">
                    Add to cart
                  </button>
                </div>

                <p className="text-sm text-chocolate/60">
                  Made with organic ingredients. Please allow 48 hours for
                  custom orders.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
