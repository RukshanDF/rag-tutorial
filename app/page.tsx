"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductSection } from "@/components/ProductSection";
import { AboutSection } from "@/components/AboutSection";
import { BenefitsSection } from "@/components/BenefitsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>(
    undefined
  );

  const handleOpenChat = (prompt?: string) => {
    if (prompt) {
      setInitialPrompt(prompt);
    }
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleClearInitialPrompt = () => {
    setInitialPrompt(undefined);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#070b14] text-slate-100">
      {/* Navigation Bar */}
      <Header onOpenChat={handleOpenChat} />

      {/* Main Storefront Sections */}
      <main className="flex-1">
        <Hero onOpenChat={handleOpenChat} />
        <ProductSection onOpenChat={handleOpenChat} />
        <AboutSection />
        <BenefitsSection />
        <ContactSection onOpenChat={handleOpenChat} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating AI Chat Assistant Widget */}
      <ChatWidget
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={handleCloseChat}
        initialPrompt={initialPrompt}
        onClearInitialPrompt={handleClearInitialPrompt}
      />
    </div>
  );
}
