"use client";

import { useState } from "react";

const platforms = ["Instagram", "Twitter", "LinkedIn", "TikTok"] as const;
type Platform = (typeof platforms)[number];

export default function ToolsPage() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [captions, setCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  async function handleGenerate() {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    setCaptions([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ topic, platform }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setCaptions(data.captions);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(text: string, index: number) {
    await navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <main className="min-h-screen bg-[#0d0d12] text-white">
      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-950 px-3 py-1 text-xs font-medium text-purple-300 ring-1 ring-purple-700 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
            Powered by Claude AI
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            AI tools built for{" "}
            <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              marketers
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Generate platform-ready captions in seconds. Paste a topic or product description, pick your platform, and let AI do the writing.
          </p>
        </div>
      </section>

      {/* Caption Generator */}
      <section className="pb-24 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl bg-[#16161f] border border-white/8 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-white mb-5">Caption Generator</h2>

            {/* Topic textarea */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1.5">
                Topic or product description
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. A new skincare serum that reduces dark spots in 2 weeks..."
                rows={4}
                className="w-full rounded-xl bg-[#0d0d12] border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-600 transition-colors resize-none"
              />
            </div>

            {/* Platform selector */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-1.5">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full rounded-xl bg-[#0d0d12] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-600 transition-colors appearance-none cursor-pointer"
              >
                {platforms.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 text-sm font-semibold text-white transition shadow-lg shadow-purple-900/40 active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate captions"
              )}
            </button>

            {/* Error */}
            {error && (
              <p className="mt-4 text-sm text-red-400 bg-red-950/40 border border-red-800/40 rounded-lg px-4 py-3">
                {error}
              </p>
            )}
          </div>

          {/* Results */}
          {captions.length > 0 && (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-gray-500 font-medium">3 captions for {platform}</p>
              {captions.map((caption, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-[#16161f] border border-white/8 hover:border-purple-700/50 transition-colors duration-200 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap flex-1">
                      {caption}
                    </p>
                    <button
                      onClick={() => handleCopy(caption, i)}
                      className="shrink-0 rounded-lg bg-white/8 hover:bg-purple-600 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white transition-colors"
                    >
                      {copied === i ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
