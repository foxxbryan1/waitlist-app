"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [position, setPosition] = useState<number | null>(null);
  const [displayPosition, setDisplayPosition] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === "success" && position !== null && position > 0) {
      const duration = 600;
      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayPosition(Math.round(eased * position));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
      return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }
  }, [status, position]);

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
    <main className="bg-[#0d0d12] text-white">

      {/* ── Hero ── */}
      <section className="px-4 pt-28 pb-24">
        <div className="mx-auto max-w-6xl flex flex-col lg:flex-row items-center gap-12">

          {/* Left: text */}
          <div className="flex-1 flex flex-col items-start text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-950 px-3 py-1 text-xs font-medium text-purple-300 ring-1 ring-purple-700 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              Now in private beta
            </span>

            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
              Marketing that thinks{" "}
              <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                for itself
              </span>
            </h1>

            <p className="max-w-lg text-lg text-gray-400 leading-relaxed mb-10">
              Captivly uses AI to write your campaigns, schedule your posts, and
              grow your audience — automatically.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <a
                href="/#signup"
                className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-500 active:scale-[0.98] transition shadow-lg shadow-purple-900/40"
              >
                Get started free
              </a>
              <a
                href="/tools"
                className="rounded-lg border border-purple-500 px-6 py-3 text-sm font-semibold text-purple-400 hover:bg-purple-500/10 active:scale-[0.98] transition"
              >
                See it in action
              </a>
            </div>
          </div>

          {/* Right: mock UI card */}
          <div className="flex-1 w-full lg:max-w-[480px]">
            <div className="rounded-2xl bg-[#16161f] border border-white/10 p-6 shadow-2xl shadow-black/60">

              {/* Card header */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
                </div>
                <span className="text-xs font-medium text-gray-500 ml-2">Caption Generator</span>
              </div>

              {/* Input row */}
              <div className="mb-4">
                <label className="block text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Product / Context</label>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
                  <span className="text-sm text-gray-400 flex-1">Nike sneaker drop, limited edition...</span>
                  <span className="text-xs rounded-md bg-purple-600/30 border border-purple-500/30 text-purple-300 px-2 py-0.5 font-medium">Instagram</span>
                </div>
              </div>

              {/* Generate button (static) */}
              <div className="mb-5">
                <div className="w-full rounded-lg bg-purple-600/80 px-4 py-2 text-sm font-semibold text-white text-center opacity-90">
                  Generate Caption ✦
                </div>
              </div>

              {/* Result card */}
              <div className="rounded-xl border border-purple-500/20 bg-purple-950/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  <span className="text-xs font-semibold text-purple-300 uppercase tracking-wide">Generated Caption</span>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed mb-3">
                  They said it couldn&apos;t be done. We did it anyway. 👟🔥
                </p>
                <p className="text-sm text-gray-300 leading-relaxed mb-3">
                  Introducing the Air Max Apex — limited to 500 pairs worldwide. Drop your size in the comments before they&apos;re gone. No restocks. No regrets.
                </p>
                <p className="text-xs text-purple-400/80">
                  #NikeAirMax #LimitedEdition #SneakerDrop #Hype #Nike
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400 cursor-default">Copy</span>
                  <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-gray-400 cursor-default">Regenerate</span>
                  <span className="rounded-md border border-purple-500/30 bg-purple-600/20 px-2.5 py-1 text-xs text-purple-300 cursor-default">Use this</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── Social proof bar ── */}
      <section className="border-y border-white/8 py-6 px-4 text-center">
        <p className="text-sm text-gray-400">
          Be one of the first to get access — spots are limited.
        </p>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-center mb-14">
            How Captivly works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Describe your product",
                desc: "Tell Captivly what you sell and who you're targeting in plain English.",
              },
              {
                step: "2",
                title: "Pick your platform",
                desc: "Choose from Instagram, LinkedIn, email, Google Ads, and more.",
              },
              {
                step: "3",
                title: "Get AI-generated copy instantly",
                desc: "Receive polished, on-brand content ready to publish in seconds.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-purple-600/20 ring-1 ring-purple-500/40 flex items-center justify-center text-lg font-black text-purple-400 mb-5">
                  {step}
                </div>
                <p className="font-semibold text-white mb-2">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features preview ── */}
      <section className="py-24 px-4 border-t border-white/8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-center mb-14">
            Everything you need to grow
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: "✦",
                title: "AI Copywriting",
                desc: "Generate campaign copy, emails, and ads in seconds — tailored to your brand voice.",
              },
              {
                icon: "◷",
                title: "Auto Scheduling",
                desc: "Post to every channel at the perfect time, automatically, without lifting a finger.",
              },
              {
                icon: "◈",
                title: "Audience Insights",
                desc: "Know exactly who to target and when to reach them with AI-powered analytics.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl bg-[#16161f] border border-white/8 p-6 hover:border-purple-500/30 transition-colors"
              >
                <span className="text-purple-400 text-2xl leading-none">{icon}</span>
                <p className="mt-4 font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Waitlist form ── */}
      <section id="signup" className="py-24 px-4 border-t border-white/8">
        <div className="mx-auto max-w-md">
          <h2 className="text-3xl font-extrabold tracking-tight text-center mb-3">
            Get early access
          </h2>
          <p className="text-center text-gray-400 text-sm mb-10">
            Reserve your spot today. We&apos;ll let you know the moment we launch.
          </p>

          {status === "success" ? (
            <div className="rounded-2xl bg-purple-950/60 border border-purple-800 p-8 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <p className="font-extrabold text-white text-2xl tracking-tight mb-1">
                You&apos;re in!
              </p>
              {position !== null && (
                <p className="text-4xl font-black bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent my-3">
                  #{displayPosition} on the list
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
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
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
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
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 py-8 px-4 text-center">
        <p className="text-xs text-gray-600">© 2026 Captivly Inc. All rights reserved.</p>
      </footer>

    </main>
  );
}
