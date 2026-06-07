"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!username || !password) {
      setMessage("Please fill in both fields.");
      return;
    }
    setLoading(true);
    // Placeholder: replace with real admin auth request
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setMessage("Admin login submitted (placeholder).");
    // router.push('/admin/dashboard');
  };

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
      <div className="w-full max-w-md p-8 glass">
        <h1 className="text-2xl font-serif mb-4" style={{ color: "var(--foreground)" }}>Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm" style={{ color: "var(--foreground)" }}>Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-1 p-2 rounded-md border"
              placeholder="admin"
            />
          </label>

          <label className="block">
            <span className="text-sm" style={{ color: "var(--foreground)" }}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 rounded-md border"
              placeholder="••••••••"
            />
          </label>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="px-4 py-2 rounded-md"
              style={{ background: "var(--color-chocolate)", color: "var(--color-cream)" }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Admin sign in"}
            </button>
          </div>

          {message && (
            <p className="text-sm mt-2" style={{ color: "var(--color-chocolate)" }}>{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}
