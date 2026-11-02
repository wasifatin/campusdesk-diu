"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { reportRepo, generateReportId } from "@/lib/repository";
import { Category, Priority, Report } from "@/lib/types";

const CATEGORIES: Category[] = [
  "Classroom/Projector",
  "Wi-Fi/Internet",
  "Washroom/Cleanliness",
  "Fan/AC",
  "Electricity",
  "Transportation",
  "Campus Safety",
  "Other",
];

const DEPT_MAP: Record<Category, string> = {
  "Classroom/Projector": "Academic AV & Media Services",
  "Wi-Fi/Internet": "Campus IT & Network Infrastructure",
  "Washroom/Cleanliness": "Facilities & Janitorial Services",
  "Fan/AC": "HVAC & Mechanical Maintenance",
  "Electricity": "Electrical Maintenance Division",
  "Transportation": "Campus Fleet & Logistics",
  "Campus Safety": "Campus Safety & Security Office",
  Other: "General Operations Help Desk",
};

export default function ReportPage() {
  const router = useRouter();

  const [studentName, setStudentName] = useState("");
  const [category, setCategory] = useState<Category>("Classroom/Projector");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdReport, setCreatedReport] = useState<Report | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim()) return;

    setIsSubmitting(true);

    // 1. Deterministic category baseline priority
    let priority: Priority = "Low";
    if (category === "Campus Safety") priority = "High";
    else if (
      ["Electricity", "Wi-Fi/Internet", "Classroom/Projector", "Transportation"].includes(
        category
      )
    ) {
      priority = "Medium";
    }

    // 2. Keyword escalation rules
    const combined = `${title} ${description}`.toLowerCase();
    const criticalWords = [
      "fire",
      "smoke",
      "sparks",
      "shock",
      "exposed wire",
      "injury",
      "threat",
      "harassment",
      "assault",
      "gas",
      "emergency",
    ];
    const highWords = [
      "exam",
      "entire building",
      "no power",
      "everyone",
      "flooding",
      "stuck",
    ];

    if (criticalWords.some((k) => combined.includes(k))) {
      priority = "Critical";
    } else if (highWords.some((k) => combined.includes(k))) {
      if (priority === "Low") priority = "Medium";
      else if (priority === "Medium") priority = "High";
    }

    const dept = DEPT_MAP[category] || "General Operations";
    let action = "Standard maintenance ticket queued for department inspection.";
    if (priority === "Critical") {
      action = "Immediate alert triggered to on-duty response team; emergency dispatch initiated.";
    } else if (priority === "High") {
      action = "Priority work order created; duty supervisor notified within 1 business hour.";
    }

    const existingIds = reportRepo.list().map((r) => r.id);
    const id = generateReportId(existingIds);
    const now = new Date().toISOString();

    const record: Report = {
      id,
      studentName: studentName.trim() || "Anonymous Student",
      category,
      location: location.trim(),
      title: title.trim(),
      description: description.trim(),
      aiSummary: title.trim(),
      priority,
      suggestedDepartment: dept,
      suggestedAction: action,
      analysisSource: "rule-based",
      status: "Submitted",
      createdAt: now,
      updatedAt: now,
      history: [
        {
          status: "Submitted",
          at: now,
          note: `Report filed by ${studentName.trim() || "Student"}. Routed to ${dept}.`,
        },
      ],
    };

    // Save and dispatch event
    reportRepo.create(record);
    window.dispatchEvent(new Event("campusdesk_storage_updated"));

    setCreatedReport(record);
    setIsSubmitting(false);
  };

  const handleReset = () => {
    setStudentName("");
    setLocation("");
    setTitle("");
    setDescription("");
    setCreatedReport(null);
  };

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 800 }}>Report Campus Facility or Safety Issue</h2>
        <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginTop: "2px" }}>
          Submit a new incident for automated triage, priority classification, and departmental routing.
        </p>
      </div>

      {!createdReport ? (
        <div className="campus-card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="form-label">Student Name or Student ID (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Alex Rivera or ST-84920"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label className="form-label">Issue Category *</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Campus Safety Emergency Notice */}
            {category === "Campus Safety" && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.12)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "12px",
                  padding: "14px",
                  marginBottom: "16px",
                  fontSize: "12.5px",
                  color: "#ef4444",
                }}
              >
                <strong>EMERGENCY NOTICE:</strong> If this is an active fire, medical emergency, or physical threat,
                contact Campus Security immediately at <strong>Ext: 555-0911</strong> or local emergency services (911).
              </div>
            )}

            <div className="form-row">
              <label className="form-label">Campus Location *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Science Block, Lecture Hall 301, 3rd Floor"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-row">
              <label className="form-label">Incident Title *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Projector lamp blown out in lecture hall"
                minLength={5}
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="form-label">Detailed Description *</label>
                <span style={{ fontSize: "11px", color: "var(--text-dim)" }}>
                  {description.length}/1000
                </span>
              </div>
              <textarea
                className="form-control"
                rows={4}
                required
                placeholder="Describe what happened, any visible hazard, and student impact..."
                minLength={10}
                maxLength={1000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-action btn-primary-glow"
              style={{ width: "100%", padding: "14px" }}
            >
              {isSubmitting ? "Triaging Incident..." : "Submit & Run Automated Triage"}
            </button>
          </form>
        </div>
      ) : (
        /* Confirmation Card */
        <div className="campus-card" style={{ textAlign: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.15)",
              color: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, marginBottom: "6px" }}>Report Logged Successfully</h2>
          <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "24px" }}>
            Your report has been auto-classified and entered into the university dispatch system.
          </p>

          <div
            style={{
              background: "var(--bg-card-subtle)",
              border: "1px solid var(--border-main)",
              borderRadius: "14px",
              padding: "18px",
              marginBottom: "20px",
            }}
          >
            <div style={{ fontSize: "11px", textTransform: "uppercase", fontWeight: 700, color: "var(--text-dim)" }}>
              Tracking Reference
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "22px",
                fontWeight: 800,
                color: "var(--accent)",
                margin: "6px 0",
              }}
            >
              {createdReport.id}
            </div>
          </div>

          <div
            style={{
              border: "1px solid var(--border-main)",
              borderRadius: "14px",
              padding: "20px",
              textAlign: "left",
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span className={`badge badge-${createdReport.priority.toLowerCase()}`}>
                {createdReport.priority}
              </span>
              <span
                className="badge"
                style={{
                  background: "var(--bg-card-subtle)",
                  color: "var(--text-dim)",
                  border: "1px solid var(--border-main)",
                }}
              >
                Rule-based triage
              </span>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <strong>Assigned Dept:</strong> {createdReport.suggestedDepartment}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <strong>Recommended Next Action:</strong> {createdReport.suggestedAction}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-dim)",
                borderTop: "1px solid var(--border-main)",
                paddingTop: "10px",
                marginTop: "10px",
              }}
            >
              Automated suggestion. Not a verified decision. Staff will review.
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              type="button"
              className="btn-action btn-primary-glow"
              onClick={() => router.push(`/track?id=${encodeURIComponent(createdReport.id)}`)}
            >
              Track Resolution Timeline
            </button>
            <button type="button" className="btn-action btn-ghost-dark" onClick={handleReset}>
              Submit Another Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
