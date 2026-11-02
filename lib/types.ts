import { z } from "zod";

export const CATEGORIES = [
  "Classroom/Projector",
  "Wi-Fi/Internet",
  "Washroom/Cleanliness",
  "Fan/AC",
  "Electricity",
  "Transportation",
  "Campus Safety",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const STATUSES = [
  "Submitted",
  "Under Review",
  "In Progress",
  "Resolved",
] as const;
export type Status = (typeof STATUSES)[number];

export const ANALYSIS_SOURCES = ["ai", "rule-based"] as const;
export type AnalysisSource = (typeof ANALYSIS_SOURCES)[number];

export const HistoryItemSchema = z.object({
  status: z.enum(STATUSES),
  at: z.string(), // ISO date string
  note: z.string().optional(),
});
export type HistoryItem = z.infer<typeof HistoryItemSchema>;

export const ReportSchema = z.object({
  id: z.string().regex(/^CAM-\d{8}-[A-Z0-9]{4}$/),
  studentName: z.string().min(2).max(60),
  category: z.enum(CATEGORIES),
  location: z.string().min(2).max(80),
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(1000),
  aiSummary: z.string(),
  priority: z.enum(PRIORITIES),
  suggestedDepartment: z.string(),
  suggestedAction: z.string(),
  analysisSource: z.enum(ANALYSIS_SOURCES),
  status: z.enum(STATUSES),
  createdAt: z.string(),
  updatedAt: z.string(),
  history: z.array(HistoryItemSchema),
});
export type Report = z.infer<typeof ReportSchema>;

// Input schema for new issue submissions
export const CreateReportInputSchema = z.object({
  studentName: z
    .string()
    .trim()
    .min(2, "Student name must be at least 2 characters")
    .max(60, "Student name cannot exceed 60 characters"),
  category: z.enum(CATEGORIES),
  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters (e.g. Science Block, Room 302)")
    .max(80, "Location cannot exceed 80 characters"),
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
});
export type CreateReportInput = z.infer<typeof CreateReportInputSchema>;

// Schema for /api/analyze input (never contains student name/ID)
export const AnalyzeRequestSchema = z.object({
  title: z.string().trim().min(2).max(120),
  category: z.enum(CATEGORIES),
  location: z.string().trim().min(2).max(100),
  description: z.string().trim().min(5).max(1200),
});
export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

// Strict JSON schema for /api/analyze output
export const AnalyzeResponseSchema = z.object({
  summary: z.string().min(1),
  priority: z.enum(PRIORITIES),
  department: z.string().min(1),
  nextAction: z.string().min(1),
  source: z.enum(ANALYSIS_SOURCES),
  disclaimer: z.string().min(1),
});
export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;

// Chatbot types
export const ChatMessageSchema = z.object({
  id: z.string(),
  sender: z.enum(["user", "bot"]),
  text: z.string(),
  source: z.enum(["rule-based", "ai"]).optional(),
  suggestionChips: z.array(z.string()).optional(),
  showReportCta: z.boolean().optional(),
  timestamp: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatRequestSchema = z.object({
  message: z.string().trim().min(1).max(500),
  history: z
    .array(
      z.object({
        sender: z.enum(["user", "bot"]),
        text: z.string().max(1000),
      })
    )
    .max(10)
    .optional(),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const ChatResponseSchema = z.object({
  answer: z.string(),
  source: z.enum(["rule-based", "ai"]),
  suggestionChips: z.array(z.string()).optional(),
  showReportCta: z.boolean().optional(),
});
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
