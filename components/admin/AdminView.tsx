"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  RotateCcw,
  Sparkles,
  Building,
  MapPin,
  Calendar,
  AlertCircle,
  Shield,
  Layers,
  ArrowUpDown,
  CheckCircle2,
} from "lucide-react";
import {
  Report,
  Status,
  Priority,
  Category,
  STATUSES,
  PRIORITIES,
  CATEGORIES,
} from "@/lib/types";
import { repository } from "@/lib/repository";
import { StatusBadge, PriorityBadge, SourceBadge } from "@/components/ui/Badges";
import { ReportDetailModal } from "./ReportDetailModal";
import { useRole } from "@/components/context/RoleContext";

export function AdminView() {
  const { role, setRole, isAdmin } = useRole();
  const [reports, setReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const loadReports = () => {
    setReports(repository.list());
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleReset = () => {
    const refreshed = repository.reset();
    setReports(refreshed);
    setResetMessage("Demo reports reset to fresh initial seed.");
    setTimeout(() => setResetMessage(null), 3000);
  };

  const handleReportUpdated = (updated: Report) => {
    setReports((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
    setSelectedReport(updated);
  };

  // Filtering
  const filteredReports = reports.filter((r) => {
    // Search match: ID, title, location, description, studentName
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      const match =
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.studentName.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (categoryFilter !== "ALL" && r.category !== categoryFilter) return false;
    if (priorityFilter !== "ALL" && r.priority !== priorityFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Admin Demo Role Notice */}
      {!isAdmin && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2 font-medium">
            <Shield className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              You are currently viewing this page in <strong>Student Demo Persona</strong>. You can switch to Admin Persona for full simulation.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className="touch-target px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors shrink-0"
          >
            Switch to Admin Persona
          </button>
        </div>
      )}

      {/* Header controls & Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-campus-600" />
            <span>Staff Triage Desk</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, update workflow status, and override automated AI/rule-based assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="touch-target inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Demo Seed Data</span>
        </button>
      </div>

      {resetMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, keyword, student, location, or issue description..."
            className="touch-target block w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:border-campus-500 transition-colors"
          />
        </div>

        {/* Filter Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="touch-target block w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
            >
              <option value="ALL">All Statuses ({reports.length})</option>
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Category Filter
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="touch-target block w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
            >
              <option value="ALL">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Priority Filter
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="touch-target block w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white"
            >
              <option value="ALL">All Priorities</option>
              {PRIORITIES.map((pr) => (
                <option key={pr} value={pr}>
                  {pr}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong>{filteredReports.length}</strong> of {reports.length} reports
          </span>
          {(searchQuery || statusFilter !== "ALL" || categoryFilter !== "ALL" || priorityFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
                setCategoryFilter("ALL");
                setPriorityFilter("ALL");
              }}
              className="text-campus-600 dark:text-campus-400 hover:underline font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Ticket Reference</th>
              <th className="py-3.5 px-4">Student & Location</th>
              <th className="py-3.5 px-4">Issue Details</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  No matching campus reports found. Try adjusting filters.
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-xs text-campus-600 dark:text-campus-400 whitespace-nowrap">
                    {report.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200 text-xs">
                      {report.studentName}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      <span>{report.location}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                      {report.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {report.category}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <PriorityBadge priority={report.priority} />
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300 max-w-[160px] truncate">
                    {report.suggestedDepartment}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedReport(report);
                        setIsModalOpen(true);
                      }}
                      className="touch-target inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-campus-600 hover:text-white dark:hover:bg-campus-600 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Triage</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-3">
        {filteredReports.length === 0 ? (
          <div className="p-8 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No matching reports found.
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-campus-600 dark:text-campus-400">
                  {report.id}
                </span>
                <StatusBadge status={report.status} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                  {report.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{report.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <PriorityBadge priority={report.priority} />
                <span className="text-slate-500 font-medium truncate max-w-[180px]">
                  {report.suggestedDepartment}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedReport(report);
                  setIsModalOpen(true);
                }}
                className="touch-target w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-campus-600 hover:text-white text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View & Override Details</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedReport(null);
          }}
          onUpdated={handleReportUpdated}
        />
      )}
    </div>
  );
}

