"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { FAQ_DATABASE } from "@/lib/knowledge";

interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  chips?: string[];
  showReportCta?: boolean;
}

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Hello! I am your CampusDesk Assistant. How can I assist you with university life today? Ask about library study hours, campus Wi-Fi, classroom AV remotes, shuttle schedules, or campus contacts.",
      chips: [
        "Library opening hours & study rooms",
        "How to connect to campus Wi-Fi",
        "Shuttle bus schedule",
        "Emergency campus contacts",
      ],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (messageText?: string) => {
    const text = (messageText || input).trim();
    if (!text) return;

    setInput("");
    const newMessages: ChatMessage[] = [...messages, { sender: "user", text }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.answer,
            chips: data.suggestionChips || [],
            showReportCta: data.showReportCta,
          },
        ]);
        setIsTyping(false);
        return;
      }
    } catch {
      // Fall through to local fallback
    }

    // Local deterministic fallback
    setTimeout(() => {
      const q = text.toLowerCase();
      const found = FAQ_DATABASE.find((item) =>
        item.keywords.some((k) => q.includes(k))
      );

      if (found) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: found.answer,
            chips: found.suggestionChips || [
              "Library hours",
              "Wi-Fi guide",
              "Shuttle schedule",
            ],
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "I couldn't locate an exact match for that question in the campus knowledge guide. If this is related to a facility maintenance problem, you can submit an official report.",
            chips: [
              "Library opening hours & study rooms",
              "Wi-Fi connection guide",
              "Emergency campus contacts",
            ],
            showReportCta: true,
          },
        ]);
      }
      setIsTyping(false);
    }, 300);
  };

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 800 }}>CampusDesk Conversational AI</h2>
        <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginTop: "2px" }}>
          Grounded campus assistance for library hours, Wi-Fi onboarding, shuttle bus timings, and campus safety.
        </p>
      </div>

      <div className="campus-chat-box">
        <div className="chat-scroll-area" ref={scrollRef}>
          {messages.map((m, idx) => (
            <div key={idx} className={`chat-msg-row ${m.sender}`}>
              <div className="chat-user-avatar">
                {m.sender === "user" ? "YOU" : "AI"}
              </div>
              <div>
                <div className="chat-speech-bubble">{m.text}</div>

                {m.showReportCta && (
                  <div style={{ marginTop: "10px" }}>
                    <Link
                      href="/report"
                      className="btn-action btn-primary-glow"
                      style={{ display: "inline-block", fontSize: "12px", padding: "6px 14px" }}
                    >
                      File an Issue Report &rarr;
                    </Link>
                  </div>
                )}

                {m.chips && m.chips.length > 0 && (
                  <div className="chat-suggestion-chips">
                    {m.chips.map((chip, cIdx) => (
                      <button
                        key={cIdx}
                        type="button"
                        className="chip-item"
                        onClick={() => handleSend(chip)}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="chat-msg-row bot">
              <div className="chat-user-avatar">AI</div>
              <div className="chat-speech-bubble" style={{ color: "var(--text-dim)" }}>
                Thinking...
              </div>
            </div>
          )}
        </div>

        <form
          className="chat-composer-bar"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Ask a question (e.g. When does the library close? How to get classroom projector remote?)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn-action btn-primary-glow">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
