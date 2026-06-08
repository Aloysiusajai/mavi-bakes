"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function OrderSuccessModal({ open, onClose, orderId, message }:{ open: boolean; onClose: ()=>void; orderId?: string; message?: string; }){
    if (!open) return null;
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 max-w-md w-full bg-cream rounded-2xl p-6 shadow-2xl border border-chocolate/10">
                <button onClick={onClose} className="absolute top-3 right-3 text-chocolate hover:text-gold"><X size={20} /></button>
                <h3 className="text-xl font-serif font-bold text-chocolate mb-2">{orderId ? 'Order Received' : 'Order Status'}</h3>
                <p className="text-chocolate/70 mb-4">{message || 'Thank you — your order has been received. We will contact you shortly.'}</p>
                {orderId && <p className="text-sm text-chocolate/60">Reference ID: <strong>{orderId}</strong></p>}
                <div className="mt-6 text-right">
                    <button onClick={onClose} className="px-4 py-2 rounded-full bg-chocolate text-cream">Close</button>
                </div>
            </motion.div>
        </motion.div>
    );
}
