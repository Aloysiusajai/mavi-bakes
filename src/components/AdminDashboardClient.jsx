"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  IndianRupee,
  LogOut,
  MessageCircle,
  PackageCheck,
  RefreshCw,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Delivered",
];

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const statusMeta = {
  Pending: {
    icon: Clock3,
    label: "Pending",
    className: "bg-amber-100 text-amber-800 ring-amber-200",
  },
  Confirmed: {
    icon: CheckCircle2,
    label: "Confirmed",
    className: "bg-sky-100 text-sky-800 ring-sky-200",
  },
  Preparing: {
    icon: Sparkles,
    label: "Preparing",
    className: "bg-violet-100 text-violet-800 ring-violet-200",
  },
  Ready: {
    icon: PackageCheck,
    label: "Ready",
    className: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  },
  Delivered: {
    icon: Truck,
    label: "Delivered",
    className: "bg-stone-100 text-stone-700 ring-stone-200",
  },
};

function normalizeOrder(order) {
  return {
    ...order,
    id: String(order.id || order._id || ""),
    status: order.status || "Pending",
  };
}

function formatDate(value) {
  if (!value) return "No date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function dateKey(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function shortId(id) {
  return id.length > 8 ? id.slice(-8).toUpperCase() : id.toUpperCase();
}

function formatPhone(raw) {
  return raw ? raw.replace(/\D/g, "") : "";
}

function createToastId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function AdminDashboardClient() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loadingMap, setLoadingMap] = useState({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [newOrderIds, setNewOrderIds] = useState(new Set());
  const [confirmDialog, setConfirmDialog] = useState(null);
  const seenOrderIdsRef = useRef(new Set());
  const hasLoadedRef = useRef(false);

  const pushToast = useCallback((toast) => {
    const id = createToastId();
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 5200);
  }, []);

  const playNotificationSound = useCallback(() => {
    try {
      const audioWindow = window;
      const AudioContextClass =
        audioWindow.AudioContext || audioWindow.webkitAudioContext;
      if (!AudioContextClass) return;

      const context = new AudioContextClass();
      const gain = context.createGain();
      gain.gain.setValueAtTime(0.001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.42);
      gain.connect(context.destination);

      [660, 880].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(
          frequency,
          context.currentTime + index * 0.12,
        );
        oscillator.connect(gain);
        oscillator.start(context.currentTime + index * 0.12);
        oscillator.stop(context.currentTime + index * 0.12 + 0.22);
      });

      window.setTimeout(() => {
        void context.close();
      }, 700);
    } catch {
      // Browsers can block audio before user interaction; the toast still communicates the order.
    }
  }, []);

  const fetchOrders = useCallback(
    async ({ silent = false, notify = false } = {}) => {
      if (!silent) {
        setRefreshing(true);
      }
      setError(null);

      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        const nextOrders = Array.isArray(data)
          ? data.map(normalizeOrder).filter((order) => order.id)
          : [];

        if (!hasLoadedRef.current) {
          seenOrderIdsRef.current = new Set(
            nextOrders.map((order) => order.id),
          );
          hasLoadedRef.current = true;
        } else if (notify) {
          const freshOrders = nextOrders.filter(
            (order) => !seenOrderIdsRef.current.has(order.id),
          );

          if (freshOrders.length) {
            setNewOrderIds((current) => {
              const next = new Set(current);
              freshOrders.forEach((order) => next.add(order.id));
              return next;
            });

            freshOrders.forEach((order) => {
              pushToast({
                type: "info",
                title: "New order received",
                message: `${order.customerName || "Customer"} placed order #${shortId(order.id)}`,
              });
            });
            playNotificationSound();
          }

          freshOrders.forEach((order) => seenOrderIdsRef.current.add(order.id));
        }

        setOrders(nextOrders);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to fetch orders";
        console.error(err);
        setError(message);
        if (!silent) {
          pushToast({ type: "error", title: "Orders not loaded", message });
        }
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [playNotificationSound, pushToast],
  );

  useEffect(() => {
    const start = window.setTimeout(() => {
      void fetchOrders({ silent: true });
    }, 0);

    const interval = window.setInterval(() => {
      void fetchOrders({ silent: true, notify: true });
    }, 10000);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [fetchOrders]);

  const stats = useMemo(() => {
    const pending = orders.filter((order) => order.status === "Pending").length;
    const ready = orders.filter((order) => order.status === "Ready").length;
    const delivered = orders.filter(
      (order) => order.status === "Delivered",
    ).length;
    const revenue = orders.reduce(
      (total, order) => total + Number(order.totalPrice || 0),
      0,
    );

    return {
      total: orders.length,
      pending,
      ready,
      delivered,
      revenue,
    };
  }, [orders]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== "All" && order.status !== statusFilter) return false;
      if (
        dateFilter &&
        dateKey(order.deliveryDate || order.createdAt) !== dateFilter
      )
        return false;
      if (!query) return true;

      const searchable = [
        order.customerName,
        order.phoneNumber,
        order.email,
        order.cakeName,
        order.deliveryAddress,
        order.id,
        shortId(order.id),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [dateFilter, orders, search, statusFilter]);

  const runWithLoading = async (id, action) => {
    setLoadingMap((current) => ({ ...current, [id]: true }));
    try {
      await action();
    } finally {
      setLoadingMap((current) => ({ ...current, [id]: false }));
    }
  };

  const updateStatus = async (id, status) => {
    await runWithLoading(id, async () => {
      try {
        const res = await fetch(`/api/orders/${id}`, {
          method: "PUT",
          body: JSON.stringify({ status }),
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Update failed");
        const updated = normalizeOrder(await res.json());
        setOrders((prev) =>
          prev.map((order) =>
            order.id === updated.id ? { ...order, ...updated } : order,
          ),
        );
        if (status !== "Pending") {
          setNewOrderIds((current) => {
            const next = new Set(current);
            next.delete(id);
            return next;
          });
        }
        pushToast({
          type: "success",
          title: "Status updated",
          message: `Order #${shortId(id)} is now ${status}.`,
        });
      } catch (err) {
        console.error(err);
        pushToast({
          type: "error",
          title: "Status update failed",
          message: "Please try again in a moment.",
        });
      }
    });
  };

  const deleteOrder = (id) => {
    setConfirmDialog({
      title: "Delete this order?",
      message: `Order #${shortId(id)} will be permanently removed from the dashboard.`,
      confirmLabel: "Delete order",
      tone: "danger",
      onConfirm: async () => {
        setConfirmDialog(null);
        await runWithLoading(id, async () => {
          try {
            const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            setOrders((prev) => prev.filter((order) => order.id !== id));
            setNewOrderIds((current) => {
              const next = new Set(current);
              next.delete(id);
              return next;
            });
            seenOrderIdsRef.current.delete(id);
            pushToast({
              type: "success",
              title: "Order deleted",
              message: `Order #${shortId(id)} was removed.`,
            });
          } catch (err) {
            console.error(err);
            pushToast({
              type: "error",
              title: "Delete failed",
              message: "Unable to delete this order.",
            });
          }
        });
      },
    });
  };

  const sendThankYou = (order) => {
    setConfirmDialog({
      title: "Send thank you message?",
      message: `Open WhatsApp and mark thank-you sent for ${order.customerName || "this customer"}?`,
      confirmLabel: "Send message",
      onConfirm: async () => {
        setConfirmDialog(null);
        const phone = formatPhone(order.phoneNumber);
        if (!phone) {
          pushToast({
            type: "error",
            title: "No phone number",
            message: "This order does not have a valid phone number.",
          });
          return;
        }

        const text = encodeURIComponent(
          `Order Confirmed!\n\nHello ${order.customerName || "there"},\n\nWe've received your order and our bakers are getting ready to create something special.\n\nOrder ID: ${order.id}\n\nThank you for trusting Mavi Bakes.`,
        );
        window.open(`https://wa.me/${phone}?text=${text}`, "_blank");

        await runWithLoading(order.id, async () => {
          try {
            const res = await fetch(`/api/orders/${order.id}`, {
              method: "PUT",
              body: JSON.stringify({ thankYouSent: true }),
              headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error("Update failed");
            const updated = normalizeOrder(await res.json());
            setOrders((prev) =>
              prev.map((item) =>
                item.id === updated.id ? { ...item, ...updated } : item,
              ),
            );
            pushToast({
              type: "success",
              title: "Thank-you marked",
              message: `Message opened for ${order.customerName || "customer"}.`,
            });
          } catch (err) {
            console.error(err);
            pushToast({
              type: "error",
              title: "Update failed",
              message: "WhatsApp opened, but the order was not updated.",
            });
          }
        });
      },
    });
  };

  const sendCakeReady = (order) => {
    setConfirmDialog({
      title: "Notify cake is ready?",
      message: `Open WhatsApp and move ${order.customerName || "this order"} to Ready?`,
      confirmLabel: "Notify customer",
      onConfirm: async () => {
        setConfirmDialog(null);
        const phone = formatPhone(order.phoneNumber);
        if (!phone) {
          pushToast({
            type: "error",
            title: "No phone number",
            message: "This order does not have a valid phone number.",
          });
          return;
        }

        const text = encodeURIComponent(
          `Your Cake is Ready!\n\nHello ${order.customerName || "there"},\n\nGreat news! Your cake has been freshly prepared and is ready for pickup or delivery.\n\nOrder ID: ${order.id}\n\nThank you for choosing Mavi Bakes.`,
        );
        window.open(`https://wa.me/${phone}?text=${text}`, "_blank");

        await runWithLoading(order.id, async () => {
          try {
            const res = await fetch(`/api/orders/${order.id}`, {
              method: "PUT",
              body: JSON.stringify({ cakeReadySent: true, status: "Ready" }),
              headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error("Update failed");
            const updated = normalizeOrder(await res.json());
            setOrders((prev) =>
              prev.map((item) =>
                item.id === updated.id ? { ...item, ...updated } : item,
              ),
            );
            setNewOrderIds((current) => {
              const next = new Set(current);
              next.delete(order.id);
              return next;
            });
            pushToast({
              type: "success",
              title: "Customer notified",
              message: `Order #${shortId(order.id)} is ready.`,
            });
          } catch (err) {
            console.error(err);
            pushToast({
              type: "error",
              title: "Update failed",
              message: "WhatsApp opened, but the order was not updated.",
            });
          }
        });
      },
    });
  };

  const exportCSV = () => {
    const header = [
      "id",
      "createdAt",
      "customerName",
      "email",
      "phoneNumber",
      "cakeName",
      "quantity",
      "totalPrice",
      "deliveryAddress",
    ].join(",");
    const rows = orders
      .map((order) =>
        [
          order.id,
          order.createdAt || "",
          order.customerName || "",
          order.email || "",
          order.phoneNumber || "",
          order.cakeName || "",
          String(order.quantity || ""),
          String(order.totalPrice || ""),
          order.deliveryAddress || "",
        ]
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([`${header}\n${rows}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `orders_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    pushToast({
      type: "success",
      title: "CSV exported",
      message: `${orders.length} orders downloaded.`,
    });
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    pushToast({
      type: "info",
      title: "Signed out",
      message: "Redirecting to admin login.",
    });
    router.push("/admin/login");
  };

  const statCards = [
    {
      label: "Total Orders",
      value: stats.total,
      icon: ShoppingBag,
      tone: "from-[#fff7ed] to-[#fde68a]",
    },
    {
      label: "Pending Orders",
      value: stats.pending,
      icon: Clock3,
      tone: "from-[#fff7ed] to-[#fed7aa]",
    },
    {
      label: "Ready Orders",
      value: stats.ready,
      icon: PackageCheck,
      tone: "from-[#ecfdf5] to-[#bbf7d0]",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      icon: Truck,
      tone: "from-[#f8fafc] to-[#e2e8f0]",
    },
    {
      label: "Total Revenue",
      value: currency.format(stats.revenue),
      icon: IndianRupee,
      tone: "from-[#fdf2f8] to-[#fbcfe8]",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#fff1e6,transparent_35%),linear-gradient(135deg,#fff7ee_0%,#f8e7d8_50%,#fdf2f8_100%)] px-4 py-5 text-[#3f231f] sm:px-6 lg:px-8">
      <ToastStack
        toasts={toasts}
        onDismiss={(id) =>
          setToasts((current) => current.filter((toast) => toast.id !== id))
        }
      />
      <ConfirmModal
        dialog={confirmDialog}
        onCancel={() => setConfirmDialog(null)}
      />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-[28px] border border-white/70 bg-white/55 p-5 shadow-[0_30px_90px_rgba(90,47,43,0.12)] backdrop-blur-2xl sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/65 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#9a5a31]">
                <Sparkles size={14} />
                Mavi Bakes Admin
              </div>
              <h1 className="font-serif text-3xl font-bold leading-tight text-[#3f231f] sm:text-4xl">
                Real-time Orders
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#76524c] sm:text-base">
                Track incoming cakes, prep status, customer messages, and
                delivery flow from one bakery command center.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative inline-flex h-12 items-center gap-3 rounded-2xl border border-white/80 bg-white/70 px-4 shadow-sm">
                <Bell size={20} className="text-[#a04035]" />
                <span className="text-sm font-semibold">Pending</span>
                <span className="grid min-w-7 place-items-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white shadow-lg shadow-red-500/30">
                  {stats.pending}
                </span>
                {newOrderIds.size ? (
                  <span className="absolute -right-2 -top-2 rounded-full bg-[#ef4444] px-2 py-0.5 text-[11px] font-bold text-white shadow-lg">
                    +{newOrderIds.size}
                  </span>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => void fetchOrders({ notify: false })}
                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/80 bg-white/75 px-4 text-sm font-bold text-[#5a2f2b] shadow-sm transition hover:-translate-y-0.5 hover:bg-white disabled:opacity-60"
                disabled={refreshing}
              >
                <RefreshCw
                  size={18}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
              <button
                type="button"
                onClick={exportCSV}
                className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#5a2f2b] px-4 text-sm font-bold text-white shadow-lg shadow-[#5a2f2b]/20 transition hover:-translate-y-0.5"
              >
                <Download size={18} />
                Export
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-12 items-center gap-2 rounded-2xl border border-[#5a2f2b]/10 bg-white/60 px-4 text-sm font-bold text-[#5a2f2b] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </section>

        <section className="rounded-[24px] border border-white/70 bg-white/55 p-4 shadow-[0_20px_60px_rgba(90,47,43,0.09)] backdrop-blur-2xl">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <label className="relative block">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9a6b62]"
                size={18}
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search customer, phone, cake, address, or order ID"
                className="h-12 w-full rounded-2xl border border-white/80 bg-white/80 pl-11 pr-4 text-sm font-medium outline-none ring-0 transition focus:border-[#c27a2c] focus:bg-white"
              />
            </label>

            <label className="relative block">
              <CalendarDays
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9a6b62]"
                size={18}
              />
              <input
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                type="date"
                className="h-12 w-full rounded-2xl border border-white/80 bg-white/80 pl-11 pr-4 text-sm font-bold text-[#5a2f2b] outline-none transition focus:border-[#c27a2c] focus:bg-white lg:w-48"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setDateFilter("");
              }}
              className="h-12 rounded-2xl border border-[#5a2f2b]/10 bg-white/60 px-4 text-sm font-bold text-[#5a2f2b] transition hover:bg-white"
            >
              Clear filters
            </button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {["All", ...ORDER_STATUSES].map((status) => {
              const active = statusFilter === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
                    active
                      ? "bg-[#5a2f2b] text-white shadow-lg shadow-[#5a2f2b]/20"
                      : "bg-white/65 text-[#6e4942] hover:bg-white"
                  }`}
                >
                  {status}
                </button>
              );
            })}
          </div>
        </section>

        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50/90 p-5 text-sm font-semibold text-red-800 shadow-sm">
            {error}
          </div>
        ) : null}

        {initialLoading ? (
          <LoadingSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState hasOrders={orders.length > 0} />
        ) : (
          <section className="grid gap-4 xl:grid-cols-2">
            {filtered.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isNew={newOrderIds.has(order.id)}
                isLoading={Boolean(loadingMap[order.id])}
                onStatusChange={updateStatus}
                onThankYou={sendThankYou}
                onReady={sendCakeReady}
                onDelete={deleteOrder}
              />
            ))}
          </section>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value, icon: Icon, tone }) {
  return (
    <article
      className={`group rounded-[22px] border border-white/80 bg-gradient-to-br ${tone} p-4 shadow-[0_18px_45px_rgba(90,47,43,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(90,47,43,0.14)]`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8b5a4e]">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black tabular-nums text-[#3f231f]">
            {value}
          </p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/75 text-[#5a2f2b] shadow-sm transition group-hover:scale-105">
          <Icon size={22} />
        </div>
      </div>
    </article>
  );
}

function OrderCard({
  order,
  isNew,
  isLoading,
  onStatusChange,
  onThankYou,
  onReady,
  onDelete,
}) {
  const status = order.status || "Pending";
  const StatusIcon = statusMeta[status].icon;
  const pendingStyle = status === "Pending" ? "ring-2 ring-amber-300/70" : "";
  const completedStyle = status === "Delivered" ? "opacity-80" : "";

  return (
    <article
      className={`relative overflow-hidden rounded-[26px] border border-white/75 bg-white/70 p-5 shadow-[0_20px_65px_rgba(90,47,43,0.1)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/85 hover:shadow-[0_28px_80px_rgba(90,47,43,0.14)] ${pendingStyle} ${completedStyle} ${
        isNew ? "bg-gradient-to-br from-white via-[#fff7ed] to-[#fee2e2]" : ""
      }`}
    >
      {isNew ? (
        <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-red-500/10" />
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {isNew ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-red-500/20">
                <Bell size={12} />
                New
              </span>
            ) : null}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-black ring-1 ${statusMeta[status].className}`}
            >
              <StatusIcon size={13} />
              {statusMeta[status].label}
            </span>
            <span className="rounded-full bg-[#5a2f2b]/10 px-2.5 py-1 text-xs font-bold text-[#5a2f2b]">
              #{shortId(order.id)}
            </span>
          </div>
          <h2 className="truncate text-xl font-black text-[#3f231f]">
            {order.customerName || "Unnamed customer"}
          </h2>
          <p className="mt-1 text-sm font-semibold text-[#7b5a51]">
            {order.cakeName || "Custom cake"} · Qty {order.quantity ?? 1}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-2xl font-black text-[#3f231f]">
            {currency.format(Number(order.totalPrice || 0))}
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[#916a60]">
            Delivery {formatDate(order.deliveryDate)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-[#5f433d] sm:grid-cols-2">
        <InfoPill label="Phone" value={order.phoneNumber || "No phone"} />
        <InfoPill label="Created" value={formatDate(order.createdAt)} />
        <InfoPill
          label="Address"
          value={order.deliveryAddress || "No address"}
          wide
        />
        {order.customMessage ? (
          <InfoPill label="Message" value={order.customMessage} wide />
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-[#5a2f2b]/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <select
          value={status}
          onChange={(event) =>
            void onStatusChange(order.id, event.target.value)
          }
          disabled={isLoading}
          className="h-11 rounded-2xl border border-[#5a2f2b]/10 bg-white/80 px-3 text-sm font-bold text-[#5a2f2b] outline-none transition focus:border-[#c27a2c] disabled:opacity-60"
        >
          {ORDER_STATUSES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <div className="grid grid-cols-3 gap-2 sm:flex">
          <ActionButton
            label={order.thankYouSent ? "Thanked" : "Thank You"}
            icon={MessageCircle}
            disabled={isLoading}
            onClick={() => onThankYou(order)}
          />

          <ActionButton
            label={order.cakeReadySent ? "Notified" : "Ready"}
            icon={Send}
            disabled={isLoading}
            onClick={() => onReady(order)}
          />

          <ActionButton
            label="Delete"
            icon={Trash2}
            danger
            disabled={isLoading}
            onClick={() => onDelete(order.id)}
          />
        </div>
      </div>
    </article>
  );
}

function InfoPill({ label, value, wide = false }) {
  return (
    <div
      className={`rounded-2xl border border-white/70 bg-white/55 px-3 py-2 ${wide ? "sm:col-span-2" : ""}`}
    >
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#9a6b62]">
        {label}
      </p>
      <p className="mt-1 break-words font-semibold">{value}</p>
    </div>
  );
}

function ActionButton({
  label,
  icon: Icon,
  onClick,
  disabled,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-3 text-xs font-black transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${
        danger
          ? "bg-red-50 text-red-700 hover:bg-red-100"
          : "bg-[#5a2f2b] text-white shadow-lg shadow-[#5a2f2b]/15 hover:bg-[#6f3933]"
      }`}
    >
      <Icon size={15} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-72 animate-pulse rounded-[26px] border border-white/70 bg-white/55 p-5 shadow-[0_20px_65px_rgba(90,47,43,0.08)]"
        >
          <div className="h-5 w-32 rounded-full bg-white/80" />
          <div className="mt-5 h-8 w-56 rounded-full bg-white/80" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="h-16 rounded-2xl bg-white/70" />
            <div className="h-16 rounded-2xl bg-white/70" />
            <div className="h-16 rounded-2xl bg-white/70 sm:col-span-2" />
          </div>
        </div>
      ))}
    </section>
  );
}

function EmptyState({ hasOrders }) {
  return (
    <section className="rounded-[30px] border border-white/75 bg-white/60 p-10 text-center shadow-[0_22px_70px_rgba(90,47,43,0.1)] backdrop-blur-2xl">
      <div className="mx-auto grid h-24 w-24 place-items-center rounded-[28px] bg-gradient-to-br from-[#fff7ed] to-[#fecaca] text-[#5a2f2b] shadow-inner">
        <ShoppingBag size={42} />
      </div>
      <h2 className="mt-6 font-serif text-2xl font-bold text-[#3f231f]">
        {hasOrders ? "No orders match your filters" : "No bakery orders yet"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#76524c]">
        {hasOrders
          ? "Try clearing the search, status, or date filter to see more orders."
          : "New cake orders will appear here automatically with sound and toast notifications."}
      </p>
    </section>
  );
}

function ToastStack({ toasts, onDismiss }) {
  const tone = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    error: "border-red-200 bg-red-50 text-red-900",
    info: "border-amber-200 bg-white text-[#5a2f2b]",
  };

  return (
    <div className="fixed right-4 top-4 z-[80] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-[toast-in_260ms_ease-out] rounded-2xl border p-4 shadow-[0_18px_55px_rgba(90,47,43,0.18)] backdrop-blur-xl ${tone[toast.type]}`}
        >
          <div className="flex items-start gap-3">
            <Bell size={18} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-black">{toast.title}</p>
              <p className="mt-1 text-sm opacity-80">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-full p-1 transition hover:bg-black/5"
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ConfirmModal({ dialog, onCancel }) {
  if (!dialog) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-[#2d1714]/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] border border-white/70 bg-white p-6 text-[#3f231f] shadow-[0_30px_100px_rgba(45,23,20,0.24)]">
        <h2 className="font-serif text-2xl font-bold">{dialog.title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#76524c]">
          {dialog.message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-[#5a2f2b]/10 px-4 py-2 text-sm font-bold text-[#5a2f2b] transition hover:bg-[#5a2f2b]/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void dialog.onConfirm()}
            className={`rounded-2xl px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-0.5 ${
              dialog.tone === "danger"
                ? "bg-red-600 shadow-lg shadow-red-500/20"
                : "bg-[#5a2f2b] shadow-lg shadow-[#5a2f2b]/20"
            }`}
          >
            {dialog.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
