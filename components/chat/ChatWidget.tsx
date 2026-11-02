"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Send,
  Loader2,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  ArrowRight,
  FilePlus,
  HelpCircle,
  Wifi,
  BookOpen,
  Bus,
  ShieldAlert,
  Phone,
} from "lucide-react";
import { ChatMessage, ChatResponse } from "@/lib/types";
import { SourceBadge } from "@/components/ui/Badges";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "bot",
    text: "Hello! I am your CampusDesk Assistant. I can help answer questions about library study hours, campus Wi-Fi access, classroom AV equipment, shuttle schedules, and campus contacts. How can I help you today?",
    source: "rule-based",
    suggestionChips: [
      "Library opening hours & study rooms",
      "How to connect to campus Wi-Fi",
      "Campus shuttle bus schedules",
      "Emergency campus contacts",
      "How to file a maintenance report",
    ],
    timestamp: new Date().toISOString(),
  },
];

export function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Build lightweight recent history
      const history = messages.slice(-4).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history }),
      });

      if (res.ok) {
        const data: ChatResponse = await res.json();
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: data.answer,
          source: data.source,
          suggestionChips: data.suggestionChips,
          showReportCta: data.showReportCta,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const botFallback: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "I encountered a problem contacting the campus assistant engine. If you have an urgent campus issue, please file an official maintenance report.",
          source: "rule-based",
          showReportCta: true,
          suggestionChips: ["Library opening hours", "Campus emergency contacts"],
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, botFallback]);
      }
    } catch {
      const botError: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "Network connection was interrupted. Please try again or submit an inquiry directly.",
        source: "rule-based",
        showReportCta: true,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botError]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col h-[700px] max-h-[85vh] overflow-hidden">
      {/* Chat Window Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-campus-600 flex items-center justify-center text-white shadow-sm shadow-campus-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"
              title="Online"
            />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>CampusDesk Assistant</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-campus-100 text-campus-800 dark:bg-campus-950 dark:text-campus-300 font-semibold">
                Hybrid AI + Rules
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Grounded exclusively on sample campus knowledge
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetChat}
          className="touch-target inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Restart Conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div
        className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 custom-scrollbar bg-slate-50/40 dark:bg-slate-950/30"
        aria-live="polite"
        aria-atomic="false"
      >
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isUser ? "flex-row-reverse" : "flex-row"
              } animate-fadeIn`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isUser
                    ? "bg-slate-800 text-white"
                    : "bg-campus-600 text-white shadow-sm"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble Content */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] space-y-2 ${
                  isUser ? "items-end text-right" : "items-start text-left"
                }`}
              >
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    isUser
                      ? "bg-campus-600 text-white rounded-tr-none shadow-sm"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm"
                  }`}
                >
                  {/* Safe plain text rendering (no innerHTML) */}
                  {msg.text}

                  {/* Fallback CTA if bot couldn't find answer */}
                  {!isUser && msg.showReportCta && (
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Need official resolution or maintenance action?
                      </p>
                      <Link
                        href="/report"
                        className="touch-target inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-campus-600 hover:bg-campus-700 text-white text-xs font-semibold transition-colors"
                      >
                        <FilePlus className="w-3.5 h-3.5" />
                        <span>File an Issue Report</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Badges & Meta */}
                <div
                  className={`flex items-center gap-2 text-[10px] text-slate-400 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && msg.source && <SourceBadge source={msg.source} />}
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Suggestion Chips */}
                {!isUser && msg.suggestionChips && msg.suggestionChips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestionChips.map((chip, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(chip)}
                        className="touch-target px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-campus-500 hover:bg-campus-50 dark:hover:bg-campus-950 text-slate-700 dark:text-slate-300 hover:text-campus-700 dark:hover:text-campus-300 transition-colors shadow-2xs"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-campus-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-campus-500 animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 rounded-full bg-campus-500 animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full bg-campus-500 animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box & Submission */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask about library hours, Wi-Fi, classroom AV, shuttles..."
            className="touch-target flex-1 px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:border-campus-500 transition-colors"
            aria-label="Message CampusDesk Assistant"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="touch-target px-4 py-3 rounded-xl bg-campus-600 hover:bg-campus-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-semibold text-sm transition-colors shrink-0 shadow-sm flex items-center justify-center"
            aria-label="Send Message"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          CampusDesk answers questions grounded in sample university records. Automated suggestion; not verified by human staff.
        </p>
      </div>
    </div>
  );
}

