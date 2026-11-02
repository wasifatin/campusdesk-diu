"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Send,
  Loader2,
  ShieldAlert,
  Info,
  Building,
  User,
  MapPin,
  FileText,
  Tag,
} from "lucide-react";
import {
  CATEGORIES,
  Category,
  CreateReportInputSchema,
  CreateReportInput,
  Report,
  AnalyzeResponse,
} from "@/lib/types";
import { repository } from "@/lib/repository";
import { ConfirmationCard } from "./ConfirmationCard";

export function ReportForm() {
  const [formData, setFormData] = useState<CreateReportInput>({
    studentName: "",
    category: "Classroom/Projector",
    location: "",
    title: "",
    description: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateReportInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedReport, setSubmittedReport] = useState<Report | null>(null);

  const validateField = (field: keyof CreateReportInput, value: string) => {
    const updated = { ...formData, [field]: value };
    const result = CreateReportInputSchema.safeParse(updated);
    if (!result.success) {
      const fieldError = result.error.issues.find((i) => i.path[0] === field);
      setErrors((prev) => ({
        ...prev,
        [field]: fieldError ? fieldError.message : undefined,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name as keyof CreateReportInput, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Full validation
    const validation = CreateReportInputSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof CreateReportInput, string>> = {};
      for (const issue of validation.error.issues) {
        const fieldName = issue.path[0] as keyof CreateReportInput;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      // Security rule: NEVER send student name or ID to the AI provider endpoint
      const analyzePayload = {
        title: formData.title,
        category: formData.category,
        location: formData.location,
        description: formData.description,
      };

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analyzePayload),
      });

      let analysisResult: AnalyzeResponse;

      if (res.ok) {
        analysisResult = await res.json();
      } else {
        // Fallback locally if network or route error
        analysisResult = {
          summary: `Report for ${formData.title} at ${formData.location}.`,
          priority: formData.category === "Campus Safety" ? "High" : "Medium",
          department: "Facilities & Campus Operations",
          nextAction: "Staff will review ticket details during operating hours.",
          source: "rule-based",
          disclaimer: "Automated suggestion. Not a verified decision. Staff will review.",
        };
      }

      // Save into storage repository
      const created = repository.create(formData, analysisResult);
      setSubmittedReport(created);
    } catch {
      setServerError("Network error communicating with triage server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedReport) {
    return (
      <ConfirmationCard
        report={submittedReport}
        onReset={() => {
          setSubmittedReport(null);
          setFormData({
            studentName: "",
            category: "Classroom/Projector",
            location: "",
            title: "",
            description: "",
          });
          setErrors({});
        }}
      />
    );
  }

  const isSafetyCategory = formData.category === "Campus Safety";

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8 max-w-2xl mx-auto">
      <div className="mb-6 space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Report a Campus Issue
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Submit facilities, technical, or cleanliness incidents for automated triage and routing.
        </p>
      </div>

      {serverError && (
        <div
          role="alert"
          className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm flex items-center gap-2"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Immediate Safety Danger Warning Banner */}
      {isSafetyCategory && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border-2 border-red-500/40 text-red-900 dark:text-red-200 space-y-1 text-sm animate-fadeIn"
        >
          <div className="flex items-center gap-2 font-bold text-red-700 dark:text-red-300">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-600" />
            <span>Emergency Advisory</span>
          </div>
          <p className="text-xs leading-relaxed font-medium">
            For immediate danger, contact campus security or local emergency services now. (Security Dispatch Ext: 555-0911)
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Student Name or ID */}
        <div>
          <label
            htmlFor="studentName"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Student Name or ID <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="studentName"
              name="studentName"
              type="text"
              required
              value={formData.studentName}
              onChange={handleChange}
              placeholder="e.g. Jordan Miller (ID: STU-8921)"
              className={`touch-target block w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                errors.studentName
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-slate-300 dark:border-slate-700 focus:border-campus-500"
              } text-slate-900 dark:text-white placeholder-slate-400 transition-colors`}
              aria-invalid={!!errors.studentName}
              aria-describedby={errors.studentName ? "studentName-error" : undefined}
            />
          </div>
          {errors.studentName && (
            <p id="studentName-error" className="mt-1 text-xs text-red-600">
              {errors.studentName}
            </p>
          )}
          <p className="mt-1 text-[11px] text-slate-400">
            Note: Your name and ID remain on your device and are never sent to AI providers.
          </p>
        </div>

        {/* Category & Location Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="touch-target block w-full pl-10 pr-8 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-campus-500 transition-colors"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Campus Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Science Block, Room 204"
                className={`touch-target block w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                  errors.location
                    ? "border-red-500"
                    : "border-slate-300 dark:border-slate-700"
                } text-slate-900 dark:text-white placeholder-slate-400 transition-colors`}
                aria-invalid={!!errors.location}
                aria-describedby={errors.location ? "location-error" : undefined}
              />
            </div>
            {errors.location && (
              <p id="location-error" className="mt-1 text-xs text-red-600">
                {errors.location}
              </p>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Incident Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <FileText className="w-4 h-4" />
            </div>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Projector lamp blown out in lecture hall"
              className={`touch-target block w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
                errors.title
                  ? "border-red-500"
                  : "border-slate-300 dark:border-slate-700"
              } text-slate-900 dark:text-white placeholder-slate-400 transition-colors`}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
          </div>
          {errors.title && (
            <p id="title-error" className="mt-1 text-xs text-red-600">
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="description"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
            >
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <span
              className={`text-xs ${
                formData.description.length > 900
                  ? "text-amber-500 font-semibold"
                  : "text-slate-400"
              }`}
            >
              {formData.description.length}/1000
            </span>
          </div>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue in detail: what happened, any visible hazard, impact on students..."
            className={`block w-full p-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border ${
              errors.description
                ? "border-red-500"
                : "border-slate-300 dark:border-slate-700"
            } text-slate-900 dark:text-white placeholder-slate-400 transition-colors`}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "description-error" : undefined}
          />
          {errors.description && (
            <p id="description-error" className="mt-1 text-xs text-red-600">
              {errors.description}
            </p>
          )}
        </div>

        {/* Submit Button with Loading State & Double Submit Guard */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="touch-target w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-campus-600 hover:bg-campus-700 disabled:bg-slate-400 text-white font-semibold text-sm transition-all shadow-md shadow-campus-600/20 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Running AI & Rule Triage Analysis...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit & Analyze Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

