import React from "react";
import { ShieldCheck, DollarSign, Headphones, RotateCcw } from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      icon: ShieldCheck,
      title: "Comprehensive Warranty",
      description:
        "Every device is backed by official warranty coverage — up to 2 years for NovaBook laptops and 6 months for NovaBuds.",
      badge: "Official Protection",
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      description:
        "No hidden charges or surprise surcharges. All prices are explicitly listed with honest checkout calculations and clear warranty terms.",
      badge: "No Hidden Fees",
    },
    {
      icon: Headphones,
      title: "AI & Human Product Support",
      description:
        "Instant technical specifications, delivery answers, and recommendations via our Gemini chatbot or local New York support channels.",
      badge: "Always Available",
    },
    {
      icon: RotateCcw,
      title: "7-Day Inspection Window",
      description:
        "Unopened, unused products in original packaging are eligible for return within 7 days. Transit damages reported within 48 hours are prioritized.",
      badge: "Clear Policies",
    },
  ];

  return (
    <section id="benefits" className="py-20 md:py-28 relative bg-[#070b14]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
            <span>Why Choose ComputeIQ Tech</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Confidence in Every Tech Investment
          </h2>
          <p className="mt-4 text-base text-slate-400">
            We hold ourselves to rigorous standards in reliability, transparent
            policies, and modern customer assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0e1627] p-7 transition-all duration-300 hover:border-cyan-500/40 hover:bg-[#121c32] hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-300 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-cyan-400/90 uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
