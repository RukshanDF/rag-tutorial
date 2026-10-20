"use client";

import React from "react";
import {
  MapPin,
  Clock,
  Truck,
  RotateCcw,
  Bot,
  AlertCircle,
} from "lucide-react";

interface ContactSectionProps {
  onOpenChat: (initialPrompt?: string) => void;
}

export function ContactSection({ onOpenChat }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="py-20 md:py-28 border-t border-slate-800/80 bg-[#090e1a] relative"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
            <span>Store Operations & Support</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Visit Us or Inquire Anytime
          </h2>
          <p className="mt-4 text-base text-slate-400">
            Have a question about delivery rates, product compatibility, or
            opening hours? Our assistant is ready to help 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Demo Store Info */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Location & Hours */}
            <div className="rounded-2xl border border-slate-800 bg-[#101728] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-800/50 text-cyan-400 mb-4">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                Store Location
              </h3>
              <p className="text-sm text-slate-300">New York, NY, USA</p>
              <p className="text-xs text-slate-400 mt-1">
                Manhattan flagship showroom & pickup hub
              </p>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-1">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  <span>Opening Hours (EST)</span>
                </div>
                <p className="text-xs text-slate-400">
                  Monday – Saturday: 9:00 AM – 6:00 PM EST
                </p>
                <p className="text-xs text-rose-400/90 font-medium mt-0.5">
                  Closed on Sundays
                </p>
              </div>
            </div>

            {/* Delivery Policies */}
            <div className="rounded-2xl border border-slate-800 bg-[#101728] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-800/50 text-cyan-400 mb-4">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Shipping & Delivery Rates
              </h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex justify-between">
                  <span className="text-slate-400">NYC Metro Courier:</span>
                  <span className="font-semibold text-white">$15 (LKR 500)</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-400">Outside NYC / Domestic:</span>
                  <span className="font-semibold text-white">$35 (LKR 1,200)</span>
                </li>
                <li className="flex justify-between text-cyan-300">
                  <span>NYC Orders &gt; $500 (LKR 50,000):</span>
                  <span className="font-bold">FREE</span>
                </li>
                <li className="pt-2 border-t border-slate-800 text-slate-400">
                  Standard delivery timeline: 2–4 business days
                </li>
              </ul>
            </div>

            {/* Returns & Damaged Goods */}
            <div className="rounded-2xl border border-slate-800 bg-[#101728] p-6 sm:col-span-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-800/50 text-cyan-400 mb-4">
                <RotateCcw className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Return & Replacement Policy
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="rounded-xl bg-slate-900/60 p-3.5 border border-slate-800">
                  <span className="font-semibold text-white block mb-1">
                    7-Day Return Window
                  </span>
                  Eligible within 7 days of receipt, provided items are unused,
                  in complete original packaging, with all accessories intact.
                </div>
                <div className="rounded-xl bg-slate-900/60 p-3.5 border border-slate-800">
                  <span className="font-semibold text-white block mb-1">
                    Transit Damage Claims
                  </span>
                  Any physical damage or delivery discrepancy must be reported
                  within 48 hours of courier delivery for swift replacement.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: AI Assistant Direct Query Box & Educational Note */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#101c36] via-[#0d162b] to-[#0a1020] p-7 shadow-xl shadow-cyan-950/30">
            <div>
              <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3">
                <Bot className="h-5 w-5 text-cyan-400" />
                <span>Immediate Assistance</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Have questions regarding store policies?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Our Gemini AI Assistant is grounded with our exact New York store
                hours, shipping costs, warranty terms, and product catalog. Click
                any topic below to test:
              </p>

              <div className="flex flex-col gap-2.5">
                {[
                  "What are your delivery fees in New York and nationwide?",
                  "Can I return an item if I change my mind?",
                  "What are your opening hours in New York?",
                  "What is your warranty for the NovaBook Pro?",
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => onOpenChat(prompt)}
                    className="text-left text-xs rounded-xl bg-slate-900/80 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/40 p-3 text-slate-300 hover:text-cyan-200 transition-all flex items-center justify-between group"
                  >
                    <span>{prompt}</span>
                    <Bot className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Educational Disclaimer Box */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
              <AlertCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                ComputeIQ Tech is an educational demonstration project.
                All contact, products, and policies are simulated for tutorial
                purposes.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
