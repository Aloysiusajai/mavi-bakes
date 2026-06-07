"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PromoModal from "./PromoModal";

export default function PromoBanner(){
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(true);

    // default: ends in 7 days
    const defaultEnd = new Date(Date.now() + 7*24*60*60*1000).toISOString();

    useEffect(() => {
        // auto hide after 12 seconds on first view
        const id = setTimeout(() => setVisible(true), 0);
        return () => clearTimeout(id);
    }, []);

    if (!visible) return null;

    return (
        <>
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150]">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-4 bg-gradient-to-r from-gold/80 via-gold/60 to-chocolate/10 px-6 py-3 rounded-full shadow-2xl backdrop-blur-sm cursor-pointer"
                    onClick={() => setOpen(true)}
                >
                    <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center font-bold text-chocolate">M</div>
                    <div>
                        <p className="text-sm font-bold text-chocolate">Special Offer — 20% off custom cakes</p>
                        <p className="text-xs text-chocolate/70">Limited slots • Tap to claim</p>
                    </div>
                    <div className="ml-4">
                        <a onClick={() => setOpen(true)} className="bg-chocolate text-cream px-4 py-2 rounded-full font-medium hover:bg-gold transition-all">Claim</a>
                    </div>
                </motion.div>
            </div>

            <PromoModal open={open} onClose={() => setOpen(false)} endDate={defaultEnd} />
        </>
    );
}
