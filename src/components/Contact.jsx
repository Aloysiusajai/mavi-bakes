"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Share2, Send } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-cream relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-chocolate mb-6">
              Get in <span className="text-gold">Touch</span>
            </h2>
            <p className="text-chocolate/60 mb-12 max-w-lg">
              Have a question about our cakes or want to discuss a custom
              design? Reach out to us through any of these channels.
            </p>

            <div className="space-y-8">
              {[
                {
                  icon: <Phone className="text-gold" />,
                  title: "Call Us",
                  content: "+1 (555) 123-4567",
                },
                {
                  icon: <Mail className="text-gold" />,
                  title: "Email",
                  content: "hello@mavibakes.com",
                },
                {
                  icon: <MapPin className="text-gold" />,
                  title: "Visit Us",
                  content: "123 Bakery Lane, Sweet City, SC 54321",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-cream shadow-md flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-gold/10">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-chocolate">{item.title}</h4>
                    <p className="text-chocolate/60">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex gap-4">
              <a
                href="#"
                className="w-12 h-12 glass flex items-center justify-center rounded-full hover:bg-gold hover:text-cream transition-all"
              >
                <Share2 size={20} />
              </a>
              <a
                href="#"
                className="w-12 h-12 glass flex items-center justify-center rounded-full hover:bg-gold hover:text-cream transition-all"
              >
                <Share2 size={20} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-8 md:p-10 rounded-[40px] border-white/40 shadow-2xl"
          >
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-chocolate/70 ml-2">
                    Your Name
                  </label>
                  <input
                    className="w-full p-4 rounded-2xl border-2 border-cream focus:border-gold outline-none bg-cream/40"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-chocolate/70 ml-2">
                    Email Address
                  </label>
                  <input
                    className="w-full p-4 rounded-2xl border-2 border-cream focus:border-gold outline-none bg-cream/40"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-chocolate/70 ml-2">
                  Subject
                </label>
                <input
                  className="w-full p-4 rounded-2xl border-2 border-cream focus:border-gold outline-none bg-cream/40"
                  placeholder="General Inquiry"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-chocolate/70 ml-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full p-4 rounded-2xl border-2 border-cream focus:border-gold outline-none bg-cream/40"
                  placeholder="How can we help you?"
                />
              </div>
              <button className="w-full bg-chocolate text-cream py-4 rounded-full font-bold shadow-xl hover:bg-gold transition-all flex items-center justify-center gap-2">
                Send Message <Send size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
