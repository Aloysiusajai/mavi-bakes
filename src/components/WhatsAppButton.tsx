"use client";
import React from "react";

export default function WhatsAppButton() {
  const phone = "+91 9345878695"; // replace with your WhatsApp number
  const message = encodeURIComponent("Hi! I want to order a custom cake.");
  const href = `https://wa.me/${phone.replace(/[^0-9]/g, "")}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Order on WhatsApp"
      className="whatsapp-btn fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-full shadow-2xl"
      style={{ background: 'linear-gradient(135deg, var(--color-pastry), var(--color-cinnamon))', color: 'var(--color-cream)' }}
    >
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.52 3.48C18.18 1.14 15.02 0 11.66 0 5.22 0 .1 5.12.1 11.56c0 2.04.54 3.98 1.56 5.7L0 24l6.9-1.8c1.62.9 3.44 1.36 5.36 1.36 6.44 0 11.56-5.12 11.56-11.56 0-3.36-1.14-6.52-3.3-8.72z" fill="currentColor"/></svg>
      </div>
      <div className="hidden sm:block font-medium">Order on WhatsApp</div>
    </a>
  );
}
