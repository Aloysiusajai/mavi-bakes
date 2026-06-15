"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import OrderSuccessModal from "./OrderSuccessModal";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { showToast } = useToast();
  const router = useRouter();
  const [step, setStep] = useState("cart"); // "cart" | "checkout"
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success modal states
  const [successOpen, setSuccessOpen] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const clean = priceStr.replace(/[^\d.]/g, "");
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => {
      const price = parsePrice(item.price);
      return sum + price * item.quantity;
    }, 0);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();



    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!contact.trim()) newErrors.contact = "Phone number is required";
    if (!address.trim()) newErrors.address = "Delivery address is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const subtotal = getSubtotal();
    const orderPayload = {
      customerName: name,
      phoneNumber: contact,
      email: email,
      cakeName: items.map((item) => `${item.name} (x${item.quantity})`).join(", "),
      cakeWeight: "Cart Order",
      quantity: items.reduce((sum, item) => sum + item.quantity, 0),
      customMessage: message,
      deliveryDate: date || "",
      deliveryAddress: address,
      totalPrice: subtotal,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.error || (data.errors ? data.errors.join(", ") : "Unable to place order");
        throw new Error(errorMsg);
      }

      // Save order to localStorage for customer visibility
      const orderLocal = {
        id: data.id || data._id || `ord_${Date.now()}`,
        flavor: "Assorted Cart Items",
        size: "Custom Cart Order",
        message: message || "",
        date: date || "",
        name: data.customerName || name,
        contact: data.phoneNumber || contact,
        status: data.status || "Pending",
        createdAt: data.createdAt || new Date().toISOString(),
      };

      const ordersRaw = localStorage.getItem("orders");
      const orders = ordersRaw ? JSON.parse(ordersRaw) : [];
      orders.unshift(orderLocal);
      localStorage.setItem("orders", JSON.stringify(orders));

      // Broadcast order event
      try {
        const bc = new BroadcastChannel("orders_channel");
        bc.postMessage({ type: "new-order", order: orderLocal });
        bc.close();
      } catch {
        localStorage.setItem(
          "orders_event",
          JSON.stringify({ type: "new-order", order: orderLocal, t: orderLocal.createdAt })
        );
      }

      // Success sequence
      setSuccessOrderId(orderLocal.id);
      setSuccessMsg("Thank you! Your cart order has been successfully placed. We will contact you soon to confirm details.");
      setSuccessOpen(true);

      // Clean up states
      clearCart();
      setName("");
      setContact("");
      setAddress("");
      setDate("");
      setEmail("");
      setMessage("");
      setStep("cart");
      setCartOpen(false);
    } catch (err) {
      console.error("Cart checkout error:", err);
      showToast({
        title: "Order Failed",
        description: err instanceof Error ? err.message : "Something went wrong.",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceedToCheckout = () => {
    setStep("checkout");
  };

  const handleClose = () => {
    setCartOpen(false);
    setStep("cart");
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[200] overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-full max-w-md bg-cream shadow-2xl flex flex-col z-10 border-l border-chocolate/10"
            >
              {/* Header */}
              <div className="p-6 border-b border-chocolate/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-chocolate">
                  <ShoppingBag size={22} className="text-gold" />
                  <h2 className="text-xl font-serif font-bold">
                    {step === "cart" ? "Your Cart" : "Checkout Details"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-chocolate/60 hover:text-chocolate rounded-full hover:bg-chocolate/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content area */}
              <div className="flex-1 overflow-y-auto p-6">
                {step === "cart" ? (
                  items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-4">
                        <ShoppingBag size={30} />
                      </div>
                      <h3 className="text-lg font-bold text-chocolate mb-2">
                        Your cart is empty
                      </h3>
                      <p className="text-chocolate/60 text-sm max-w-xs mb-6">
                        Add some of our freshly baked signature cakes to get started!
                      </p>
                      <button
                        onClick={handleClose}
                        className="px-6 py-2.5 rounded-full bg-chocolate text-cream font-medium shadow-md hover:bg-gold transition-colors"
                      >
                        Explore Collection
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 bg-white/60 dark:bg-white/5 p-3 rounded-2xl border border-chocolate/5"
                        >
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-cream flex-shrink-0">
                            <Image
                              src={item.image || "/images/chocolate_cake.png"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif font-bold text-chocolate truncate text-sm">
                              {item.name}
                            </h4>
                            <p className="text-gold font-bold text-sm mt-0.5">
                              {item.price}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="w-6 h-6 rounded-full bg-cream text-chocolate flex items-center justify-center hover:bg-gold hover:text-cream transition-colors text-xs"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-sm font-bold text-chocolate">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-6 h-6 rounded-full bg-cream text-chocolate flex items-center justify-center hover:bg-gold hover:text-cream transition-colors text-xs"
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-chocolate/40 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  // Checkout Step Form
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-chocolate">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full p-3 rounded-xl border border-chocolate/20 focus:border-gold outline-none bg-white/60 dark:bg-white/5 text-chocolate text-sm"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs font-semibold">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-chocolate">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="+1234567890"
                        className="w-full p-3 rounded-xl border border-chocolate/20 focus:border-gold outline-none bg-white/60 dark:bg-white/5 text-chocolate text-sm"
                      />
                      {errors.contact && (
                        <p className="text-red-500 text-xs font-semibold">{errors.contact}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-chocolate">
                        Delivery Address *
                      </label>
                      <textarea
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street address, City, ZIP code"
                        className="w-full p-3 rounded-xl border border-chocolate/20 focus:border-gold outline-none bg-white/60 dark:bg-white/5 text-chocolate text-sm resize-none"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs font-semibold">{errors.address}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-chocolate">
                        Preferred Delivery Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 rounded-xl border border-chocolate/20 focus:border-gold outline-none bg-white/60 dark:bg-white/5 text-chocolate text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-chocolate">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full p-3 rounded-xl border border-chocolate/20 focus:border-gold outline-none bg-white/60 dark:bg-white/5 text-chocolate text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-chocolate">
                        Special Instructions / Cake Note
                      </label>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. Write 'Happy Birthday' on the cake"
                        className="w-full p-3 rounded-xl border border-chocolate/20 focus:border-gold outline-none bg-white/60 dark:bg-white/5 text-chocolate text-sm"
                      />
                    </div>

                    <div className="p-4 bg-white/50 dark:bg-white/5 border border-chocolate/5 rounded-2xl text-xs space-y-2 mt-4">
                      <p className="font-bold text-chocolate">Payment details:</p>
                      <p className="text-chocolate/70">
                        Cash on Delivery or Direct Bank Transfer only. We will verify coordinates via phone call.
                      </p>
                    </div>
                  </form>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-chocolate/10 bg-cream/50">
                  <div className="flex justify-between items-center mb-4 text-chocolate">
                    <span className="font-serif font-bold text-lg">Total Amount</span>
                    <span className="font-serif font-extrabold text-2xl text-gold">
                      ${getSubtotal().toFixed(2)}
                    </span>
                  </div>

                  {step === "cart" ? (
                    <button
                      onClick={handleProceedToCheckout}
                      className="w-full py-4 rounded-full bg-chocolate text-cream font-bold flex items-center justify-center gap-2 hover:bg-gold shadow-lg hover:shadow-xl transition-all"
                    >
                      Proceed to Checkout <ArrowRight size={18} />
                    </button>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep("cart")}
                        className="flex-1 py-4 rounded-full border-2 border-chocolate text-chocolate font-bold text-center hover:bg-chocolate hover:text-cream transition-all"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleCheckoutSubmit}
                        disabled={isSubmitting}
                        className="flex-[2] py-4 rounded-full bg-gold text-cream font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-chocolate transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? "Placing Order..." : "Confirm & Order"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <OrderSuccessModal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        orderId={successOrderId}
        message={successMsg}
      />
    </>
  );
}
