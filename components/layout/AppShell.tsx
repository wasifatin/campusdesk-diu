"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { reportRepo } from "@/lib/repository";
import { useRole } from "@/components/context/RoleContext";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole } = useRole();

  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [splashVisible, setSplashVisible] = useState(true);
  const [railOpen, setRailOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredTip, setHoveredTip] = useState<{ text: string; top: number } | null>(null);

  const handleNavMouseEnter = (e: React.MouseEvent<HTMLElement>, label: string) => {
    if (railOpen) return;
    const panel = document.getElementById("rail-panel");
    if (!panel) return;
    const targetRect = e.currentTarget.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const y = targetRect.top - panelRect.top + (targetRect.height / 2) - 14;
    setHoveredTip({ text: label, top: y });
  };

  const handleNavMouseLeave = () => {
    setHoveredTip(null);
  };

  const updateCounts = useCallback(() => {
    if (typeof window === "undefined") return;
    const reports = reportRepo.list();
    setTotalCount(reports.length);
    setCriticalCount(reports.filter((r) => r.priority === "Critical").length);
  }, []);

  useEffect(() => {
    const savedTheme = (localStorage.getItem("campusdesk_theme") as "dark" | "light") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    updateCounts();

    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 2100);

    const handleStorageChange = () => updateCounts();
    window.addEventListener("campusdesk_storage_updated", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("campusdesk_storage_updated", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [updateCounts]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("campusdesk_theme", next);
    window.dispatchEvent(new CustomEvent("campusdesk_theme_changed", { detail: next }));
  };

  const handleExportSpreadsheet = () => {
    const reports = reportRepo.list();
    if (!reports || reports.length === 0) {
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

  const handleClearHistory = () => {
    const reports = reportRepo.list();
    const count = reports.length;
    const msg =
      count > 0
        ? `Are you sure you want to clear all ${count} received incident reports and history audit logs? This action cannot be undone.`
        : "Are you sure you want to reset all incident history and audit records?";

    if (confirm(msg)) {
      reportRepo.clearAll();
      window.dispatchEvent(new Event("campusdesk_storage_updated"));
      updateCounts();
      alert("All incident records and audit history have been cleared.");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/track?id=${encodeURIComponent(searchQuery.trim().toUpperCase())}`);
    }
  };

  const getPageTitle = () => {
    if (pathname === "/" || pathname === "/dashboard") return "Campus Desk";
    if (pathname.startsWith("/chat")) return "Conversational AI";
    if (pathname.startsWith("/report")) return "Report Issue";
    if (pathname.startsWith("/track")) return "Track Resolution";
    if (pathname.startsWith("/admin")) return "Staff Admin Triage Desk";
    if (pathname.startsWith("/about")) return "About & Disclosures";
    return "Operations";
  };

  const logoFile = "/logo-dark.png";

  return (
    <>
      {/* 1. Cinematic Startup Logo Splash (Clean Logo, No Text Beneath It) */}
      {splashVisible && (
        <div
          id="startupSplash"
          onClick={() => setSplashVisible(false)}
          title="Click anywhere to proceed"
        >
          <div className="ambient-glow-circle" />
          <div className="splash-logo-container">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-dark.png"
              alt="CampusDesk Official Logo"
              className="splash-logo-img"
            />
          </div>
        </div>
      )}

      <div className={`app ${railOpen ? "rail-open" : ""}`}>
        {/* 2. Collapsible Sidebar Rail (Modern Pill Design) */}
        <nav className="rail" id="appSidebar" aria-label="Main navigation">
          <div className="rail__panel" id="rail-panel">
            <Link href="/" className="rail__logo" aria-label="CampusDesk, overview">
              <span className="rail__mark">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="campus-logo-img"
                  src={logoFile}
                  alt="Logo"
                  style={{ width: 26, height: 26, objectFit: "contain" }}
                />
              </span>
              <span className="rail__brand" aria-hidden="true">CampusDesk</span>
            </Link>

            <div className="rail__list">
              <ul className="rail__ul" role="list">
                <li>
                  <Link
                    href="/"
                    className={`rail__item ${pathname === "/" || pathname === "/dashboard" ? "is-active" : ""}`}
                    onMouseEnter={(e) => handleNavMouseEnter(e, "Overview")}
                    onMouseLeave={handleNavMouseLeave}
                    aria-current={pathname === "/" || pathname === "/dashboard" ? "page" : undefined}
                  >
                    <span className="rail__icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="7" height="7" rx="2"></rect><rect x="13.5" y="3.5" width="7" height="7" rx="2"></rect><rect x="3.5" y="13.5" width="7" height="7" rx="2"></rect><rect x="13.5" y="13.5" width="7" height="7" rx="2"></rect></svg>
                    </span>
                    <span className="rail__label">Overview</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/chat"
                    className={`rail__item ${pathname.startsWith("/chat") ? "is-active" : ""}`}
                    onMouseEnter={(e) => handleNavMouseEnter(e, "AI Assistant")}
                    onMouseLeave={handleNavMouseLeave}
                  >
                    <span className="rail__icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V17A2.5 2.5 0 0 1 4 14.5z"></path></svg>
                      <span className="rail__badge" aria-hidden="true">AI</span>
                    </span>
                    <span className="rail__label">AI Assistant</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/report"
                    className={`rail__item ${pathname.startsWith("/report") ? "is-active" : ""}`}
                    onMouseEnter={(e) => handleNavMouseEnter(e, "Report Issue")}
                    onMouseLeave={handleNavMouseLeave}
                  >
                    <span className="rail__icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>
                    </span>
                    <span className="rail__label">Report Issue</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/track"
                    className={`rail__item ${pathname.startsWith("/track") ? "is-active" : ""}`}
                    onMouseEnter={(e) => handleNavMouseEnter(e, "Track Status")}
                    onMouseLeave={handleNavMouseLeave}
                  >
                    <span className="rail__icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5V12l3 2"></path></svg>
                    </span>
                    <span className="rail__label">Track Status</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin"
                    className={`rail__item ${pathname.startsWith("/admin") ? "is-active" : ""}`}
                    onMouseEnter={(e) => handleNavMouseEnter(e, "Staff Triage Desk")}
                    onMouseLeave={handleNavMouseLeave}
                  >
                    <span className="rail__icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5 3.5 10.6l6.6 2.8 2.8 6.6z"></path><path d="m10.1 13.4 4.2-4.2"></path></svg>
                      {criticalCount > 0 && <span className="rail__badge" aria-hidden="true">{criticalCount}</span>}
                    </span>
                    <span className="rail__label">Staff Triage Desk</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className={`rail__item ${pathname.startsWith("/about") ? "is-active" : ""}`}
                    onMouseEnter={(e) => handleNavMouseEnter(e, "About & System")}
                    onMouseLeave={handleNavMouseLeave}
                  >
                    <span className="rail__icon">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 8h.01M11 12h1v4h1"></path></svg>
                    </span>
                    <span className="rail__label">About & System</span>
                  </Link>
                </li>
              </ul>
            </div>



            {/* Expand / Collapse Button */}
            <button
              className="rail__item rail__toggle"
              id="rail-toggle"
              type="button"
              aria-controls="rail-panel"
              aria-expanded={railOpen}
              onClick={() => setRailOpen(!railOpen)}
            >
              <span className="rail__icon">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4" width="17" height="16" rx="3"></rect><path d="M9.5 4v16"></path><path className="rail__chev" d="m13.5 10 2 2-2 2"></path></svg>
              </span>
              <span className="rail__label">{railOpen ? "Collapse sidebar" : "Expand sidebar"}</span>
            </button>
          </div>
          {hoveredTip && !railOpen && (
            <span
              className="rail__tip"
              id="rail-tip"
              aria-hidden="true"
              style={{
                opacity: 1,
                transform: `translateY(${hoveredTip.top}px)`,
                display: "block",
                position: "absolute",
                left: "calc(100% + 12px)",
                zIndex: 100,
                pointerEvents: "none",
                transition: "transform 0.15s ease-out, opacity 0.15s ease-out",
              }}
            >
              {hoveredTip.text}
            </span>
          )}
        </nav>

        {/* 3. Topbar Header */}
        <header className="top">
          <div className="top__hello">
            <h1 className="top__title" id="topbarPageTitle" tabIndex={-1}>
              <span className="w">{getPageTitle()}</span>
            </h1>
            <p className="top__sub" id="topbarPageSub">Here’s how your campus operations moved today.</p>
          </div>

          <div className="top__tools">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="search" role="search">
              <label className="sr-only" htmlFor="topGlobalSearch">Search incidents</label>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>
              <input
                id="topGlobalSearch"
                type="text"
                placeholder="Search (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
              <kbd aria-hidden="true">⌘K</kbd>
            </form>

            {/* Sync Button */}
            <button className="sync" type="button" onClick={() => updateCounts()} title="Synchronize telemetry">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 0 1-14.3 4.9M4 12A8 8 0 0 1 18.3 7.1"></path><path d="M18.5 3v4.3h-4.3M5.5 21v-4.3h4.3"></path></svg>
              <span className="sync__text">
                <span className="sync__label">Last sync</span>
                <span className="sync__when">Just now</span>
              </span>
            </button>

            {/* History Audit Button */}
            <button className="quick-pill-btn" type="button" onClick={handleExportSpreadsheet} title="Download complete incident audit spreadsheet (.CSV)">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <span>History Audit</span>
            </button>

            {/* Clear History Button */}
            <button className="quick-pill-btn" type="button" onClick={handleClearHistory} title="Clear all incident history and audit records" style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.35)" }}>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              <span>Clear History</span>
            </button>

            {/* Water Droplet Theme Switcher */}
            <button className="theme-toggle-btn" type="button" onClick={toggleTheme} title="Toggle Water-Droplet Smooth Dark/Light Mode">
              {theme === "dark" ? (
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>

            {/* Persona Pill */}
            <div className="persona-pill">
              <button
                type="button"
                className={`persona-btn ${role === "student" ? "active" : ""}`}
                onClick={() => setRole("student")}
              >
                Student
              </button>
              <button
                type="button"
                className={`persona-btn ${role === "admin" ? "active admin" : ""}`}
                onClick={() => setRole("admin")}
              >
                Staff
              </button>
            </div>

            {/* Website Logo Avatar */}
            <button className="avatar" type="button" title="CampusDesk Operations Desk" aria-label="CampusDesk Logo & Account">
              <img
                className="topbar-logo-img"
                src={theme === "dark" ? "/logo-dark.png" : "/logo-transparent.png"}
                alt="CampusDesk Logo"
                style={{ width: "30px", height: "30px", objectFit: "contain", display: "block" }}
              />
            </button>
          </div>
        </header>

        {/* 4. Main Views Container */}
        <main className="views" id="main">
          {children}
        </main>
      </div>
    </>
  );
}
