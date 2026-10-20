import React from "react";
import { Cpu, Award, Users, Lightbulb } from "lucide-react";

export function AboutSection() {
  const highlights = [
    {
      icon: Cpu,
      title: "Engineered for Innovation",
      desc: "Curated premium electronics tailored for modern professionals, creators, and students in the USA and worldwide.",
    },
    {
      icon: Award,
      title: "Guaranteed Authenticity",
      desc: "Every ComputeIQ Tech product comes with comprehensive official warranty support and dedicated care.",
    },
    {
      icon: Users,
      title: "Customer-First Philosophy",
      desc: "Transparent pricing with direct Gemini AI and local New York specialist customer assistance.",
    },
    {
      icon: Lightbulb,
      title: "Pioneering AI Support",
      desc: "Instant, conversational product guidance powered by Google's Gemini models.",
    },
  ];

  return (
    <section
      id="about"
      className="py-20 md:py-28 border-t border-slate-800/80 bg-[#090e1a] relative"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-300 mb-4">
              <span>About ComputeIQ Tech</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Bridging Cutting-Edge Hardware With Intelligent Support
            </h2>
            <p className="mt-6 text-base text-slate-300 leading-relaxed">
              Based in New York City, USA, ComputeIQ Tech is a modern technology
              destination and educational demonstration platform created to
              showcase modern web engineering and state-of-the-art
              conversational AI integrations.
            </p>
            <p className="mt-4 text-base text-slate-400 leading-relaxed">
              We believe shopping for high-end technology should be intuitive,
              transparent, and informative. From lightweight productivity
              laptops to ergonomic true wireless audio, our catalog is paired
              with real-time Gemini AI assistance to guide your tech decisions.
            </p>
          </div>

          {/* Right Column: 4 Highlight Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-[#101728] p-6 transition-all hover:border-cyan-500/30 hover:bg-[#131c31]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-800/50 text-cyan-400 mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
