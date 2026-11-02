"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { reportRepo } from "@/lib/repository";
import { Report } from "@/lib/types";

export default function OverviewPage() {
  const router = useRouter();
  const [quickTrackId, setQuickTrackId] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const loadData = useCallback(() => {
    if (typeof window === "undefined") return;
    const list = reportRepo.list();
    setReports(list);
  }, []);

  useEffect(() => {
    loadData();
    const savedTheme = (localStorage.getItem("campusdesk_theme") as "dark" | "light") || "dark";
    setTheme(savedTheme);

    const handleUpdate = () => loadData();
    const handleThemeChange = () => {
      const current = (localStorage.getItem("campusdesk_theme") as "dark" | "light") || "dark";
      setTheme(current);
    };

    window.addEventListener("campusdesk_storage_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("campusdesk_theme_changed", handleThemeChange);

    return () => {
      window.removeEventListener("campusdesk_storage_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("campusdesk_theme_changed", handleThemeChange);
    };
  }, [loadData]);

  const total = reports.length;
  const pending = reports.filter(
    (r) => r.status === "Submitted" || r.status === "Under Review"
  ).length;
  const progress = reports.filter((r) => r.status === "In Progress").length;
  const resolved = reports.filter((r) => r.status === "Resolved").length;
  const completionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const [topRange, setTopRange] = useState<"week" | "month">("week");
  const [mixPeriod, setMixPeriod] = useState<"month" | "last">("month");

  // Dynamic calculations for Top Response Teams
  const now = Date.now();
  const topCutoff = topRange === "week" ? now - 7 * 86400000 : now - 30 * 86400000;
  const filteredForTeams = reports.filter((r) => {
    if (!r.createdAt) return true;
    return new Date(r.createdAt).getTime() >= topCutoff;
  });

  const teamsData = [
    { code: "FM", name: "Facilities & Janitorial", mail: "facilities@campusdesk.edu", count: 0 },
    { code: "IT", name: "Network & IT Ops", mail: "it-help@campusdesk.edu", count: 0 },
    { code: "AV", name: "Academic Media Services", mail: "av@campusdesk.edu", count: 0 },
    { code: "CS", name: "Campus Safety Dispatch", mail: "security@campusdesk.edu", count: 0 },
    { code: "EM", name: "Electrical Maintenance", mail: "electric@campusdesk.edu", count: 0 },
  ];

  filteredForTeams.forEach((r) => {
    const cat = (r.category || "").toLowerCase();
    const dept = (r.suggestedDepartment || "").toLowerCase();
    if (cat.includes("washroom") || cat.includes("clean") || dept.includes("facilities") || cat.includes("other")) {
      teamsData[0].count++;
    } else if (cat.includes("wi-fi") || cat.includes("internet") || dept.includes("it") || dept.includes("network")) {
      teamsData[1].count++;
    } else if (cat.includes("classroom") || cat.includes("projector") || dept.includes("av") || dept.includes("media")) {
      teamsData[2].count++;
    } else if (cat.includes("safety") || cat.includes("security") || dept.includes("safety") || cat.includes("transportation")) {
      teamsData[3].count++;
    } else if (cat.includes("electr") || cat.includes("fan") || cat.includes("ac") || dept.includes("electrical")) {
      teamsData[4].count++;
    } else {
      teamsData[0].count++;
    }
  });

  const totalFilteredReports = filteredForTeams.length;
  const maxTeamCount = Math.max(...teamsData.map((t) => t.count), 1);

  // Dynamic calculations for Category Mix
  const totalReportsCount = reports.length;
  let facilitiesCount = 0;
  let itCount = 0;
  let safetyAvCount = 0;

  reports.forEach((r) => {
    const cat = (r.category || "").toLowerCase();
    if (cat.includes("washroom") || cat.includes("clean") || cat.includes("facility") || cat.includes("other")) {
      facilitiesCount++;
    } else if (cat.includes("wi-fi") || cat.includes("internet") || cat.includes("it")) {
      itCount++;
    } else {
      safetyAvCount++;
    }
  });

  const facPct = totalReportsCount > 0 ? Math.round((facilitiesCount / totalReportsCount) * 100) : 0;
  const itPct = totalReportsCount > 0 ? Math.round((itCount / totalReportsCount) * 100) : 0;
  const safePct = totalReportsCount > 0 ? Math.max(0, 100 - facPct - itPct) : 0;

  const circumference = 326.7;
  const facLen = ((facPct / 100) * circumference).toFixed(1);
  const itLen = ((itPct / 100) * circumference).toFixed(1);
  const safeLen = ((safePct / 100) * circumference).toFixed(1);

  const [chartYear, setChartYear] = useState<number>(2026);
  const [hoveredMonth, setHoveredMonth] = useState<{
    month: string;
    solved: number;
    submitted: number;
    total: number;
    x: number;
  } | null>(null);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIdx = new Date().getMonth();
  const currentYearNow = new Date().getFullYear();

  const monthlyData = monthNames.map((name, mIdx) => {
    let solved = 0;
    let submitted = 0;
    reports.forEach((r) => {
      if (!r.createdAt) return;
      const d = new Date(r.createdAt);
      if (d.getFullYear() === chartYear && d.getMonth() === mIdx) {
        if (r.status === "Resolved") solved++;
        else submitted++;
      }
    });
    return {
      month: name,
      mIdx,
      solved,
      submitted,
      total: solved + submitted,
    };
  });

  const maxTotal = Math.max(...monthlyData.map((d) => d.total), 0);
  let yMax = 4;
  if (maxTotal > 4 && maxTotal <= 10) yMax = 10;
  else if (maxTotal > 10 && maxTotal <= 20) yMax = 20;
  else if (maxTotal > 20 && maxTotal <= 50) yMax = 50;
  else if (maxTotal > 50 && maxTotal <= 200) yMax = 200;
  else if (maxTotal > 200 && maxTotal <= 1000) yMax = 1000;
  else if (maxTotal > 1000) yMax = Math.ceil(maxTotal / 500) * 500;

  const baselineY = 220;
  const chartHeight = 190;
  const topY = baselineY - chartHeight;

  const yTicks = [
    { val: 0, y: baselineY },
    { val: Math.round(yMax * 0.25), y: baselineY - chartHeight * 0.25 },
    { val: Math.round(yMax * 0.5), y: baselineY - chartHeight * 0.5 },
    { val: Math.round(yMax * 0.75), y: baselineY - chartHeight * 0.75 },
    { val: yMax, y: topY },
  ];

  const formatTick = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "K";
    return num.toString();
  };

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      router.push(`/track?id=${encodeURIComponent(quickTrackId.trim().toUpperCase())}`);
    }
  };

  const handleExportSpreadsheet = () => {
    if (reports.length === 0) {
      alert("No incident reports received yet to export. Please submit an issue report first.");
      return;
    }
    const csvContent = reportRepo.exportCSV();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `CampusDesk_Audit_Export_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleQuickResolve = (id: string) => {
    reportRepo.updateStatus(id, "Resolved", "Marked as Resolved directly from Active Incident Feed.");
    loadData();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("campusdesk_storage_updated"));
    }
  };

  return (
    <div>
      {/* -------------------------------------------------------------
          HERO BANNER (MATCHES INDEX.HTML CAMPUSDESK DESIGN)
          ------------------------------------------------------------- */}
      <div className="campus-hero-banner">
        <div>
          <div className="badge badge-medium" style={{ marginBottom: "10px" }}>
            Metropolitan Central University Dispatch
          </div>
          <h1 className="hero-title">Intelligent Campus Operations & Triage</h1>
          <p className="hero-desc">
            Real-time incident stream, automated severity triage with instant keyword
            escalation, and student resolution monitoring.
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
            <Link href="/report" className="btn-action btn-primary-glow">
              + Report Incident
            </Link>
            <Link href="/chat" className="btn-action btn-ghost-dark">
              Ask AI Assistant
            </Link>
          </div>
        </div>

        {/* Attached Official Logo */}
        <div className="hero-logo-showcase" title="CampusDesk Official Logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={theme === "dark" ? "/logo-dark.png" : "/logo-transparent.png"}
            alt="CampusDesk Official Logo"
            className="hero-logo-img"
          />
        </div>
      </div>

      {/* -------------------------------------------------------------
          CAMPUSDESK 4-CARD STATS GRID
          ------------------------------------------------------------- */}
      <div className="campus-stats-grid">
        <div className="campus-stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Reports</span>
            <div className="stat-icon-wrapper">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="stat-number">{total}</div>
          <div className="stat-trend">
            <span className="trend-indicator">Live</span> Secure localStorage storage
          </div>
        </div>

        <div className="campus-stat-card">
          <div className="stat-header">
            <span className="stat-label">Pending / Triage</span>
            <div className="stat-icon-wrapper" style={{ color: "#f59e0b" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div className="stat-number">{pending}</div>
          <div className="stat-trend">Needs department inspection</div>
        </div>

        <div className="campus-stat-card">
          <div className="stat-header">
            <span className="stat-label">In Progress</span>
            <div className="stat-icon-wrapper" style={{ color: "#a855f7" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
          </div>
          <div className="stat-number">{progress}</div>
          <div className="stat-trend">
            <span className="trend-indicator">Dispatched</span> On-site technicians
          </div>
        </div>

        <div className="campus-stat-card">
          <div className="stat-header">
            <span className="stat-label">Resolved</span>
            <div className="stat-icon-wrapper" style={{ color: "#10b981" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
          <div className="stat-number">{resolved}</div>
          <div className="stat-trend">
            <span className="trend-indicator">{completionRate}%</span> Resolution rate
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          QUICK TRACK SEARCH BOX
          ------------------------------------------------------------- */}
      <div className="campus-card" style={{ marginBottom: "28px" }}>
        <div className="card-header-row">
          <div>
            <h3 className="card-title">Instant Ticket Lookup</h3>
            <p style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "2px" }}>
              Enter your unique tracking reference to inspect resolution milestone timeline.
            </p>
          </div>
        </div>
        <form onSubmit={handleQuickTrack} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter reference code (e.g. CAM-20261102-XXXX)..."
            style={{ fontFamily: "var(--font-mono)" }}
            value={quickTrackId}
            onChange={(e) => setQuickTrackId(e.target.value)}
          />
          <button type="submit" className="btn-action btn-primary-glow">
            Lookup
          </button>
        </form>
      </div>

      {/* -------------------------------------------------------------
          RECENT INCIDENT FEED TABLE
          ------------------------------------------------------------- */}
      <div className="campus-card">
        <div className="card-header-row">
          <div>
            <h3 className="card-title">Active Incident Feed</h3>
            <p style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "2px" }}>
              Latest reported campus disruptions and facility updates
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="quick-pill-btn"
              onClick={handleExportSpreadsheet}
              title="Download complete incident audit spreadsheet (.CSV)"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>History Audit</span>
            </button>
            <Link href="/admin" className="quick-pill-btn">
              View Full Triage Desk &rarr;
            </Link>
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Incident Title</th>
                <th>Location</th>
                <th>Priority</th>
                <th>Department</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "var(--text-dim)" }}>
                    No incident reports logged yet. Submit your first report via &quot;Report Issue&quot;.
                  </td>
                </tr>
              ) : (
                reports.slice(0, 5).map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--accent)" }}>
                      {r.id}
                    </td>
                    <td>
                      <strong>{r.title}</strong>
                    </td>
                    <td>{r.location}</td>
                    <td>
                      <span className={`badge badge-${r.priority.toLowerCase()}`}>
                        {r.priority}
                      </span>
                    </td>
                    <td>{r.suggestedDepartment}</td>
                    <td>
                      <span className={`badge badge-status-${r.status.toLowerCase().replace(" ", "-")}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        href={`/track?id=${encodeURIComponent(r.id)}`}
                        className="quick-pill-btn"
                        style={{ padding: "4px 10px", fontSize: "11.5px" }}
                      >
                        Track
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------------------------------------------------
          MONTHLY REPORTS CALCULATION DIAGRAM
          ------------------------------------------------------------- */}
      <article className="card card--month" id="month" aria-labelledby="month-h" style={{ marginTop: "24px", marginBottom: "24px" }}>
        <div className="card__head">
          <div>
            <h2 className="card__title" id="month-h">Reports by month</h2>
            <ul className="legend" role="list">
              <li><i className="key key--solid"></i>Solved</li>
              <li><i className="key key--hatch"></i>Submitted</li>
            </ul>
          </div>
          <div className="seg" role="group" aria-label="Year" data-seg="month">
            <button
              type="button"
              className={chartYear === 2026 ? "is-active" : ""}
              onClick={() => setChartYear(2026)}
            >
              2026
            </button>
            <button
              type="button"
              className={chartYear === 2025 ? "is-active" : ""}
              onClick={() => setChartYear(2025)}
            >
              2025
            </button>
          </div>
        </div>
        <div className="cols" id="month-chart" tabIndex={0} role="group" aria-label="Reports by month: calculated dynamically from submitted and solved records.">
          <svg viewBox="0 0 1000 270" aria-hidden="true" preserveAspectRatio="none">
            <defs>
              <pattern id="hatch-t-next" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="6" height="6" fill="var(--c-tangerine-soft)"></rect>
                <rect width="2" height="6" fill="var(--c-tangerine)" opacity=".8"></rect>
              </pattern>
            </defs>
            <g>
              {yTicks.map((tick, idx) => (
                <React.Fragment key={idx}>
                  <line className="cols__grid" x1={40} x2={980} y1={tick.y} y2={tick.y} />
                  <text className="cols__axis" textAnchor="end" x={32} y={tick.y + 4}>{formatTick(tick.val)}</text>
                </React.Fragment>
              ))}
            </g>
            <g>
              {monthlyData.map((d, i) => {
                const xCenter = 70 + i * 80;
                const colWidth = 36;
                const xLeft = xCenter - colWidth / 2;
                const xRight = xCenter + colWidth / 2;

                const solvedHeight = (d.solved / yMax) * chartHeight;
                const submittedHeight = (d.submitted / yMax) * chartHeight;
                const totalHeight = solvedHeight + submittedHeight;
                const yTop = baselineY - totalHeight;
                const ySplit = baselineY - solvedHeight;

                const isCurrentMonth = chartYear === currentYearNow && i === currentMonthIdx;
                const isHovered = hoveredMonth?.month === d.month;

                return (
                  <g
                    key={d.month}
                    className={`col ${isCurrentMonth || isHovered ? "is-on" : ""}`}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredMonth({ month: d.month, solved: d.solved, submitted: d.submitted, total: d.total, x: xCenter })}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    <rect x={xLeft - 14} y={topY} width={colWidth + 28} height={chartHeight + 20} fill="transparent" />
                    {d.total === 0 && (
                      <rect x={xLeft} y={baselineY - 3} width={colWidth} height={3} rx={1.5} fill="var(--line-strong)" opacity={0.4} />
                    )}
                    {d.submitted > 0 && (
                      <path
                        className="cols__seg"
                        fill="url(#hatch-t-next)"
                        d={`M${xLeft},${ySplit} V${yTop + 6} Q${xLeft},${yTop} ${xLeft + 6},${yTop} H${xRight - 6} Q${xRight},${yTop} ${xRight},${yTop + 6} V${ySplit} Z`}
                      />
                    )}
                    {d.solved > 0 && (
                      <path
                        className="cols__seg"
                        fill="var(--c-tangerine)"
                        d={
                          d.submitted === 0
                            ? `M${xLeft},${baselineY} V${ySplit + 6} Q${xLeft},${ySplit} ${xLeft + 6},${ySplit} H${xRight - 6} Q${xRight},${ySplit} ${xRight},${ySplit + 6} V${baselineY} Z`
                            : `M${xLeft},${baselineY} V${ySplit} H${xRight} V${baselineY} Z`
                        }
                      />
                    )}
                  </g>
                );
              })}
            </g>
            <g>
              {monthlyData.map((d, i) => {
                const xCenter = 70 + i * 80;
                const isCurrentMonth = chartYear === currentYearNow && i === currentMonthIdx;
                const isHovered = hoveredMonth?.month === d.month;
                return (
                  <text
                    key={d.month}
                    className={`cols__axis ${isCurrentMonth || isHovered ? "is-on" : ""}`}
                    textAnchor="middle"
                    x={xCenter}
                    y={252}
                  >
                    {d.month}
                  </text>
                );
              })}
            </g>
          </svg>
          {hoveredMonth && (
            <div
              className="cols__tip"
              style={{
                opacity: 1,
                transform: `translate(${Math.max(10, Math.min(800, hoveredMonth.x - 60))}px, 15px)`,
                pointerEvents: "none",
              }}
            >
              <strong>{hoveredMonth.month} {chartYear} · Total: {hoveredMonth.total}</strong>
              <div className="row">
                <span><i className="key key--solid"></i>Solved</span>
                <span>{hoveredMonth.solved}</span>
              </div>
              <div className="row">
                <span><i className="key key--hatch"></i>Submitted</span>
                <span>{hoveredMonth.submitted}</span>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* -------------------------------------------------------------
          OPERATIONS INSIGHTS BENTO ROW (CATEGORY MIX & TOP TEAMS)
          ------------------------------------------------------------- */}
      <div className="bento-insights-grid" style={{ marginTop: "24px" }}>
        {/* Category Mix Donut Card (Calculated Dynamically from Reports) */}
        <article className="card" id="mix" aria-labelledby="mix-h">
          <div className="card__head">
            <h2 className="card__title" id="mix-h">Category mix</h2>
            <div className="seg" role="group" aria-label="Scope">
              <button
                type="button"
                className={mixPeriod === "month" ? "is-active" : ""}
                onClick={() => setMixPeriod("month")}
              >
                This month
              </button>
              <button
                type="button"
                className={mixPeriod === "last" ? "is-active" : ""}
                onClick={() => setMixPeriod("last")}
              >
                Last
              </button>
            </div>
          </div>
          <div className="donut-wrap">
            <div className="donut" role="img" aria-label="Incident category mix">
              <svg viewBox="0 0 140 140" aria-hidden="true">
                <circle className="donut__track" cx="70" cy="70" r="52" fill="none" strokeWidth="16"></circle>
                {totalReportsCount > 0 && (
                  <>
                    <circle cx="70" cy="70" r="52" fill="none" stroke="var(--c-tangerine)" strokeWidth="16" strokeLinecap="round" strokeDasharray={`${facLen} 326.7`} strokeDashoffset="0"></circle>
                    <circle cx="70" cy="70" r="52" fill="none" stroke="var(--c-teal)" strokeWidth="16" strokeLinecap="round" strokeDasharray={`${itLen} 326.7`} strokeDashoffset={`-${facLen}`}></circle>
                    <circle cx="70" cy="70" r="52" fill="none" stroke="var(--c-violet)" strokeWidth="16" strokeLinecap="round" strokeDasharray={`${safeLen} 326.7`} strokeDashoffset={`-${facLen + itLen}`}></circle>
                  </>
                )}
              </svg>
              <div className="donut__center"><b>{totalReportsCount}</b><span>reports</span></div>
            </div>
            <ul className="mix__legend" role="list">
              <li><i className="dot" style={{ background: "var(--c-tangerine)" }}></i><span className="name">Facilities</span><span className="pct">{facPct}%</span></li>
              <li><i className="dot" style={{ background: "var(--c-teal)" }}></i><span className="name">IT & Wi-Fi</span><span className="pct">{itPct}%</span></li>
              <li><i className="dot" style={{ background: "var(--c-violet)" }}></i><span className="name">Safety / AV</span><span className="pct">{safePct}%</span></li>
            </ul>
          </div>
        </article>

        {/* Top Response Teams Card (Calculated Dynamically from Reports) */}
        <article className="card" id="top-contacts" aria-labelledby="top-h">
          <div className="card__head">
            <h2 className="card__title" id="top-h">Top response teams</h2>
            <div className="seg" role="group" aria-label="Period">
              <button
                type="button"
                className={topRange === "week" ? "is-active" : ""}
                onClick={() => setTopRange("week")}
              >
                Week
              </button>
              <button
                type="button"
                className={topRange === "month" ? "is-active" : ""}
                onClick={() => setTopRange("month")}
              >
                Month
              </button>
            </div>
          </div>
          <ol className="people" id="people">
            {teamsData.map((t, idx) => {
              const pct = totalFilteredReports > 0 ? Math.round((t.count / totalFilteredReports) * 100) : 0;
              const barWidth = maxTeamCount > 0 && totalFilteredReports > 0 ? `${Math.round((t.count / maxTeamCount) * 100)}%` : "0%";
              return (
                <li key={t.code} className="person">
                  <span className={`person__av av--t${idx % 3}`} aria-hidden="true">{t.code}</span>
                  <div className="person__who">
                    <span className="person__name">{t.name}<span className="person__mail">{t.mail}</span></span>
                    <span className="person__bar" aria-hidden="true"><i style={{ width: barWidth }}></i></span>
                  </div>
                  <span className="person__num">{t.count}<small>{pct}%</small></span>
                </li>
              );
            })}
          </ol>
        </article>
      </div>
    </div>
  );
}
