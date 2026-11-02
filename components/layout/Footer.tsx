import React from "react";
import Link from "next/link";
import { GraduationCap, ShieldAlert, HeartHandshake } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-white text-lg">
              <div className="w-7 h-7 rounded-lg bg-campus-600 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span>CampusDesk</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-driven central campus desk for immediate student assistance, rapid issue triage, and status tracking.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <HeartHandshake className="w-3.5 h-3.5 text-campus-400" />
                Student Support MVP
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Student Desk
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/chat" className="hover:text-white transition-colors">
                  Campus AI Assistant
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-white transition-colors">
                  Report a Maintenance Issue
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  Track Ticket Status
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Campus Health Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Operations & Demo */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Staff & System
            </div>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Staff Admin Triage Desk
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  AI Disclosure & Limitations
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Security Ext: 555-0911 (Sample)</span>
              </li>
              <li>
                <span className="text-slate-500">Facilities Ext: 555-0150 (Sample)</span>
              </li>
            </ul>
          </div>

          {/* Safety Alert Box */}
          <div className="rounded-lg p-3 bg-red-950/40 border border-red-800/40 text-red-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-red-300">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>Emergency Disclaimer</span>
            </div>
            <p className="text-[11px] leading-relaxed text-red-200/80">
              In case of active fire, gas leak, violent threat, or medical emergency, do not wait for a ticket. Call campus security or local emergency services immediately.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CampusDesk. Sample demonstration environment for educational institutions.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:underline">
              System Disclaimers
            </Link>
            <Link href="/dashboard" className="hover:underline">
              Demo Data Reset
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

