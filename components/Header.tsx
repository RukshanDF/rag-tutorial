"use client";

import React, { useState } from "react";
import { Cpu, Bot, Menu, X, Sparkles } from "lucide-react";

interface HeaderProps {
  onOpenChat: (initialPrompt?: string) => void;
}

export function Header({ onOpenChat }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "Products", href: "#products" },
    { name: "About", href: "#about" },
    { name: "Benefits", href: "#benefits" },
    { name: "Contact", href: "#contact" },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b14]/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        {/* Logo */}
        <a
          href="#hero"
          className="group flex items-center gap-3 transition-transform hover:scale-[1.01]"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white">
            <Cpu className="h-6 w-6 transition-transform group-hover:rotate-12" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              ComputeIQ
              <span className="text-cyan-400 font-extrabold text-sm uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50">
                Tech
              </span>
            </span>
            <span className="text-[11px] text-slate-400 tracking-wider">
              New York, NY, USA
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-8"
        >
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.href)}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-cyan-400"
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => onOpenChat()}
            className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-500/20 transition-all hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98]"
            aria-label="Open AI Assistant"
          >
            <Sparkles className="h-4 w-4 text-cyan-200 animate-pulse" />
            <span>AI Assistant</span>
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => onOpenChat()}
            className="flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 text-xs font-medium text-cyan-300"
            aria-label="AI Assistant"
          >
            <Bot className="h-4 w-4" />
            <span>AI</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0b1120]/95 px-4 pt-3 pb-6 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="rounded-lg px-4 py-2.5 text-left text-sm font-medium text-slate-200 hover:bg-slate-800/80 hover:text-cyan-400 transition-colors"
              >
                {link.name}
              </button>
            ))}
            <div className="pt-3 mt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenChat();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-cyan-500/20"
              >
                <Sparkles className="h-4 w-4 text-cyan-200" />
                <span>Launch ComputeIQ AI Assistant</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
