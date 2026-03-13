"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-800 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1
            className="text-4xl font-bold text-white tracking-[0.05em]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            LBC
          </h1>
          <div className="w-10 h-[1px] bg-gold-400 mx-auto mt-4 mb-3" />
          <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">Admin Panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-[2px] shadow-2xl space-y-5"
        >
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-400 font-medium mb-2">
              Username
            </label>
            <input
              name="username"
              required
              autoComplete="username"
              placeholder="admin"
              className="w-full px-4 py-3 border border-neutral-200 rounded-[2px] text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:border-brand-600 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-400 font-medium mb-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-neutral-200 rounded-[2px] text-sm text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:border-brand-600 transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-[2px]">
              <p className="text-xs text-red-600 text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-800 text-white py-3 text-[12px] uppercase tracking-[0.2em] font-medium rounded-[2px] hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
