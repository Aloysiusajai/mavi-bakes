"use client";
import React, { useEffect, useState } from "react";

type Order = {
  id?: string;
  orderId?: string;
  customerName?: string;
  phone?: string;
  cakeName?: string;
  flavor?: string;
  size?: string;
  message?: string;
  date?: string;
  name?: string;
  contact?: string;
  status?: string;
  thankYouSent?: boolean;
  cakeReadySent?: boolean;
  createdAt?: string | Date;
};

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API}/orders`);
        const data = await res.json();
        if (mounted) setOrders(data || []);
      } catch (e) {
        console.error('Unable to fetch orders', e);
      }
    })();
    return () => { mounted = false; };
  }, [API]);

  const markReady = async (order: Order) => {
    if (!confirm(`Mark order ${order.orderId || order.id} as Ready?`)) return;
    setLoadingMap((m) => ({ ...m, [order.orderId || order.id]: true }));
    try {
      const oid = order.orderId || order.id;
      const res = await fetch(`${API}/orders/${oid}/ready`, { method: 'PUT' });
      if (!res.ok) throw new Error('update failed');
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.orderId === updated.orderId || o.id === updated.orderId ? { ...o, status: updated.status, cakeReadySent: updated.cakeReadySent } : o)));
    } catch (e) {
      console.error(e);
      alert('Unable to mark ready');
    } finally {
      setLoadingMap((m) => ({ ...m, [order.orderId || order.id]: false }));
    }
  };

  const formatPhone = (raw: string | undefined) => {
    if (!raw) return "";
    const digits = raw.replace(/\D/g, "");
    return digits;
  };

  const makeTemplate = (o: Order) => {
    return `Hi ${o.name || 'there'}, your order ${o.id} (${o.flavor} • ${o.size}) is ready. Reply to confirm delivery or pickup time. Thank you! — MaviBakes`;
  };

  const openWhatsApp = (o: Order) => {
    const phone = formatPhone(o.contact || o.phone);
    if (!phone) return alert("No valid phone number for this order.");
    const text = encodeURIComponent(makeTemplate(o));
    const href = `https://wa.me/${phone}?text=${text}`;
    window.open(href, "_blank");
  };

  const sendSMS = (o: Order) => {
    const phone = formatPhone(o.contact || o.phone);
    if (!phone) return alert("No valid phone number for this order.");
    const body = encodeURIComponent(makeTemplate(o));
    const href = `sms:${phone}?body=${body}`;
    window.location.href = href;
  };

  const copyTemplate = async (o: Order) => {
    try {
      await navigator.clipboard.writeText(makeTemplate(o));
      window.alert('Template copied to clipboard');
    } catch (e) {
      window.alert('Unable to copy');
    }
  };

  const sendThankYou = async (order: Order) => {
    if (!confirm(`Send Thank You message to ${order.customerName || order.name || order.id}?`)) return;
    const phone = formatPhone(order.phone || order.contact);
    if (!phone) return alert('No valid phone number');
    const text = encodeURIComponent(`🎂 Thank you for your order, ${order.customerName || order.name || 'Customer'}!\n\nOrder ID: ${order.orderId || order.id}\n\nWe have received your order successfully.\n\nThank you for choosing our cake shop ❤️`);
    // open wa.me
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    // update backend
    setLoadingMap((m) => ({ ...m, [order.orderId || order.id]: true }));
    try {
      const oid = order.orderId || order.id;
      const res = await fetch(`${API}/orders/${oid}/thank-you`, { method: 'PUT' });
      if (!res.ok) throw new Error('update failed');
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.orderId === updated.orderId || o.id === updated.orderId ? { ...o, thankYouSent: updated.thankYouSent } : o)));
    } catch (e) {
      console.error(e);
      alert('Unable to update order status');
    } finally {
      setLoadingMap((m) => ({ ...m, [order.orderId || order.id]: false }));
    }
  };

  const sendCakeReady = async (order: Order) => {
    if (!confirm(`Notify ${order.customerName || order.name || order.id} that cake is ready?`)) return;
    const phone = formatPhone(order.phone || order.contact);
    if (!phone) return alert('No valid phone number');
    const text = encodeURIComponent(`🎉 Hello ${order.customerName || order.name || 'Customer'}!\n\nYour cake is ready! 🎂\n\nOrder ID: ${order.orderId || order.id}\n\nThank you for choosing our cake shop ❤️`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    setLoadingMap((m) => ({ ...m, [order.orderId || order.id]: true }));
    try {
      const oid = order.orderId || order.id;
      const res = await fetch(`${API}/orders/${oid}/ready`, { method: 'PUT' });
      if (!res.ok) throw new Error('update failed');
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => (o.orderId === updated.orderId || o.id === updated.orderId ? { ...o, status: updated.status, cakeReadySent: updated.cakeReadySent } : o)));
    } catch (e) {
      console.error(e);
      alert('Unable to update order status');
    } finally {
      setLoadingMap((m) => ({ ...m, [order.orderId || order.id]: false }));
    }
  };

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-serif mb-6" style={{ color: "var(--foreground)" }}>Admin Panel — Orders</h1>
        {orders.length === 0 ? (
          <div className="p-6 card">No orders yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((o) => (
              <div key={o.id} className="p-4 card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{o.customerName || o.name || "Customer"}</h3>
                    <p className="text-sm text-chocolate/70">Order: <span className="font-medium">{o.orderId || o.id}</span> · <span>{o.cakeName || o.flavor}</span></p>
                    <p className="mt-2 text-sm">Phone: <span className="font-mono">{o.phone || o.contact}</span></p>
                    <p className="text-xs text-chocolate/50 mt-2">Placed: {new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-3">
                    <p className={`px-3 py-1 rounded-full text-sm ${o.status === 'Ready' || o.status === 'ready' ? 'bg-gold text-cream' : 'bg-cream text-chocolate'}`}>{o.status}</p>
                    <div className="flex gap-2">
                      {o.thankYouSent ? (
                        <div className="px-3 py-2 rounded-full bg-green-100 text-green-800">✅ Thank You Sent</div>
                      ) : (
                        <button onClick={() => sendThankYou(o)} disabled={!!loadingMap[o.orderId || o.id]} className="px-3 py-2 btn-primary">{loadingMap[o.orderId || o.id] ? 'Sending...' : 'Send Thank You'}</button>
                      )}

                      {o.cakeReadySent ? (
                        <div className="px-3 py-2 rounded-full bg-green-100 text-green-800">✅ Cake Ready Sent</div>
                      ) : (
                        <button onClick={() => sendCakeReady(o)} disabled={!!loadingMap[o.orderId || o.id]} className="px-3 py-2 btn-secondary">{loadingMap[o.orderId || o.id] ? 'Sending...' : 'Cake Ready'}</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
