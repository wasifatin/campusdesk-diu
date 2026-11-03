"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { reportRepo } from "@/lib/repository";
import { Report } from "@/lib/types";

function TrackTicketInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [inputVal, setInputVal] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [searchedId, setSearchedId] = useState<string | null>(null);

  const performSearch = (idToLookup: string) => {
    const trimmed = idToLookup.trim().toUpperCase();
    if (!trimmed) {
      setReport(null);
      setSearchedId(null);
      return;
    }
    setSearchedId(trimmed);
    const found = reportRepo.get(trimmed);
    setReport(found);
  };

  useEffect(() => {
    const qId = searchParams.get("id");
    if (qId) {
      setInputVal(qId);
      performSearch(qId);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleStorageUpdate = () => {
      if (searchedId) {
        setReport(reportRepo.get(searchedId));
      }
    };
    window.addEventListener("campusdesk_storage_updated", handleStorageUpdate);
    return () => window.removeEventListener("campusdesk_storage_updated", handleStorageUpdate);
  }, [searchedId]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    router.push(`/track?id=${encodeURIComponent(inputVal.trim().toUpperCase())}`);
    performSearch(inputVal);
  };

  const stages = ["Submitted", "Under Review", "In Progress", "Resolved"] as const;
  const currentStageIndex = report ? stages.indexOf(report.status as typeof stages[number]) : -1;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>Ticket Lifecycle Tracking</h2>
        <p style={{ fontSize: "13.5px", color: "var(--text-muted)" }}>
          Enter reference ID to view 4-stage resolution timeline and technician audit notes.
        </p>
      </div>

      <div className="campus-card" style={{ marginBottom: 24 }}>
        <form onSubmit={handleLookup} className="lookup-form-wrap">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Reference ID (e.g. CAM-20261102-XXXX)..."
            style={{ fontFamily: "var(--font-mono)" }}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button type="submit" className="btn-action btn-primary-glow">
            Lookup
          </button>
        </form>
      </div>

      {searchedId && !report && (
        <div className="campus-card" style={{ textAlign: "center", padding: "40px 24px" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>No Report Found</h3>
          <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 16 }}>
            We could not find any record matching &quot;{searchedId}&quot;.
          </p>
          <Link href="/report" className="btn-action btn-ghost-dark" style={{ display: "inline-block" }}>
            File a New Report
          </Link>
        </div>
      )}

      {report && (
        <div className="campus-card">
          {/* Header Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 18,
              flexWrap: "wrap",
              gap: 10,
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 800,
                  fontSize: 18,
                  color: "var(--accent)",
                }}
              >
                {report.id}
              </span>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>{report.title}</h3>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span className={`badge badge-status-${report.status.toLowerCase().replace(" ", "-")}`}>
                {report.status}
              </span>
              <span className={`badge badge-${report.priority.toLowerCase()}`}>
                {report.priority}
              </span>
            </div>
          </div>

          {/* Meta Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              background: "var(--bg-card-subtle)",
              padding: 14,
              borderRadius: 12,
              fontSize: "12.5px",
              marginBottom: 20,
              border: "1px solid var(--border-main)",
            }}
          >
            <div>
              <strong style={{ color: "var(--text-dim)" }}>Location: </strong>
              <span>{report.location}</span>
            </div>
            <div>
              <strong style={{ color: "var(--text-dim)" }}>Department: </strong>
              <span>{report.suggestedDepartment}</span>
            </div>
            <div>
              <strong style={{ color: "var(--text-dim)" }}>Filed Date: </strong>
              <span>{new Date(report.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: 14,
              color: "var(--text-muted)",
              lineHeight: 1.6,
              marginBottom: 20,
            }}
          >
            {report.description}
          </p>

          {/* Timeline Title */}
          <h4
            style={{
              fontSize: 15,
              fontWeight: 800,
              borderTop: "1px solid var(--border-main)",
              paddingTop: 18,
            }}
          >
            Resolution Lifecycle Timeline
          </h4>

          {/* Stages */}
          <div
            style={{
              margin: "24px 0",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {stages.map((st, idx) => {
              const isDone = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const circleBg = isCurrent
                ? "var(--accent)"
                : isDone
                ? "#10b981"
                : "var(--bg-card-subtle)";
              const circleColor = isCurrent || isDone ? "#ffffff" : "var(--text-dim)";

              return (
                <div key={st} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: circleBg,
                      color: circleColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 12,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "14.5px",
                        color: isCurrent ? "var(--accent)" : "var(--text-main)",
                      }}
                    >
                      {st}
                    </div>
                    {isCurrent && (
                      <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                        Current Active Milestone
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Audit History Log */}
          {report.history && report.history.length > 0 && (
            <div style={{ marginTop: 24, borderTop: "1px solid var(--border-main)", paddingTop: 16 }}>
              <h5 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dim)", textTransform: "uppercase", marginBottom: 10 }}>
                Audit History Trail
              </h5>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {report.history.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      fontSize: "12.5px",
                      padding: "8px 12px",
                      background: "var(--bg-card-subtle)",
                      borderRadius: 8,
                      border: "1px solid var(--border-main)",
                    }}
                  >
                    <span style={{ fontWeight: 700, color: "var(--accent)" }}>[{h.status}]</span>{" "}
                    <span style={{ color: "var(--text-dim)" }}>
                      {h.at ? new Date(h.at).toLocaleString() : ""}
                    </span>
                    {h.note && (
                      <div style={{ marginTop: 4, color: "var(--text-main)" }}>{h.note}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 32, textAlign: "center", color: "var(--text-dim)" }}>
          Loading ticket lookup...
        </div>
      }
    >
      <TrackTicketInner />
    </Suspense>
  );
}
