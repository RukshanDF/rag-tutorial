"use client";

import React, { useState } from "react";
import { products, Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { Sparkles } from "lucide-react";

interface ProductSectionProps {
  onOpenChat: (initialPrompt?: string) => void;
}

export function ProductSection({ onOpenChat }: ProductSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Laptops", "Audio", "Accessories"];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAskAI = (product: Product) => {
    const question = `Tell me more about the ${product.name}. What are its key features, price in LKR, and warranty terms?`;
    onOpenChat(question);
  };

  return (
    <section id="products" className="py-20 md:py-28 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Engineered For Performance</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Featured Electronics
            </h2>
            <p className="mt-2 text-base text-slate-400 max-w-xl">
              Explore our current lineup of flagship devices. Inquire directly
              with our AI assistant for real-time specifications and warranty
              guidance.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/25"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid: 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAskAI={handleAskAI}
            />
          ))}
        </div>

        {/* Catalog Banner / Footer notice */}
        <div className="mt-12 rounded-2xl border border-slate-800 bg-[#0c1322] p-6 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">
              Looking for tailored advice or custom recommendations?
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              Ask our AI assistant to compare models, calculate delivery costs,
              or explain return policies.
            </p>
          </div>
          <button
            onClick={() =>
              onOpenChat(
                "Can you compare the NovaBook Air and NovaBook Pro for me?"
              )
            }
            className="shrink-0 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Compare Models with AI
          </button>
        </div>
      </div>
    </section>
  );
}
