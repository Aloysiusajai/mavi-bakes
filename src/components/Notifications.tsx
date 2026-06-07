"use client";
import React, { useEffect, useState } from "react";

type Toast = { id: string; message: string };

export default function Notifications() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      const data = e.data;
      if (!data || !data.type) return;
      if (data.type === "order-updated") {
        const last = sessionStorage.getItem("lastOrderId");
        if (last && data.order && data.order.id === last) {
          pushToast("Good news — your cake is ready!");
        }
      }
      if (data.type === "new-order") {
        // Optional: notify admin UI tabs (they will show in admin dashboard)
      }
    }

    // BroadcastChannel listener
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("orders_channel");
      bc.onmessage = handleMessage as any;
    } catch (e) {
      // fallback to storage event
      const onStorage = (ev: StorageEvent) => {
        if (ev.key === "orders_event" && ev.newValue) {
          const d = JSON.parse(ev.newValue);
          handleMessage({ data: d } as any);
        }
      };
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }

    return () => {
      if (bc) bc.close();
    };
  }, []);

  const pushToast = (message: string) => {
    const id = String(Date.now());
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 6000);
  };

  // Expose a simple window method for other components to trigger toasts
  useEffect(() => {
    (window as any).pushSiteToast = pushToast;
    return () => { (window as any).pushSiteToast = undefined; };
  }, []);

  return (
    <div className="fixed top-6 right-6 z-60 flex flex-col gap-3">
      {toasts.map((t) => (
        <div key={t.id} className="p-3 rounded-lg shadow-lg paper">
          <p className="font-medium" style={{ color: 'var(--color-chocolate)' }}>{t.message}</p>
        </div>
      ))}
    </div>
  );
}
