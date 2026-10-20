import React from "react";
import { Cpu, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#060a12] text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 text-white">
                <Cpu className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                ComputeIQ Tech
              </span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-4">
              A modern electronics e-commerce store demo based in New York City,
              integrated with Google Gemini AI and built with Next.js App Router
              and Tailwind CSS.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-[11px] text-cyan-400">
              <Sparkles className="h-3 w-3" />
              <span>Educational YouTube Tutorial Project</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-3 text-sm">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#hero"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#products"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Products Catalog
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-cyan-400 transition-colors"
                >
                  About ComputeIQ Tech
                </a>
              </li>
              <li>
                <a
                  href="#benefits"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Store Benefits
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-cyan-400 transition-colors"
                >
                  Hours & Delivery
                </a>
              </li>
            </ul>
          </div>

          {/* Tutorial topics */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-3 text-sm">
              Tutorial Series
            </h4>
            <ul className="space-y-2">
              <li className="text-cyan-400 font-medium">
                1. Next.js + Gemini Chatbot (Current)
              </li>
              <li className="text-slate-500">2. Markdown Knowledge Base & RAG</li>
              <li className="text-slate-500">3. AI Guardrails & Validation</li>
              <li className="text-slate-500">4. Tool Security & Sandboxing</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer banner */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-slate-400 text-[11px] max-w-2xl">
            <strong className="text-slate-300">Demo Disclaimer:</strong> ComputeIQ
            Tech is a fictional brand created exclusively for educational
            demonstration. No genuine financial transactions or inventory
            fulfillments occur. All product names, prices, and warranties are
            simulated.
          </p>

          <p className="text-[11px] text-slate-400 shrink-0">
            &copy; 2026 ComputeIQ Tech Demo.
          </p>
        </div>
      </div>
    </footer>
  );
}
