"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Bot, ShieldCheck, Truck, Clock } from "lucide-react";

interface HeroProps {
  onOpenChat: (initialPrompt?: string) => void;
}

export function Hero({ onOpenChat }: HeroProps) {
  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-tech-pattern"
    >
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/15 to-violet-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-500/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1.5 text-xs font-medium text-cyan-300 backdrop-blur-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
              <span>Next-Generation Electronics in New York, USA</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Technology That{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                Moves You Forward
              </span>
            </h1>

            {/* Supporting description */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Experience handcrafted computing power, crystal-clear acoustic
              precision, and intelligent fast-charging designed for tomorrow.
              Backed by official warranty coverage and round-the-clock Gemini AI
              assistance in New York.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={scrollToProducts}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore Products</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() =>
                  onOpenChat("What products and warranty options do you offer?")
                }
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800/90 hover:border-cyan-500/50 px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all active:scale-[0.98]"
              >
                <Bot className="h-4 w-4 text-cyan-400" />
                <span>Ask Our AI Assistant</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="mt-12 grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 w-full max-w-lg">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Official
                  </div>
                  <div className="text-[11px] text-slate-400">Warranty</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Truck className="h-5 w-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    NYC & US
                  </div>
                  <div className="text-[11px] text-slate-400">Fast Shipping</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-5 w-5 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Mon–Sat
                  </div>
                  <div className="text-[11px] text-slate-400">9AM - 6PM EST</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl p-2 bg-gradient-to-b from-cyan-500/20 via-slate-800/40 to-transparent border border-slate-700/60 shadow-2xl shadow-cyan-950/50">
              <div className="overflow-hidden rounded-xl bg-slate-950 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3]">
                <Image
                  src="/images/hero-banner.jpg"
                  alt="ComputeIQ Tech flagship lineup: NovaBook, NovaBuds, and NovaCharge"
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070b14]/80 via-transparent to-transparent pointer-events-none" />

                {/* Floating mini badge on image */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/60 p-3 shadow-lg">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      NovaBook & NovaBuds Series
                    </span>
                    <span className="text-[11px] text-cyan-400">
                      Now available at ComputeIQ Tech NYC
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      onOpenChat(
                        "Tell me about the NovaBook series and NovaBuds."
                      )
                    }
                    className="flex items-center gap-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 px-2.5 py-1 text-xs font-medium transition-colors"
                  >
                    <span>Ask AI</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
