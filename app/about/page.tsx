import React from "react";

export const metadata = {
  title: "About & Technical Disclosures - CampusDesk",
  description: "CampusDesk architecture, audit trail, privacy boundaries, and technical disclosures.",
};

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 840, margin: "0 auto" }}>
      <div className="campus-card">
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
          About CampusDesk & Technical Disclosures
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-muted)",
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          CampusDesk is an interactive university help desk platform designed with automated
          priority escalation, grounded AI assistance, and transparent lifecycle tracking.
        </p>

        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>
          System Architecture & Features:
        </h3>
        <ul
          style={{
            fontSize: "13.5px",
            color: "var(--text-muted)",
            lineHeight: 1.8,
            marginLeft: 20,
            marginBottom: 24,
          }}
        >
          <li>
            <strong>Local Storage Scope:</strong> Reports persist securely on your machine in{" "}
            <code
              style={{
                fontFamily: "var(--font-mono)",
                background: "var(--bg-card-subtle)",
                padding: "2px 6px",
                borderRadius: 6,
              }}
            >
              localStorage
            </code>{" "}
            across page reloads.
          </li>
          <li>
            <strong>Multi-View Workspace:</strong> Real-time toggle between Student submission view
            and Staff Admin operational management.
          </li>
          <li>
            <strong>Full Audit Trail & History Export:</strong> Complete tracking of state
            transitions, staff audit notes, and instant one-click CSV spreadsheet generation for
            operational oversight.
          </li>
          <li>
            <strong>Automated Triage Recommendations:</strong> Priority classification and routing
            recommendations provide decision support for campus operations staff.
          </li>
        </ul>

        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>
          Zero Untrusted Text Execution:
        </h3>
        <p style={{ fontSize: "13.5px", color: "var(--text-muted)", lineHeight: 1.6 }}>
          Student names and IDs are strictly excluded from AI prompts. User input is rendered
          safely as plain text to eliminate XSS or script injection vulnerabilities.
        </p>
      </div>
    </div>
  );
}
