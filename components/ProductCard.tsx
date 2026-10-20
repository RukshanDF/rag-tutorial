"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/products";
import { Bot, Shield, Tag } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAskAI: (product: Product) => void;
}

export function ProductCard({ product, onAskAI }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-[#101728] transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/40 hover:-translate-y-1">
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        {!imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImageError(true)}
          />
        ) : (
          /* Polished CSS-based fallback if image fails to load */
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 text-center">
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-950/70 border border-cyan-800/40 text-cyan-400 mb-2">
                <Tag className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold text-slate-200 block">
                {product.name}
              </span>
              <span className="text-xs text-slate-400">{product.category}</span>
            </div>
          </div>
        )}

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center rounded-md bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-md border border-cyan-500/20">
            {product.category}
          </span>
        </div>

        {/* Warranty Tag */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-950/80 px-2.5 py-1 text-xs font-medium text-slate-300 backdrop-blur-md border border-slate-800">
            <Shield className="h-3 w-3 text-cyan-400" />
            <span>{product.warranty}</span>
          </span>
        </div>
      </div>

      {/* Card Details */}
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
              {product.name}
            </h3>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            {product.description}
          </p>
        </div>

        <div>
          {/* Price & Warranty Row */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-5">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                Price
              </span>
              <span className="text-2xl font-black text-cyan-400 tracking-tight">
                {product.priceFormatted}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                Warranty
              </span>
              <span className="text-xs font-semibold text-slate-200">
                {product.warranty} official
              </span>
            </div>
          </div>

          {/* Action Button: "Ask AI About This Product" */}
          <button
            onClick={() => onAskAI(product)}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-950/30 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:border-transparent px-4 py-3 text-sm font-semibold text-cyan-300 hover:text-white transition-all shadow-sm active:scale-[0.98]"
            aria-label={`Ask AI about ${product.name}`}
          >
            <Bot className="h-4 w-4" />
            <span>Ask AI About This Product</span>
          </button>
        </div>
      </div>
    </article>
  );
}
