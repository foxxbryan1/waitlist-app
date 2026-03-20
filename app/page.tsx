"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [position, setPosition] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setPosition(data.position ?? null);
      setStatus("success");
      setName("");
      setEmail("");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20 bg-[#0d0d12]">
      <div className="w-full max-w-md">
        {/* Brand wordmark */}
        <div className="flex justify-center mb-4">
          <span className="text-3xl font-bold tracking-tight text-white">Launchly</span>
        </div>

        {/* Tagline badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-950 px-3 py-1 text-xs font-medium text-purple-300 ring-1 ring-purple-700">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
            Now in private beta
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-center text-white mb-4 leading-tight">
          Marketing that thinks{" "}
          <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            for itself
          </span>
        </h1>
        <p className="text-center text-gray-400 mb-10 leading-relaxed">
          Launchly uses AI to write your campaigns, schedule your posts, and
          grow your audience — automatically.
        </p>

        {status === "success" ? (
          <div className="rounded-2xl bg-purple-950/60 border border-purple-800 p-8 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <p className="font-extrabold text-white text-2xl tracking-tight mb-1">
              You&apos;re in!
            </p>
            {position !== null && (
              <p className="text-4xl font-black bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent my-3">
                #{position} on the list
              </p>
            )}
            <p className="text-purple-400 text-sm mt-1">
              We&apos;ll be in touch when we launch.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#16161f] rounded-2xl border border-white/10 p-8 space-y-5 shadow-xl shadow-black/40"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-lg px-3 py-2">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-purple-900/40"
            >
              {status === "loading" ? "Joining…" : "Join the waitlist"}
            </button>

            <p className="text-center text-xs text-gray-600">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>

      <footer className="mt-16 border-t border-white/10 pt-6 w-full max-w-md text-center">
        <p className="text-xs text-gray-600">© 2026 Launchly Inc. All rights reserved.</p>
      </footer>
    </main>
  );
}
