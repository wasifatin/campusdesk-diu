"use client";

import React, { useState, useEffect } from "react";
import { reportRepo } from "@/lib/repository";
import { Report, Status, Priority } from "@/lib/types";

export default function AdminPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [catFilter, setCatFilter] = useState("ALL");
  const [prioFilter, setPrioFilter] = useState("ALL");

  // Modal edit state
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [editStatus, setEditStatus] = useState<Status>("Submitted");
  const [editPriority, setEditPriority] = useState<Priority>("Medium");
  const [editDept, setEditDept] = useState("");
  const [editNote, setEditNote] = useState("");

  const refreshList = () => {
    setReports(reportRepo.list());
  };

  useEffect(() => {
    refreshList();
    const handleStorageUpdate = () => refreshList();
    window.addEventListener("campusdesk_storage_updated", handleStorageUpdate);
    return () => window.removeEventListener("campusdesk_storage_updated", handleStorageUpdate);
  }, []);

  const handleExportCSV = () => {
    reportRepo.exportCSV();
  };

  const handleClearHistory = () => {
    const count = reports.length;
    const msg =
      count > 0
        ? `Are you sure you want to clear all ${count} received incident reports and history audit logs? This action cannot be undone.`
        : "Are you sure you want to reset all incident history and audit records?";
    if (confirm(msg)) {
      reportRepo.clearAll();
      refreshList();
      alert("All incident records and audit history have been cleared.");
    }
  };

  const openManageModal = (r: Report) => {
    setEditingReport(r);
    setEditStatus(r.status);
    setEditPriority(r.priority);
    setEditDept(r.suggestedDepartment);
    setEditNote("");
  };

  const closeManageModal = () => {
    setEditingReport(null);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport) return;

    reportRepo.override(editingReport.id, {
      status: editStatus,
      priority: editPriority,
      suggestedDepartment: editDept.trim() || editingReport.suggestedDepartment,
      auditNote: editNote.trim() || undefined,
    });

    closeManageModal();
    refreshList();
  };

  const filtered = reports.filter((r) => {
    const q = search.toLowerCase().trim();
    if (q) {
      const match =
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.studentName.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (catFilter !== "ALL" && r.category !== catFilter) return false;
    if (prioFilter !== "ALL" && r.priority !== prioFilter) return false;
    return true;
  });

  return (
    <div>
      {/* Top Header Row */}
      <div className="card-header-row" style={{ marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>Staff Admin Triage Desk</h2>
          <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginTop: 2 }}>
            Search, filter, update workflow status, and override automated assignments.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn-action btn-primary-glow"
            onClick={handleExportCSV}
            title="Download complete incident audit spreadsheet (.CSV)"
          >
            <svg
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>History Audit (.CSV)</span>
          </button>
          <button
            type="button"
            className="btn-action btn-danger-ghost"
            onClick={handleClearHistory}
            title="Clear all incident history and audit logs"
          >
            <svg
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Filter Card */}
      <div className="campus-card" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 14 }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by ID, keyword, student, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            className="form-control"
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="Classroom/Projector">Classroom/Projector</option>
            <option value="Wi-Fi/Internet">Wi-Fi/Internet</option>
            <option value="Washroom/Cleanliness">Washroom/Cleanliness</option>
            <option value="Fan/AC">Fan/AC</option>
            <option value="Electricity">Electricity</option>
            <option value="Transportation">Transportation</option>
            <option value="Campus Safety">Campus Safety</option>
            <option value="Other">Other</option>
          </select>

          <select
            className="form-control"
            value={prioFilter}
            onChange={(e) => setPrioFilter(e.target.value)}
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Reports Table Card */}
      <div className="campus-card">
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Student</th>
                <th>Title & Location</th>
                <th>Priority</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", padding: 28, color: "var(--text-dim)" }}
                  >
                    {reports.length === 0
                      ? "No incidents received yet. Newly submitted reports will appear here in real time."
                      : "No incidents match active filter criteria."}
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        color: "var(--accent)",
                      }}
                    >
                      {r.id}
                    </td>
                    <td>
                      <strong>{r.studentName}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{r.title}</strong>
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{r.location}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${r.priority.toLowerCase()}`}>
                        {r.priority}
                      </span>
                    </td>
                    <td>{r.suggestedDepartment}</td>
                    <td>
                      <span
                        className={`badge badge-status-${r.status.toLowerCase().replace(" ", "-")}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="quick-pill-btn"
                        style={{ padding: "5px 12px", fontSize: 12 }}
                        onClick={() => openManageModal(r)}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingReport && (
        <div className="campus-modal-backdrop open">
          <div className="campus-modal-window">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>Staff Triage Override</h3>
              <button
                type="button"
                onClick={closeManageModal}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "var(--text-dim)",
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal}>
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 800,
                    color: "var(--accent)",
                    fontSize: 13,
                  }}
                >
                  {editingReport.id}
                </div>
                <h4 style={{ fontSize: 17, fontWeight: 800, margin: "4px 0" }}>
                  {editingReport.title}
                </h4>
                <p style={{ fontSize: "12.5px", color: "var(--text-dim)" }}>
                  {editingReport.description}
                </p>
              </div>

              <div className="form-row">
                <label className="form-label">Workflow Status</label>
                <select
                  className="form-control"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as Status)}
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="form-row">
                <label className="form-label">Priority Override</label>
                <select
                  className="form-control"
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as Priority)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="form-row">
                <label className="form-label">Assigned Department</label>
                <input
                  type="text"
                  className="form-control"
                  value={editDept}
                  onChange={(e) => setEditDept(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <label className="form-label">Audit Note</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Dispatched technician; replaced blown projector lamp."
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  marginTop: 24,
                }}
              >
                <button
                  type="button"
                  className="btn-action btn-ghost-dark"
                  onClick={closeManageModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-action btn-primary-glow">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
