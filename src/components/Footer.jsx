"use client";

import Link from "next/link";
import { Share2, Mail, Heart, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-chocolate text-cream pt-20 pb-10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-cream font-serif text-xl font-bold">
                M
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight">
                Mavi<span className="text-gold">Bakes</span>
              </span>
            </Link>
            <p className="text-cream/50 leading-relaxed">
              Crafting memories one slice at a time. Our homemade cakes are made
              with passion, precision, and the finest ingredients.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:border-gold transition-all"
              >
                <Share2 size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:border-gold transition-all"
              >
                <Globe size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gold hover:border-gold transition-all"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-cream/60">
              <li>
                <Link
                  href="#home"
                  className="hover:text-gold transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#collection"
                  className="hover:text-gold transition-colors"
                >
                  Featured Cakes
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="hover:text-gold transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="#gallery"
                  className="hover:text-gold transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  href="#order"
                  className="hover:text-gold transition-colors"
                >
                  Custom Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Products</h4>
            <ul className="space-y-4 text-cream/60">
              <li>
                <Link href="#" className="hover:text-gold transition-colors">
                  Wedding Cakes
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold transition-colors">
                  Birthday Cakes
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold transition-colors">
                  Cupcakes
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold transition-colors">
                  Pastries
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-gold transition-colors">
                  Gift Hampers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Newsletter</h4>
            <p className="text-cream/60 mb-6 text-sm">
              Subscribe to get the latest deals and new arrivals.
            </p>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault(); /* TODO: wire subscription */
              }}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-gold outline-none"
                placeholder="Your email"
                aria-label="Your email"
              />

              <button
                type="submit"
                className="w-full bg-gold text-cream py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-cream/40 text-sm">
          <p>© 2026 MaviBakes. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-gold">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-gold">
              Terms of Service
            </Link>
          </div>
          <p className="flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-red-500" />{" "}
            by Antigravity
          </p>
        </div>
      </div>
    </footer>
  );
}
