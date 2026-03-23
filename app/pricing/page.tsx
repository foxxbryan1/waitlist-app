import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Captivly",
  description: "Simple, transparent pricing for every stage of growth",
};

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Get started with the basics",
    features: [
      "1 user",
      "10 AI generations/month",
      "Basic analytics",
      "Email support",
    ],
    cta: "Get started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Everything you need to grow fast",
    features: [
      "5 users",
      "Unlimited AI generations",
      "Advanced analytics",
      "Priority support",
      "A/B testing",
    ],
    cta: "Get started",
    popular: true,
  },
  {
    name: "Business",
    price: "$99",
    period: "/month",
    description: "For teams that demand more",
    features: [
      "Unlimited users",
      "Unlimited AI generations",
      "Custom integrations",
      "Dedicated support",
      "White label",
    ],
    cta: "Get started",
    popular: false,
  },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 shrink-0 text-purple-400"
    >
      <path d="M3 8l3.5 3.5L13 4" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0d0d12] px-4 py-20">
      {/* Hero */}
      <section className="mx-auto max-w-3xl text-center mb-16">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-950 px-3 py-1 text-xs font-medium text-purple-300 ring-1 ring-purple-700 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
          No hidden fees
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-white leading-tight mb-5">
          Simple,{" "}
          <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            transparent pricing
          </span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto">
          Start free. Scale as you grow. Cancel anytime.
        </p>
      </section>

      {/* Pricing tiers */}
      <section className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={
                tier.popular
                  ? "relative rounded-2xl border border-purple-500 bg-gradient-to-b from-purple-950/40 to-[#16161f] p-8 shadow-xl shadow-purple-900/30 flex flex-col"
                  : "relative rounded-2xl border border-white/8 bg-[#16161f] p-8 flex flex-col"
              }
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-purple-900/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-200" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier header */}
              <div className="mb-6">
                <p className={`text-sm font-semibold mb-1 ${tier.popular ? "text-purple-400" : "text-gray-400"}`}>
                  {tier.name}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-extrabold tracking-tight text-white">
                    {tier.price}
                  </span>
                  <span className="text-gray-500 text-sm mb-1">{tier.period}</span>
                </div>
                <p className="text-sm text-gray-500">{tier.description}</p>
              </div>

              {/* Divider */}
              <div className={`border-t mb-6 ${tier.popular ? "border-purple-800/60" : "border-white/8"}`} />

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5">
                    <CheckIcon />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="/"
                className={
                  tier.popular
                    ? "block w-full rounded-lg bg-purple-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-purple-500 active:scale-[0.98] transition shadow-lg shadow-purple-900/40"
                    : "block w-full rounded-lg bg-white/8 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-purple-600 active:scale-[0.98] transition border border-white/10 hover:border-purple-500"
                }
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ nudge */}
      <section className="mx-auto max-w-xl text-center mt-16">
        <p className="text-sm text-gray-500">
          Questions?{" "}
          <a href="mailto:hello@launchly.com" className="text-purple-400 hover:text-purple-300 transition">
            Talk to us
          </a>{" "}
          — we&apos;re happy to help.
        </p>
      </section>
    </main>
  );
}
