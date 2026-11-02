import React from "react";
import { CheckCircle2, Clock, Hourglass, Wrench } from "lucide-react";
import { Report, Status } from "@/lib/types";

interface StatusTimelineProps {
  report: Report;
}

const ORDERED_STATUSES: { status: Status; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { status: "Submitted", label: "Report Submitted", icon: Clock },
  { status: "Under Review", label: "Under Review", icon: Hourglass },
  { status: "In Progress", label: "In Progress", icon: Wrench },
  { status: "Resolved", label: "Resolved", icon: CheckCircle2 },
];

export function StatusTimeline({ report }: StatusTimelineProps) {
  const currentStatusIndex = ORDERED_STATUSES.findIndex(
    (s) => s.status === report.status
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <ol className="relative border-l border-slate-200 dark:border-slate-800 ml-4 space-y-8">
          {ORDERED_STATUSES.map((item, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;
            const Icon = item.icon;

            // Find matching history logs for this stage
            const matchingLogs = report.history.filter((h) => h.status === item.status);
            const latestLog = matchingLogs[matchingLogs.length - 1];

            return (
              <li key={item.status} className="mb-6 ml-6">
                <span
                  className={`absolute -left-3.5 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ring-4 ring-white dark:ring-slate-900 ${
                    isCurrent
                      ? "bg-campus-600 text-white shadow-md shadow-campus-600/30 scale-110"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </span>

                <div
                  className={`p-4 rounded-xl border transition-colors ${
                    isCurrent
                      ? "bg-campus-50/50 dark:bg-campus-950/30 border-campus-300 dark:border-campus-800"
                      : isCompleted
                      ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      : "bg-slate-50/40 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800/60 opacity-60"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4
                      className={`text-sm font-bold ${
                        isCurrent
                          ? "text-campus-900 dark:text-campus-300"
                          : isCompleted
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {item.label}
                    </h4>

                    {latestLog && (
                      <time className="text-xs text-slate-400">
                        {new Date(latestLog.at).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    )}
                  </div>

                  {latestLog?.note && (
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                      {latestLog.note}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

