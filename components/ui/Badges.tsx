import React from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Hourglass,
  Sparkles,
  Cpu,
  Flame,
  ShieldAlert,
  Info,
} from "lucide-react";
import { Status, Priority, AnalysisSource } from "@/lib/types";

export function StatusBadge({ status }: { status: Status }) {
  switch (status) {
    case "Submitted":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          <Clock className="w-3 h-3" aria-hidden="true" />
          <span>Submitted</span>
        </span>
      );
    case "Under Review":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Hourglass className="w-3 h-3" aria-hidden="true" />
          <span>Under Review</span>
        </span>
      );
    case "In Progress":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <AlertTriangle className="w-3 h-3" aria-hidden="true" />
          <span>In Progress</span>
        </span>
      );
    case "Resolved":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
          <span>Resolved</span>
        </span>
      );
    default:
      return null;
  }
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  switch (priority) {
    case "Critical":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 border border-red-300 dark:border-red-800 animate-pulse">
          <Flame className="w-3 h-3 text-red-600 dark:text-red-400" aria-hidden="true" />
          <span>Critical</span>
        </span>
      );
    case "High":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
          <ShieldAlert className="w-3 h-3 text-orange-600 dark:text-orange-400" aria-hidden="true" />
          <span>High</span>
        </span>
      );
    case "Medium":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <Info className="w-3 h-3 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          <span>Medium</span>
        </span>
      );
    case "Low":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <span>Low</span>
        </span>
      );
    default:
      return null;
  }
}

export function SourceBadge({ source }: { source: AnalysisSource }) {
  if (source === "ai") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
        <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" aria-hidden="true" />
        <span>AI suggestion</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
      <Cpu className="w-3 h-3 text-slate-500" aria-hidden="true" />
      <span>Demo rule-based suggestion</span>
    </span>
  );
}

