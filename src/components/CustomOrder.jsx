"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useWatch } from "react-hook-form";
import {
  Cake,
  Palette,
  Sparkles,
  Send,
  Upload,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import OrderSuccessModal from "./OrderSuccessModal";

const flavors = [
  {
    id: "chocolate",
    name: "Chocolate Ganache",
    color: "bg-chocolate",
    image: "/images/chocolate_cake.png",
  },
  {
    id: "velvet",
    name: "Red Velvet",
    color: "bg-red-600",
    image: "/images/red_velvet_cake.png",
  },
  {
    id: "vanilla",
    name: "Classic Vanilla",
    color: "bg-cream",
    image: "/images/hero_cake.png",
  },
  {
    id: "berry",
    name: "Strawberry Blush",
    color: "bg-blush",
    image: "/images/red_velvet_cake.png",
  },
];

const sizes = [
  'Small (6")',
  'Medium (8")',
  'Large (10")',
  "Multi-tier (Custom)",
];

export default function CustomOrder() {
  const [selectedFlavor, setSelectedFlavor] = useState(flavors[0]);
  const [currentStep, setCurrentStep] = useState(1);
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      flavor: flavors[0].id,
      size: sizes[1],
    },
  });
  const watchedSize = useWatch({ control, name: "size" });
  const watchedMessage = useWatch({ control, name: "message" });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(undefined);
  const [modalOrderId, setModalOrderId] = useState(undefined);

  const onSubmit = async (data) => {
    const fallbackCreatedAt = new Date().toISOString();
    const tempId = `ord_${fallbackCreatedAt.replace(/\D/g, "")}`;
    const orderPayload = {
      customerName: data.name || "",
      phoneNumber: data.contact || "",
      email: data.email || "",
      cakeName: selectedFlavor.name || data.flavor || "Custom Cake",
      cakeWeight: data.size || "",
      quantity: Number(data.quantity) || 1,
      customMessage: data.message || "",
      deliveryDate: data.date || "",
      deliveryAddress: data.address || "",
      totalPrice: Number(data.price) || 0,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      const created = await res.json();
      if (!res.ok) {
        // show server validation errors if provided
        const msg =
          created?.error ||
          (created?.errors
            ? created.errors.join(", ")
            : "Unable to create order");
        throw new Error(msg);
      }

      const orderLocal = {
        id: created.id || created._id || tempId,
        flavor: selectedFlavor.id,
        size: data.size,
        message: data.message || "",
        date: data.date || "",
        name: created.customerName || data.name,
        contact: created.phoneNumber || data.contact,
        status: created.status || "Pending",
        createdAt: created.createdAt || fallbackCreatedAt,
      };

      const ordersRaw = localStorage.getItem("orders");
      const orders = ordersRaw ? JSON.parse(ordersRaw) : [];
      orders.unshift(orderLocal);
      localStorage.setItem("orders", JSON.stringify(orders));
      sessionStorage.setItem("lastOrderId", orderLocal.id);

      try {
        const bc = new BroadcastChannel("orders_channel");
        bc.postMessage({ type: "new-order", order: orderLocal });
        bc.close();
      } catch {
        localStorage.setItem(
          "orders_event",
          JSON.stringify({
            type: "new-order",
            order: orderLocal,
            t: orderLocal.createdAt,
          }),
        );
      }
      // show in-app modal instead of native alert
      setModalOrderId(orderLocal.id);
      setModalMessage(
        "Thank you — your order has been received. We will contact you shortly.",
      );
      setModalOpen(true);
    } catch (e) {
      console.error("Order submission failed", e);
      setModalMessage(
        "Unable to submit order right now. Please try again later.",
      );
      setModalOpen(true);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <section id="order" className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Form Side */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-chocolate mb-4">
                Design Your <span className="text-gold">Dream Cake</span>
              </h2>
              <p className="text-chocolate/60 mb-12 max-w-lg">
                Tell us your vision, and we&apos;ll bring it to life. Choose
                your favorites or describe a completely custom masterpiece.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Step Indicators */}
                <div className="flex items-center gap-4 mb-10">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                          currentStep === step
                            ? "bg-gold text-cream"
                            : step < currentStep
                              ? "bg-chocolate text-cream"
                              : "bg-cream text-chocolate",
                        )}
                      >
                        {step}
                      </div>
                      {step < 3 && <div className="w-8 h-0.5 bg-cream" />}
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Palette size={20} className="text-gold" /> Choose Your
                        Flavor
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {flavors.map((f) => (
                          <div
                            key={f.id}
                            onClick={() => setSelectedFlavor(f)}
                            className={cn(
                              "cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center gap-3",
                              selectedFlavor.id === f.id
                                ? "border-gold bg-gold/5 shadow-md"
                                : "border-cream hover:border-gold/30",
                            )}
                          >
                            <div
                              className={cn(
                                "w-6 h-6 rounded-full border border-chocolate/10",
                                f.color,
                              )}
                            />
                            <span className="font-medium text-chocolate">
                              {f.name}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          <Cake size={20} className="text-gold" /> Pick a Size
                        </h3>
                        <select
                          {...register("size")}
                          className="w-full p-4 rounded-2xl border-2 border-cream focus:border-gold outline-none bg-cream/30"
                        >
                          {sizes.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles size={20} className="text-gold" />{" "}
                        Personalization
                      </h3>
                      <div className="space-y-4">
                        <label className="block font-medium text-chocolate">
                          Special Message on Cake
                        </label>
                        <input
                          {...register("message")}
                          placeholder="e.g. Happy Birthday Chloe!"
                          className="w-full p-4 rounded-2xl border-2 border-cream focus:border-gold outline-none bg-cream/30"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="block font-medium text-chocolate">
                          Upload Inspiration (Optional)
                        </label>
                        <label className="w-full p-8 rounded-2xl border-2 border-dashed border-gold/30 flex flex-col items-center justify-center cursor-pointer hover:bg-gold/5 transition-all">
                          <Upload className="text-gold mb-2" />
                          <span className="text-sm text-chocolate/50">
                            Click to upload or drag & drop
                          </span>
                          <input type="file" className="hidden" />
                        </label>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <Send size={20} className="text-gold" /> Delivery
                        Details
                      </h3>
                      <div className="space-y-4">
                        <label className="block font-medium text-chocolate">
                          Event Date
                        </label>
                        <input
                          type="date"
                          {...register("date")}
                          className="w-full p-4 rounded-2xl border-2 border-cream focus:border-gold outline-none bg-cream/30"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="block font-medium text-chocolate">
                          Your Name
                        </label>
                        <input
                          {...register("name")}
                          placeholder="Full name"
                          className="w-full p-4 rounded-2xl border-2 border-cream focus:border-gold outline-none bg-cream/30"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="block font-medium text-chocolate">
                          Phone Number
                        </label>
                        <input
                          {...register("contact")}
                          placeholder="e.g. +1234567890"
                          className="w-full p-4 rounded-2xl border-2 border-cream focus:border-gold outline-none bg-cream/30"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="block font-medium text-chocolate">
                          Delivery Address
                        </label>
                        <input
                          {...register("address")}
                          placeholder="Street, City, ZIP"
                          className="w-full p-4 rounded-2xl border-2 border-cream focus:border-gold outline-none bg-cream/30"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-medium text-chocolate">
                            Quantity
                          </label>
                          <input
                            type="number"
                            {...register("quantity")}
                            defaultValue={1}
                            className="w-full p-4 rounded-2xl border-2 border-cream focus:border-gold outline-none bg-cream/30"
                          />
                        </div>
                        <div>
                          <label className="block font-medium text-chocolate">
                            Estimated Price (USD)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            {...register("price")}
                            placeholder="e.g. 85.00"
                            className="w-full p-4 rounded-2xl border-2 border-cream focus:border-gold outline-none bg-cream/30"
                          />
                        </div>
                      </div>
                      <div className="p-6 glass rounded-2xl border-gold/10">
                        <h4 className="font-bold mb-2">Order Summary</h4>
                        <ul className="text-sm space-y-2 text-chocolate/70">
                          <li>
                            Flavor:{" "}
                            <span className="text-chocolate font-bold">
                              {selectedFlavor.name}
                            </span>
                          </li>
                          <li>
                            Size:{" "}
                            <span className="text-chocolate font-bold">
                              {watchedSize}
                            </span>
                          </li>
                          <li>
                            Personalization:{" "}
                            <span className="text-chocolate font-bold">
                              {watchedMessage || "None"}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-4 pt-4">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-8 py-4 rounded-full border-2 border-chocolate font-bold hover:bg-chocolate hover:text-cream transition-all"
                    >
                      Back
                    </button>
                  )}
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-gold text-cream py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all"
                    >
                      Next Step <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex-1 bg-chocolate text-cream py-4 rounded-full font-bold flex items-center justify-center gap-2 shadow-xl hover:shadow-gold/20 transition-all"
                    >
                      Submit Custom Request <Send size={20} />
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>

          {/* Preview Side */}
          <div className="hidden lg:block w-96">
            <div className="sticky top-32">
              <div className="relative h-[500px] w-full rounded-[40px] overflow-hidden shadow-2xl group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedFlavor.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={selectedFlavor.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Live Message Overlay */}
                <div className="absolute inset-x-6 bottom-12 z-20 text-center">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={watchedMessage}
                    className="text-white font-serif text-xl font-bold bg-chocolate/30 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20"
                  >
                    {watchedMessage || "Your Message Here"}
                  </motion.p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/40 to-transparent pointer-events-none" />

                {/* Floaties */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-10 right-10 bg-gold text-cream p-4 rounded-2xl shadow-xl z-10"
                >
                  <p className="text-xs uppercase font-bold">Estimated Cost</p>
                  <p className="text-2xl font-black">$85.00</p>
                </motion.div>
              </div>
              <div className="mt-8 text-center">
                <p className="text-chocolate/40 text-sm italic font-medium">
                  ✨ Visual rendering in progress based on your choices
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <OrderSuccessModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        orderId={modalOrderId}
        message={modalMessage}
      />
    </section>
  );
}
