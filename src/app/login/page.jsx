"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!email || !password) {
      setMessage("Please fill in both fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.error || "Invalid email or password");
        return;
      }
      if (data.role === "admin") {
        router.push("/admin");
        return;
      }
      router.push("/profile");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--background)" }}
    >
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl glass">
        <div className="text-center mb-6">
          <div
            className="mx-auto w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--color-blush), var(--color-beige))",
              color: "var(--color-chocolate)",
              fontWeight: 700,
            }}
          >
            M
          </div>
          <h2
            className="mt-4 text-2xl font-serif"
            style={{ color: "var(--foreground)" }}
          >
            Welcome back
          </h2>
          <p className="mt-1 text-sm" style={{ color: "rgba(62,39,35,0.7)" }}>
            Sign in to continue to MaviBakes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm mb-1"
              style={{ color: "var(--foreground)" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg"
              style={{
                border: "1px solid rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.6)",
              }}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm mb-1"
              style={{ color: "var(--foreground)" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg"
              style={{
                border: "1px solid rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.6)",
              }}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label
              className="flex items-center gap-2"
              style={{ color: "var(--foreground)" }}
            >
              <input type="checkbox" className="w-4 h-4" /> Remember me
            </label>
            <a
              href="#"
              className="text-sm"
              style={{ color: "var(--color-chocolate)" }}
            >
              Forgot?
            </a>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-medium"
              style={{
                background:
                  "linear-gradient(90deg, var(--color-blush), var(--color-gold))",
                color: "var(--color-chocolate)",
              }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div
            className="text-center text-sm text-muted mt-2"
            style={{ color: "rgba(62,39,35,0.6)" }}
          >
            <span>or continue with</span>
          </div>

          <div className="flex gap-3 mt-3">
            <button
              type="button"
              className="flex-1 py-2 rounded-lg"
              style={{
                background: "white",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              Google
            </button>
            <button
              type="button"
              className="flex-1 py-2 rounded-lg"
              style={{
                background: "white",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              Apple
            </button>
          </div>

          {message && (
            <p
              className="text-sm mt-3 text-center"
              style={{ color: "var(--color-chocolate)" }}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
