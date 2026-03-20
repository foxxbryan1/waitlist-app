"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

interface Signup {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [signups, setSignups] = useState<Signup[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");

  const fetchSignups = useCallback(async (accessToken: string) => {
    setDataLoading(true);
    setDataError("");
    try {
      const res = await fetch("/api/signups", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = await res.json();
      if (!res.ok) {
        setDataError(json.error || "Failed to load signups.");
      } else {
        setSignups(json.signups);
      }
    } catch {
      setDataError("Network error loading signups.");
    } finally {
      setDataLoading(false);
    }
  }, []);

  // Check existing session on mount and listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.access_token) {
        fetchSignups(session.access_token);
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.access_token) {
          fetchSignups(session.access_token);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchSignups]);

  async function handleSendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoginLoading(false);

    if (error) {
      setLoginError(error.message);
    } else {
      setMagicLinkSent(true);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setSignups([]);
  }

  function exportCSV() {
    const header = "Name,Email,Date Joined\n";
    const rows = signups
      .map((s) => `"${s.name}","${s.email}","${new Date(s.created_at).toLocaleString()}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "waitlist-signups.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading…</div>
      </main>
    );
  }

  // Not logged in — show login form
  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>
          <p className="text-center text-gray-500 text-sm mb-8">
            Enter your email to receive a magic link.
          </p>

          {magicLinkSent ? (
            <div className="rounded-xl bg-green-50 border border-green-200 p-5 text-center">
              <p className="font-semibold text-green-800">Check your inbox!</p>
              <p className="text-green-600 text-sm mt-1">
                We sent a login link to <strong>{email}</strong>.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSendMagicLink}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
            >
              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>

              {loginError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loginLoading ? "Sending…" : "Send Magic Link"}
              </button>
            </form>
          )}
        </div>
      </main>
    );
  }

  // Logged in — show dashboard
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Waitlist Admin</h1>
            <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-gray-800 transition"
          >
            Sign out
          </button>
        </div>

        {/* Stats + Export */}
        <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 mb-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-0.5">
              Total Signups
            </p>
            <p className="text-3xl font-bold text-gray-900">{signups.length}</p>
          </div>
          <button
            onClick={exportCSV}
            disabled={signups.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {dataLoading ? (
            <div className="p-12 text-center text-gray-400 text-sm">Loading signups…</div>
          ) : dataError ? (
            <div className="p-12 text-center text-red-500 text-sm">{dataError}</div>
          ) : signups.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">No signups yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 font-medium text-gray-500">#</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Date Joined</th>
                </tr>
              </thead>
              <tbody>
                {signups.map((signup, i) => (
                  <tr
                    key={signup.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-6 py-3 font-medium text-gray-900">{signup.name}</td>
                    <td className="px-6 py-3 text-gray-600">{signup.email}</td>
                    <td className="px-6 py-3 text-gray-400">
                      {new Date(signup.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
