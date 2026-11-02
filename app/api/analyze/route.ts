import { NextRequest, NextResponse } from "next/server";
import { AnalyzeRequestSchema, AnalyzeResponse } from "@/lib/types";
import { runRuleBasedAnalysis } from "@/lib/rule-analyzer";
import { requestAIAnalysis } from "@/lib/ai-client";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 8192; // 8KB cap

export async function POST(req: NextRequest) {
  try {
    // 1. Per-IP Rate Limiting
    const ip = getClientIp(req);
    const rateCheck = checkRateLimit(ip, 20, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateCheck.resetInMs / 1000).toString(),
          },
        }
      );
    }

    // 2. Body size check
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Request payload exceeds maximum allowed size (8KB)." },
        { status: 413 }
      );
    }

    const rawBody = await req.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Request payload exceeds maximum allowed size (8KB)." },
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

    // 3. Zod schema validation
    const parsed = AnalyzeRequestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid input fields.",
          details: parsed.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const { title, category, location, description } = parsed.data;

    // 4. Attempt AI analysis (timeout handled inside requestAIAnalysis)
    // Note: Student Name and ID are strictly omitted
    let analysis: AnalyzeResponse | null = await requestAIAnalysis({
      title,
      category,
      location,
      description,
    });

    // 5. Silent fallback to deterministic rule-based analyzer on failure/timeout
    if (!analysis) {
      analysis = runRuleBasedAnalysis({
        title,
        category,
        location,
        description,
      });
    }

    return NextResponse.json(analysis, { status: 200 });
  } catch (err) {
    // Generic error message, never leak internal stack traces
    console.error("Unhandled error in /api/analyze:", err instanceof Error ? err.message : "Unknown");
    return NextResponse.json(
      { error: "An unexpected error occurred while analyzing the report." },
      { status: 500 }
    );
  }
}

// Method restriction: only POST allowed
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
export async function PUT() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

