"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, Check, ArrowRight, FilePlus, Sparkles, Building2, BellRing } from "lucide-react";
import { Report } from "@/lib/types";
import { PriorityBadge, SourceBadge } from "@/components/ui/Badges";

interface ConfirmationCardProps {
  report: Report;
  onReset: () => void;
}

export function ConfirmationCard({ report, onReset }: ConfirmationCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(report.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/80 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Report Submitted Successfully
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Your incident has been logged into the campus dispatch system.
        </p>
      </div>

      {/* Tracking ID Box */}
      <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
            Unique Tracking Reference
          </span>
          <div className="font-mono text-lg sm:text-xl font-bold text-campus-600 dark:text-campus-400">
            {report.id}
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="touch-target inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
          aria-label="Copy tracking ID"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Copied to Clipboard</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-500" />
              <span>Copy Tracking ID</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Details Box */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Classification:</span>
            <PriorityBadge priority={report.priority} />
          </div>
          <SourceBadge source={report.analysisSource} />
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Assigned Department
            </div>
            <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              {report.suggestedDepartment}
            </p>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BellRing className="w-3.5 h-3.5 text-slate-400" />
              Automated Next Action
            </div>
            <p className="text-slate-700 dark:text-slate-300 mt-0.5">
              {report.suggestedAction}
            </p>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              Triage Summary
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-xs italic mt-0.5">
              "{report.aiSummary}"
            </p>
          </div>
        </div>

        {/* Mandatory Disclaimer */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-normal flex items-start gap-1.5">
          <span className="font-semibold">Disclaimer:</span>
          <span>Automated suggestion. Not a verified decision. Staff will review.</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <Link
          href={`/track?id=${report.id}`}
          className="touch-target w-full sm:w-1/2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-campus-600 hover:bg-campus-700 text-white font-semibold text-sm transition-colors shadow-sm"
        >
          <span>Track Live Progress</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="touch-target w-full sm:w-1/2 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-colors"
        >
          <FilePlus className="w-4 h-4" />
          <span>File Another Report</span>
        </button>
      </div>
    </div>
  );
}

