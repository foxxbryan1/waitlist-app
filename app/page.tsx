"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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

      setStatus("success");
      setName("");
      setEmail("");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Coming Soon
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-center text-gray-900 mb-4">
          Get early access before everyone else
        </h1>
        <p className="text-center text-gray-500 mb-10 leading-relaxed">
          We&apos;re building something you&apos;ll love. Join the waitlist and
          be the first to know when we launch — no spam, ever.
        </p>

        {status === "success" ? (
          <div className="rounded-2xl bg-green-50 border border-green-200 p-6 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <p className="font-semibold text-green-800 text-lg">
              You&apos;re on the list!
            </p>
            <p className="text-green-600 text-sm mt-1">
              We&apos;ll be in touch when we launch.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1.5"
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
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
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
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Joining…" : "Join the Waitlist"}
            </button>

            <p className="text-center text-xs text-gray-400">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
