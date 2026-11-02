"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  PlusCircle,
  MessageSquare,
  Search,
  Shield,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Report, CATEGORIES, PRIORITIES } from "@/lib/types";
import { repository } from "@/lib/repository";
import { StatusBadge, PriorityBadge } from "@/components/ui/Badges";

export function DashboardView() {
  const [reports, setReports] = useState<Report[]>([]);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  const loadData = () => {
    setReports(repository.list());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetData = () => {
    const refreshed = repository.reset();
    setReports(refreshed);
    setResetFeedback("Demo sample data has been reset successfully.");
    setTimeout(() => setResetFeedback(null), 3500);
  };

  // Metrics
  const total = reports.length;
  const submitted = reports.filter((r) => r.status === "Submitted").length;
  const underReview = reports.filter((r) => r.status === "Under Review").length;
  const pendingTotal = submitted + underReview;
  const inProgress = reports.filter((r) => r.status === "In Progress").length;
  const resolved = reports.filter((r) => r.status === "Resolved").length;

  // Breakdown by Category
  const categoryCounts = CATEGORIES.map((cat) => ({
    category: cat,
    count: reports.filter((r) => r.category === cat).length,
  })).sort((a, b) => b.count - a.count);

  // Breakdown by Priority
  const priorityCounts = PRIORITIES.map((pr) => ({
    priority: pr,
    count: reports.filter((r) => r.priority === pr).length,
  }));

  // Recent 5
  const recentReports = reports.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header and Reset Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Campus Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time university maintenance telemetry, SLA statuses, and incident workload metrics.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetData}
          className="touch-target inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      {resetFeedback && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{resetFeedback}</span>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Reports
            </span>
            <div className="w-8 h-8 rounded-lg bg-campus-50 dark:bg-campus-950 flex items-center justify-center text-campus-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {total}
          </div>
          <p className="text-[11px] text-slate-400">All recorded campus tickets</p>
        </div>

        {/* Pending / Under Review */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              Pending / Triage
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {pendingTotal}
          </div>
          <p className="text-[11px] text-slate-400">
            {submitted} submitted, {underReview} under review
          </p>
        </div>

        {/* In Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
              In Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {inProgress}
          </div>
          <p className="text-[11px] text-slate-400">Technician dispatched</p>
        </div>

        {/* Resolved */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
              Resolved
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {resolved}
          </div>
          <p className="text-[11px] text-slate-400">
            {total > 0 ? Math.round((resolved / total) * 100) : 0}% completion rate
          </p>
        </div>
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Incidents by Campus Category
            </h3>
            <span className="text-xs text-slate-400">Distribution</span>
          </div>

          <div className="space-y-3">
            {categoryCounts.map(({ category, count }) => {
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {category}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-campus-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown & Quick Actions */}
        <div className="space-y-6">
          {/* Priority Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Triage Priority Breakdown
              </h3>
              <span className="text-xs text-slate-400">Severity</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {priorityCounts.map(({ priority, count }) => (
                <div
                  key={priority}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center space-y-1"
                >
                  <PriorityBadge priority={priority} />
                  <div className="text-xl font-bold text-slate-900 dark:text-white pt-1">
                    {count}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {total > 0 ? Math.round((count / total) * 100) : 0}% of tickets
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Quick Shortcuts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <Link
                href="/report"
                className="touch-target p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-campus-500 hover:bg-campus-50/40 dark:hover:bg-campus-950/30 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5 font-semibold text-slate-800 dark:text-slate-200">
                  <PlusCircle className="w-4 h-4 text-campus-600" />
                  <span>Report New Incident</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-campus-600 transition-colors" />
              </Link>

              <Link
                href="/chat"
                className="touch-target p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-campus-500 hover:bg-campus-50/40 dark:hover:bg-campus-950/30 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5 font-semibold text-slate-800 dark:text-slate-200">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  <span>Ask AI Assistant</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
              </Link>

              <Link
                href="/track"
                className="touch-target p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-campus-500 hover:bg-campus-50/40 dark:hover:bg-campus-950/30 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5 font-semibold text-slate-800 dark:text-slate-200">
                  <Search className="w-4 h-4 text-blue-600" />
                  <span>Lookup Ticket by ID</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </Link>

              <Link
                href="/admin"
                className="touch-target p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-campus-500 hover:bg-campus-50/40 dark:hover:bg-campus-950/30 flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2.5 font-semibold text-slate-800 dark:text-slate-200">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Staff Triage Desk</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Campus Activity
            </h3>
            <p className="text-xs text-slate-400">
              Latest 5 incident reports logged into the system
            </p>
          </div>
          <Link
            href="/admin"
            className="text-xs text-campus-600 dark:text-campus-400 hover:underline font-semibold"
          >
            View All in Admin →
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentReports.map((r) => (
            <div
              key={r.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/track?id=${r.id}`}
                    className="font-mono text-xs font-bold text-campus-600 dark:text-campus-400 hover:underline"
                  >
                    {r.id}
                  </Link>
                  <StatusBadge status={r.status} />
                  <PriorityBadge priority={r.priority} />
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {r.title}
                </p>
                <p className="text-xs text-slate-400">
                  {r.location} • Filed by {r.studentName}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <Link
                  href={`/track?id=${r.id}`}
                  className="touch-target inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-campus-600 hover:text-white transition-colors"
                >
                  <span>Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

