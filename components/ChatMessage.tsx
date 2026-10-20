import React from "react";
import { Bot, User, AlertCircle, RotateCcw } from "lucide-react";

export interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isError?: boolean;
}

interface ChatMessageProps {
  message: MessageItem;
  onRetry?: () => void;
}

export function ChatMessage({ message, onRetry }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 text-sm animate-in fade-in-50 duration-200 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isUser
            ? "bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-sm"
            : "bg-[#162238] border border-cyan-500/30 text-cyan-300 shadow-sm"
        }`}
        aria-hidden="true"
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Bubble & Timestamp */}
      <div
        className={`flex max-w-[82%] flex-col ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-2.5 leading-relaxed shadow-sm break-words whitespace-pre-wrap ${
            isUser
              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-xs"
              : message.isError
              ? "bg-rose-950/40 border border-rose-800/60 text-rose-200 rounded-tl-xs"
              : "bg-[#131d33] border border-slate-800 text-slate-100 rounded-tl-xs"
          }`}
        >
          {message.isError && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-1">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Response Error</span>
            </div>
          )}

          {message.content}

          {message.isError && onRetry && (
            <div className="mt-2.5 pt-2 border-t border-rose-900/60 flex items-center justify-end">
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-900/50 hover:bg-rose-800/80 px-2.5 py-1 text-xs font-medium text-rose-100 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Retry</span>
              </button>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-slate-400 mt-1 px-1">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
