"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  MessageSquare,
  FilePlus,
  Search,
  LayoutDashboard,
  Shield,
  Info,
  Menu,
  X,
  UserCheck,
} from "lucide-react";
import { useRole } from "@/components/context/RoleContext";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { role, setRole, isAdmin } = useRole();

  const navLinks = [
    { href: "/", label: "Home", icon: GraduationCap },
    { href: "/chat", label: "Assistant", icon: MessageSquare },
    { href: "/report", label: "Report Issue", icon: FilePlus },
    { href: "/track", label: "Track", icon: Search },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin", label: "Admin", icon: Shield },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-lg sm:text-xl text-slate-900 dark:text-white hover:opacity-90 transition-opacity"
          >
            <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
              <img src="/logo.jpg" alt="CampusDesk Logo" className="h-8 w-auto object-contain" />
            </div>
            <span className="tracking-tight">
              Campus<span className="text-campus-600 dark:text-campus-400">Desk</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? "bg-campus-50 dark:bg-campus-950/50 text-campus-700 dark:text-campus-300 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Role Switcher & Controls */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex flex-col items-end">
              <div
                className="inline-flex p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                role="group"
                aria-label="Role Switcher"
              >
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    role === "student"
                      ? "bg-white dark:bg-slate-900 text-campus-700 dark:text-campus-300 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                  }`}
                  aria-pressed={role === "student"}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    role === "admin"
                      ? "bg-campus-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                  }`}
                  aria-pressed={role === "admin"}
                >
                  Admin
                </button>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                Demo role switch, not real authentication
              </span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="touch-target p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-3">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg mb-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Active Demo Persona
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setRole("student");
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 text-xs font-medium rounded-md text-center border ${
                  role === "student"
                    ? "bg-campus-600 text-white border-campus-600 shadow-sm"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                Student View
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("admin");
                  setMobileMenuOpen(false);
                }}
                className={`py-2 px-3 text-xs font-medium rounded-md text-center border ${
                  role === "admin"
                    ? "bg-campus-600 text-white border-campus-600 shadow-sm"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                Staff/Admin View
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 text-center">
              Demo role switch, not real authentication
            </p>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium touch-target ${
                    isActive
                      ? "bg-campus-50 dark:bg-campus-950/60 text-campus-700 dark:text-campus-300 font-semibold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5 text-slate-500" aria-hidden="true" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

