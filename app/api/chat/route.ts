import { NextRequest, NextResponse } from "next/server";
import { ChatRequestSchema, ChatResponse } from "@/lib/types";
import { FAQ_DATABASE, FAQItem } from "@/lib/knowledge";
import { requestAIChat } from "@/lib/ai-client";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 8192; // 8KB cap

/**
 * Score FAQ items against normalized query keywords
 */
function findBestFAQMatch(query: string): FAQItem | null {
  const normalized = query.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  const queryTokens = normalized.split(/\s+/).filter((t) => t.length > 2);

  if (queryTokens.length === 0) return null;

  let bestScore = 0;
  let bestMatch: FAQItem | null = null;

  for (const item of FAQ_DATABASE) {
    let score = 0;

    // Check keyword hits
    for (const kw of item.keywords) {
      if (normalized.includes(kw)) {
        score += 2;
      } else {
        const kwParts = kw.split(" ");
        if (kwParts.some((p) => queryTokens.includes(p))) {
          score += 1;
        }
      }
    }

    // Boost if title matches
    const questionTokens = item.question
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 3);
    for (const token of queryTokens) {
      if (questionTokens.includes(token)) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  // Threshold: at least 2 points to qualify as confident match
  return bestScore >= 2 ? bestMatch : null;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Per-IP Rate Limiting
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(ip, 30, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many chat messages. Please slow down and try again." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateCheck.resetInMs / 1000).toString(),
          },
        }
      );
    }

    // 2. Body cap
    const rawBody = await req.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Message exceeds maximum size." },
        { status: 413 }
      );
    }

    let json: unknown;
    try {
      json = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON format." },
        { status: 400 }
      );
    }

    // 3. Zod validation
    const parsed = ChatRequestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid chat request format." },
        { status: 400 }
      );
    }

    const { message, history } = parsed.data;

    // 4. Try deterministic Rule-Based FAQ engine first
    const faqMatch = findBestFAQMatch(message);
    if (faqMatch) {
      const response: ChatResponse = {
        answer: faqMatch.answer,
        source: "rule-based",
        suggestionChips: faqMatch.suggestionChips || [
          "Report an issue",
          "Library hours",
          "Wi-Fi troubleshooting",
        ],
        showReportCta: false,
      };
      return NextResponse.json(response, { status: 200 });
    }

    // 5. Try AI fallback grounded strictly on sample knowledge base
    const aiAnswer = await requestAIChat({ message, history });
    if (aiAnswer) {
      const isUnknown =
        aiAnswer.toLowerCase().includes("don't have that information") ||
        aiAnswer.toLowerCase().includes("not mentioned in") ||
        aiAnswer.toLowerCase().includes("i don't know");

      const response: ChatResponse = {
        answer: aiAnswer,
        source: "ai",
        suggestionChips: [
          "How do I report an issue?",
          "Campus safety contacts",
          "Library schedule",
        ],
        showReportCta: isUnknown,
      };
      return NextResponse.json(response, { status: 200 });
    }

    // 6. Graceful rule-based fallback if AI is unavailable or no match
    const fallbackResponse: ChatResponse = {
      answer:
        "I could not locate an exact match for your question in the sample campus knowledge base. If this is related to a facility problem or maintenance request, you can submit an official report or contact campus services directly.",
      source: "rule-based",
      suggestionChips: [
        "Library hours & study rooms",
        "Wi-Fi connection guide",
        "Campus emergency contacts",
        "Shuttle bus timings",
      ],
      showReportCta: true,
    };
    return NextResponse.json(fallbackResponse, { status: 200 });
  } catch (err) {
    console.error("Unhandled error in /api/chat:", err instanceof Error ? err.message : "Unknown");
    return NextResponse.json(
      { error: "Chat service encountered an unexpected error." },
      { status: 500 }
    );
  }
}

// Method restriction: only POST allowed
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

