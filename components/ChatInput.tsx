"use client";

import React, { useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { MAX_MESSAGE_LENGTH } from "@/lib/validation";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export function ChatInput({
  input,
  setInput,
  onSend,
  isLoading,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height up to 120px
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim().length > 0) {
        onSend();
      }
    }
  };

  const isOverLimit = input.length > MAX_MESSAGE_LENGTH;
  const isSendDisabled =
    isLoading || input.trim().length === 0 || isOverLimit;

  return (
    <div className="border-t border-slate-800 bg-[#0c1322] p-3 sm:p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isSendDisabled) onSend();
        }}
        className="flex flex-col gap-1.5"
      >
        <div className="relative flex items-end rounded-xl border border-slate-700/80 bg-slate-900/90 focus-within:border-cyan-500/80 focus-within:ring-1 focus-within:ring-cyan-500/50 transition-all p-1.5">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about products, warranty, or delivery..."
            disabled={isLoading}
            className="w-full resize-none bg-transparent px-2.5 py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none disabled:opacity-50 max-h-28 chat-scrollbar"
            aria-label="Chat message input"
          />

          <button
            type="submit"
            disabled={isSendDisabled}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Character count & shortcuts hint */}
        <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
          <span>Enter to send &bull; Shift+Enter for newline</span>
          <span
            className={
              isOverLimit
                ? "text-rose-400 font-semibold"
                : input.length > MAX_MESSAGE_LENGTH * 0.8
                ? "text-amber-400"
                : "text-slate-400"
            }
          >
            {input.length}/{MAX_MESSAGE_LENGTH}
          </span>
        </div>
      </form>
    </div>
  );
}
