"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bot,
  X,
  Minus,
  Sparkles,
  Maximize2,
  Trash2,
  Loader2,
} from "lucide-react";
import { ChatMessage, MessageItem } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

const SUGGESTED_QUESTIONS = [
  "What laptops do you have?",
  "How much does NovaBook Air cost?",
  "What is your delivery policy?",
  "What are your warranty periods?",
];

function getFormattedTime(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const INITIAL_WELCOME_MESSAGE: MessageItem = {
  id: "welcome-msg",
  role: "assistant",
  content:
    "Hello! I am your ComputeIQ AI Assistant. How can I help you today? You can ask about our laptops, wireless earbuds, chargers, New York store hours, warranties, or delivery rates.",
  timestamp: "Just now",
};

export function ChatWidget({
  isOpen,
  onClose,
  onOpen,
  initialPrompt,
  onClearInitialPrompt,
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<MessageItem[]>([
    INITIAL_WELCOME_MESSAGE,
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [lastFailedUserMessage, setLastFailedUserMessage] = useState<string | null>(
    null
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change or loading state toggles
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen, isMinimized, scrollToBottom]);

  // Handle incoming initial prompt from external CTA buttons
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      onOpen();
      setIsMinimized(false);
      setInput(initialPrompt);
      if (onClearInitialPrompt) {
        onClearInitialPrompt();
      }
    }
  }, [initialPrompt, onOpen, onClearInitialPrompt]);

  // Core send message handler
  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend !== undefined ? textToSend : input).trim();
    if (!messageContent || isLoading) return;

    // Reset input
    setInput("");
    setLastFailedUserMessage(null);

    // Create user message item
    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageContent,
      timestamp: getFormattedTime(),
    };

    // Prepare history payload for API (excluding welcome message and error messages)
    const validHistory = messages
      .filter((m) => m.id !== "welcome-msg" && !m.isError)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    // Update UI immediately
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageContent,
          history: validHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to receive a response from AI.");
      }

      const assistantMsg: MessageItem = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: getFormattedTime(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errorText =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while communicating with ComputeIQ AI.";

      setLastFailedUserMessage(messageContent);

      const errorMsg: MessageItem = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: errorText,
        timestamp: getFormattedTime(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedUserMessage) {
      // Remove the last error message from list before retrying
      setMessages((prev) => prev.filter((m) => !m.isError));
      handleSendMessage(lastFailedUserMessage);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        ...INITIAL_WELCOME_MESSAGE,
        timestamp: getFormattedTime(),
      },
    ]);
    setLastFailedUserMessage(null);
  };

  return (
    <>
      {/* 1. Closed State: Floating Action Button */}
      {!isOpen && (
        <aside aria-label="AI Assistant Quick Access">
          <button
            onClick={onOpen}
            className="group fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 p-4 text-white shadow-xl shadow-cyan-500/30 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-950"
            aria-label="Open ComputeIQ AI Assistant"
          >
            <div className="relative">
              <Bot className="h-6 w-6 transition-transform group-hover:rotate-6" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
            </div>
            <span className="hidden sm:inline-block font-semibold text-sm pr-1">
              Ask AI Assistant
            </span>
          </button>
        </aside>
      )}

      {/* 2. Open State: Chat Panel */}
      {isOpen && (
        <section
          aria-label="ComputeIQ AI Assistant Chat Window"
          className={`fixed z-50 transition-all duration-300 ease-in-out ${
            isMinimized
              ? "bottom-6 right-6 h-14 w-80 sm:w-96"
              : "bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[420px] h-[92vh] sm:h-[620px] max-h-[800px]"
          } flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl border border-slate-700/80 bg-[#0a101d] shadow-2xl shadow-cyan-950/60 backdrop-blur-xl`}
        >
          {/* Header */}
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-[#0e1628] px-4">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-sm">
                <Bot className="h-4 w-4" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#0e1628]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white leading-none">
                    ComputeIQ AI Assistant
                  </h3>
                  <span className="text-[10px] text-cyan-400 font-mono px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-800/40">
                    Gemini
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online &bull; New York Store
                </span>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              {messages.length > 1 && !isMinimized && (
                <button
                  onClick={handleClearHistory}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                  title="Clear conversation"
                  aria-label="Clear conversation history"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
                title={isMinimized ? "Maximize" : "Minimize"}
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minus className="h-4 w-4" />
                )}
              </button>

              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                title="Close"
                aria-label="Close AI Assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body: Visible only when not minimized */}
          {!isMinimized && (
            <>
              {/* Message History List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar bg-[#090e1a]/95">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    onRetry={handleRetry}
                  />
                ))}

                {/* Loading typing indicator */}
                {isLoading && (
                  <div className="flex gap-3 text-sm animate-in fade-in-50 duration-200">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#162238] border border-cyan-500/30 text-cyan-300">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-[#131d33] border border-slate-800 px-4 py-3 text-slate-300 rounded-tl-xs">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                      <span className="text-xs text-slate-400">
                        ComputeIQ AI is thinking...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions Chips (shown if conversation is short) */}
              {messages.length <= 2 && (
                <div className="border-t border-slate-800/80 bg-[#0c1424] px-4 py-2.5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-cyan-400" />
                    <span>Suggested Questions</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_QUESTIONS.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(question)}
                        disabled={isLoading}
                        className="rounded-lg border border-slate-700/80 bg-slate-900/90 hover:bg-cyan-950/40 hover:border-cyan-500/50 hover:text-cyan-200 px-2.5 py-1 text-xs text-slate-300 transition-all text-left disabled:opacity-50"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input Bar */}
              <ChatInput
                input={input}
                setInput={setInput}
                onSend={() => handleSendMessage()}
                isLoading={isLoading}
              />
            </>
          )}
        </section>
      )}
    </>
  );
}
