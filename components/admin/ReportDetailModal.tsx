"use client";

import React, { useState } from "react";
import {
  X,
  Building,
  MapPin,
  Calendar,
  Save,
  CheckCircle2,
  Clock,
  Sparkles,
  Shield,
  History,
} from "lucide-react";
import {
  Report,
  Status,
  Priority,
  STATUSES,
  PRIORITIES,
  CATEGORIES,
} from "@/lib/types";
import { repository } from "@/lib/repository";
import { StatusBadge, PriorityBadge, SourceBadge } from "@/components/ui/Badges";

interface ReportDetailModalProps {
  report: Report;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updatedReport: Report) => void;
}

export function ReportDetailModal({
  report,
  isOpen,
  onClose,
  onUpdated,
}: ReportDetailModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<Status>(report.status);
  const [selectedPriority, setSelectedPriority] = useState<Priority>(report.priority);
  const [department, setDepartment] = useState(report.suggestedDepartment);
  const [adminNote, setAdminNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updated = repository.override(report.id, {
        status: selectedStatus,
        priority: selectedPriority,
        suggestedDepartment: department.trim(),
        adminNote: adminNote.trim() ? adminNote.trim() : undefined,
      });

      if (updated) {
        onUpdated(updated);
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          onClose();
        }, 1200);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-campus-600 dark:text-campus-400">
                {report.id}
              </span>
              <StatusBadge status={report.status} />
              <PriorityBadge priority={report.priority} />
            </div>
            <h3 id="modal-title" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {report.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="touch-target p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Report successfully updated and recorded in audit log!</span>
            </div>
          )}

          {/* Student Info & Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-slate-400">Reported By</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {report.studentName}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Location</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {report.location}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Category</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {report.category}
              </p>
            </div>
          </div>

          {/* Incident Description */}
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Student Description
            </span>
            <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/20 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              {report.description}
            </p>
          </div>

          {/* AI / Rule Analysis Details */}
          <div className="p-4 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-900/40 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-purple-900 dark:text-purple-300">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Automated Triage Recommendation</span>
              </div>
              <SourceBadge source={report.analysisSource} />
            </div>
            <p className="text-slate-700 dark:text-slate-300 italic">
              "{report.aiSummary}"
            </p>
            <p className="text-slate-500 text-[11px]">
              Recommended action: {report.suggestedAction}
            </p>
          </div>

          {/* Staff Edit Controls */}
          <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-campus-600" />
              Staff Triage & Override Controls
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status Update */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Update Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as Status)}
                  className="touch-target block w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Override */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Override Priority
                </label>
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as Priority)}
                  className="touch-target block w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {PRIORITIES.map((pr) => (
                    <option key={pr} value={pr}>
                      {pr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Department Override */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="touch-target block w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="Department name"
              />
            </div>

            {/* Staff Audit Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Audit / Action Note
              </label>
              <textarea
                rows={2}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="e.g. Dispatched electrician Marcus; replaced faulty lamp; verified operating normally."
                className="block w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="touch-target px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="touch-target inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-campus-600 hover:bg-campus-700 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes & Log</span>
              </button>
            </div>
          </form>

          {/* Audit History Log */}
          <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-500" />
              Audit Log & History
            </h4>
            <div className="space-y-2">
              {report.history.map((h, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Status: {h.status}
                    </span>
                    {h.note && (
                      <p className="text-slate-500 dark:text-slate-400 italic">
                        "{h.note}"
                      </p>
                    )}
                  </div>
                  <time className="text-[11px] text-slate-400 whitespace-nowrap">
                    {new Date(h.at).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

