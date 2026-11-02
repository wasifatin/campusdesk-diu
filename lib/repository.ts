import { z } from "zod";
import {
  Report,
  ReportSchema,
  CreateReportInput,
  Status,
  Priority,
  AnalysisSource,
  AnalyzeResponse,
} from "./types";

const STORAGE_KEY = "campusdesk_records_live";
const SCHEMA_VERSION_KEY = "campusdesk_schema_v2";
const CURRENT_VERSION = "2.0.0";

/**
 * Generate unique report ID in CAM-YYYYMMDD-XXXX format
 */
export function generateReportId(existingIds: string[] = []): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const datePart = `${year}${month}${day}`;

  let candidate = "";
  let collision = true;
  let attempts = 0;

  while (collision && attempts < 100) {
    attempts++;
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let randomPart = "";
    for (let i = 0; i < 4; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    candidate = `CAM-${datePart}-${randomPart}`;
    collision = existingIds.some(
      (id) => id.toUpperCase() === candidate.toUpperCase()
    );
  }

  return candidate;
}

export const SEED_REPORTS: Report[] = [
  {
    id: "CAM-20261101-92A1",
    studentName: "Alex Rivera",
    category: "Classroom/Projector",
    location: "Science Block, Lecture Hall 301",
    title: "Projector bulb flickering violently during lecture",
    description: "The ceiling projector in LH 301 is flickering every few seconds and displaying purple distortion lines. Professor had to pause the slide presentation.",
    aiSummary: "Flickering projector and color distortion in LH 301 requiring AV lamp replacement.",
    priority: "Medium",
    suggestedDepartment: "Academic AV & Media Services",
    suggestedAction: "Standard service ticket routed for technician review within 4 business hours.",
    analysisSource: "ai",
    status: "In Progress",
    createdAt: "2026-11-01T09:15:00.000Z",
    updatedAt: "2026-11-01T11:30:00.000Z",
    history: [
      { status: "Submitted", at: "2026-11-01T09:15:00.000Z", note: "Report logged by Alex Rivera." },
      { status: "Under Review", at: "2026-11-01T10:00:00.000Z", note: "Reviewed by AV dispatch coordinator." },
      { status: "In Progress", at: "2026-11-01T11:30:00.000Z", note: "Technician Marcus assigned with replacement bulb." },
    ],
  },
  {
    id: "CAM-20261101-81B3",
    studentName: "Priya Sharma",
    category: "Wi-Fi/Internet",
    location: "Central Library, 2nd Floor Quiet Zone",
    title: "Campus-Secure-5G Wi-Fi dropping connection for everyone",
    description: "Entire 2nd floor silent study area cannot connect to Campus-Secure-5G. Over 50 students studying for upcoming finals are affected.",
    aiSummary: "High-impact Wi-Fi access point failure in Library Quiet Zone affecting multiple exam students.",
    priority: "High",
    suggestedDepartment: "Campus IT & Network Infrastructure",
    suggestedAction: "Priority work order created; network operations center alerted.",
    analysisSource: "rule-based",
    status: "Under Review",
    createdAt: "2026-11-01T10:45:00.000Z",
    updatedAt: "2026-11-01T11:00:00.000Z",
    history: [
      { status: "Submitted", at: "2026-11-01T10:45:00.000Z", note: "Escalated due to 'everyone' and 'finals' keywords." },
      { status: "Under Review", at: "2026-11-01T11:00:00.000Z", note: "Network engineering team verifying AP telemetry." },
    ],
  },
  {
    id: "CAM-20261101-44C9",
    studentName: "Jordan Hayes",
    category: "Electricity",
    location: "Engineering Hall West, Lab Room 104",
    title: "Exposed wire sparking behind power strip bench",
    description: "A heavy conduit cable has sheared insulation and produced visible sparks and faint smoke near workbench 4.",
    aiSummary: "Critical electrical safety risk: sparking exposed wire in engineering laboratory.",
    priority: "Critical",
    suggestedDepartment: "Electrical Maintenance Division",
    suggestedAction: "Immediate alert triggered to on-duty response team; emergency dispatch initiated.",
    analysisSource: "ai",
    status: "In Progress",
    createdAt: "2026-11-01T11:20:00.000Z",
    updatedAt: "2026-11-01T11:25:00.000Z",
    history: [
      { status: "Submitted", at: "2026-11-01T11:20:00.000Z", note: "Auto-classified Critical by AI & rule engine." },
      { status: "In Progress", at: "2026-11-01T11:25:00.000Z", note: "Facilities safety lead dispatched; bench circuit breaker tripped." },
    ],
  },
  {
    id: "CAM-20261031-18D2",
    studentName: "Marcus Chen",
    category: "Washroom/Cleanliness",
    location: "Student Center, Ground Floor B-Wing",
    title: "Sink faucet leaking water across hallway tiles",
    description: "One of the basin taps is broken and cannot shut off completely. Water is overflowing creating a slipping hazard.",
    aiSummary: "Active plumbing leak in Student Center ground floor causing slip hazard.",
    priority: "Medium",
    suggestedDepartment: "Facilities & Janitorial Services",
    suggestedAction: "Standard work order queued for plumbing repair and cleanup.",
    analysisSource: "rule-based",
    status: "Resolved",
    createdAt: "2026-10-31T14:10:00.000Z",
    updatedAt: "2026-10-31T16:45:00.000Z",
    history: [
      { status: "Submitted", at: "2026-10-31T14:10:00.000Z" },
      { status: "In Progress", at: "2026-10-31T14:35:00.000Z", note: "Janitorial placed caution cone and shut water valve." },
      { status: "Resolved", at: "2026-10-31T16:45:00.000Z", note: "Replaced cartridge valve and dried flooring." },
    ],
  },
  {
    id: "CAM-20261031-62E4",
    studentName: "Emily Watson",
    category: "Campus Safety",
    location: "South Perimeter Walkway, Near Gate 4",
    title: "Streetlamp completely dark on pathway to dorms",
    description: "The three successive lampposts past the tennis court are not turning on at night, leaving the entire walking path in pitch black darkness.",
    aiSummary: "Safety hazard: dark unlit walkway on nocturnal student transit route.",
    priority: "High",
    suggestedDepartment: "Campus Safety & Security Office",
    suggestedAction: "Priority work order created; campus safety patrol advised.",
    analysisSource: "rule-based",
    status: "In Progress",
    createdAt: "2026-10-31T20:30:00.000Z",
    updatedAt: "2026-11-01T08:15:00.000Z",
    history: [
      { status: "Submitted", at: "2026-10-31T20:30:00.000Z" },
      { status: "Under Review", at: "2026-10-31T21:00:00.000Z", note: "Night security notified to increase patrols." },
      { status: "In Progress", at: "2026-11-01T08:15:00.000Z", note: "Electricians scheduled to replace ballasts." },
    ],
  },
  {
    id: "CAM-20261030-77F8",
    studentName: "David Kim",
    category: "Fan/AC",
    location: "Lecture Theater 104",
    title: "Ceiling fan making loud grinding noise",
    description: "The middle ceiling fan is making a repetitive metal grinding sound. Not dangerous, but very distracting for professors and students.",
    aiSummary: "Mechanical noise from ceiling fan in Lecture Theater 104.",
    priority: "Low",
    suggestedDepartment: "HVAC & Mechanical Maintenance",
    suggestedAction: "Routine maintenance ticket scheduled during normal operating hours.",
    analysisSource: "rule-based",
    status: "Submitted",
    createdAt: "2026-10-30T13:00:00.000Z",
    updatedAt: "2026-10-30T13:00:00.000Z",
    history: [
      { status: "Submitted", at: "2026-10-30T13:00:00.000Z", note: "Ticket queued for next routine facilities inspection." },
    ],
  },
  {
    id: "CAM-20261030-33A5",
    studentName: "Chloe Dupont",
    category: "Transportation",
    location: "West Gate Bus Loop",
    title: "Route A shuttle delayed over 40 minutes",
    description: "The 8:30 AM Route A bus failed to arrive, causing large queue of over 60 students at the West Gate terminal.",
    aiSummary: "Transportation delay on Route A loop during peak morning rush.",
    priority: "Medium",
    suggestedDepartment: "Campus Fleet & Logistics",
    suggestedAction: "Standard service ticket routed to fleet supervisor.",
    analysisSource: "ai",
    status: "Resolved",
    createdAt: "2026-10-30T08:50:00.000Z",
    updatedAt: "2026-10-30T10:15:00.000Z",
    history: [
      { status: "Submitted", at: "2026-10-30T08:50:00.000Z" },
      { status: "In Progress", at: "2026-10-30T09:05:00.000Z", note: "Spare bus 04 dispatched to relieve queue." },
      { status: "Resolved", at: "2026-10-30T10:15:00.000Z", note: "Primary bus tire puncture repaired; schedule normalized." },
    ],
  },
  {
    id: "CAM-20261029-59K7",
    studentName: "Tariq Mansoor",
    category: "Electricity",
    location: "Humanities Annex, Room 12",
    title: "Power outlet row completely dead before exam",
    description: "None of the wall outlets for laptops are working along the north wall. Entire class taking online midterm is concerned.",
    aiSummary: "Dead power outlets in examination room requiring circuit breaker reset.",
    priority: "High",
    suggestedDepartment: "Electrical Maintenance Division",
    suggestedAction: "Priority work order created; duty engineer notified.",
    analysisSource: "rule-based",
    status: "Resolved",
    createdAt: "2026-10-29T10:00:00.000Z",
    updatedAt: "2026-10-29T10:40:00.000Z",
    history: [
      { status: "Submitted", at: "2026-10-29T10:00:00.000Z", note: "Escalated by 'exam' rule." },
      { status: "In Progress", at: "2026-10-29T10:15:00.000Z", note: "Electrician inspected sub-panel in corridor." },
      { status: "Resolved", at: "2026-10-29T10:40:00.000Z", note: "Sub-panel breaker reset and load balanced." },
    ],
  },
  {
    id: "CAM-20261028-21M3",
    studentName: "Zoe Brooks",
    category: "Washroom/Cleanliness",
    location: "North Study Commons, 1st Floor Restroom",
    title: "Paper towel dispenser jammed and soap out",
    description: "Automatic paper towel dispenser has jammed paper and soap container is completely empty.",
    aiSummary: "Routine sanitation supplies restock request.",
    priority: "Low",
    suggestedDepartment: "Facilities & Janitorial Services",
    suggestedAction: "Routine maintenance ticket scheduled during normal operating hours.",
    analysisSource: "rule-based",
    status: "Resolved",
    createdAt: "2026-10-28T15:20:00.000Z",
    updatedAt: "2026-10-28T17:00:00.000Z",
    history: [
      { status: "Submitted", at: "2026-10-28T15:20:00.000Z" },
      { status: "Resolved", at: "2026-10-28T17:00:00.000Z", note: "Dispenser cleared and refills completed by cleaning staff." },
    ],
  },
  {
    id: "CAM-20261027-88P0",
    studentName: "Liam O'Connor",
    category: "Classroom/Projector",
    location: "Business Building, Room B202",
    title: "Bent pins on wall HDMI socket",
    description: "The HDMI input port on the classroom podium is physically bent and laptops cannot plug in without damaging their cables.",
    aiSummary: "Damaged HDMI socket on instructor podium in B202.",
    priority: "Low",
    suggestedDepartment: "Academic AV & Media Services",
    suggestedAction: "Routine maintenance ticket scheduled for hardware replacement.",
    analysisSource: "rule-based",
    status: "Under Review",
    createdAt: "2026-10-27T16:00:00.000Z",
    updatedAt: "2026-10-28T09:00:00.000Z",
    history: [
      { status: "Submitted", at: "2026-10-27T16:00:00.000Z" },
      { status: "Under Review", at: "2026-10-28T09:00:00.000Z", note: "Part ordered from university AV inventory." },
    ],
  },
];

/**
 * Repository interface for managing reports in localStorage
 */
class ReportRepository {
  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  }

  /**
   * Safe read from storage with validation and empty array default (manual input mode)
   */
  private readStorage(): Report[] {
    if (!this.isBrowser()) {
      return [];
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      // Validate each item defensively and strip old demo records
      const DEMO_IDS = ["CAM-20261101-92A1", "CAM-20261102-K49B", "CAM-20261102-A81F", "CAM-20261101-H18C"];
      const validatedReports: Report[] = [];
      for (const item of parsed) {
        const result = ReportSchema.safeParse(item);
        if (result.success && !DEMO_IDS.includes(result.data.id)) {
          validatedReports.push(result.data);
        }
      }

      return validatedReports;
    } catch (err) {
      console.error("Failed to read reports from storage:", err);
      return [];
    }
  }

  private writeStorage(reports: Report[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_VERSION);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
      window.dispatchEvent(new Event("campusdesk_storage_updated"));
    } catch (err) {
      console.error("Failed to write reports to storage:", err);
    }
  }

  /**
   * Clear all records and audit history
   */
  public clearAll(): void {
    this.writeStorage([]);
  }

  /**
   * Export all received reports and audit trail as Excel-compatible CSV
   */
  public exportCSV(): string {
    const reports = this.list();
    if (this.isBrowser() && reports.length === 0) {
      alert("No incident reports received yet to export. Please submit an issue report first.");
      return "";
    }
    const headers = [
      "Ticket ID",
      "Submission Timestamp",
      "Last Updated",
      "Student Name / ID",
      "Category",
      "Campus Location",
      "Incident Title",
      "Description",
      "Priority",
      "Assigned Department",
      "Automated Next Action",
      "Current Status",
      "Complete Audit History Log",
    ];

    const escapeCSV = (val: unknown) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = reports.map((r) => {
      const historyTrail = (r.history || [])
        .map(
          (h) =>
            `[${h.at ? new Date(h.at).toLocaleString() : ""}] ${h.status}${
              h.note ? " - Note: " + h.note : ""
            }`
        )
        .join(" | ");

      return [
        escapeCSV(r.id),
        escapeCSV(r.createdAt ? new Date(r.createdAt).toLocaleString() : ""),
        escapeCSV(
          r.updatedAt
            ? new Date(r.updatedAt).toLocaleString()
            : r.createdAt
            ? new Date(r.createdAt).toLocaleString()
            : ""
        ),
        escapeCSV(r.studentName || ""),
        escapeCSV(r.category || ""),
        escapeCSV(r.location || ""),
        escapeCSV(r.title || ""),
        escapeCSV(r.description || ""),
        escapeCSV(r.priority || ""),
        escapeCSV(r.suggestedDepartment || ""),
        escapeCSV(r.suggestedAction || ""),
        escapeCSV(r.status || ""),
        escapeCSV(historyTrail),
      ].join(",");
    });

    const csvString = "\uFEFF" + [headers.map(escapeCSV).join(","), ...rows].join("\r\n");
    if (this.isBrowser() && typeof document !== "undefined") {
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      const today = new Date().toISOString().slice(0, 10);
      downloadLink.setAttribute("href", downloadUrl);
      downloadLink.setAttribute("download", `CampusDesk_Audit_Export_${today}.csv`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);
    }
    return csvString;
  }

  /**
   * List all reports sorted newest first
   */
  public list(): Report[] {
    const reports = this.readStorage();
    return reports.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Lookup report by ID (case-insensitive)
   */
  public get(id: string): Report | null {
    if (!id) return null;
    const cleanId = id.trim().toUpperCase();
    const reports = this.readStorage();
    const found = reports.find((r) => r.id.toUpperCase() === cleanId);
    return found || null;
  }

  /**
   * Create a new report (supports either a pre-built Report or CreateReportInput + AnalyzeResponse)
   */
  public create(
    inputOrRecord: CreateReportInput | Report,
    analysis?: AnalyzeResponse
  ): Report {
    const existing = this.readStorage();
    if ("id" in inputOrRecord && !analysis) {
      const valid = ReportSchema.parse(inputOrRecord);
      const updated = [valid, ...existing];
      this.writeStorage(updated);
      return valid;
    }

    const input = inputOrRecord as CreateReportInput;
    const existingIds = existing.map((r) => r.id);
    const newId = generateReportId(existingIds);
    const now = new Date().toISOString();

    const newReport: Report = {
      id: newId,
      studentName: input.studentName,
      category: input.category,
      location: input.location,
      title: input.title,
      description: input.description,
      aiSummary: analysis?.summary || input.title,
      priority: analysis?.priority || "Medium",
      suggestedDepartment: analysis?.department || "General Operations",
      suggestedAction: analysis?.nextAction || "Queued for review.",
      analysisSource: analysis?.source || "rule-based",
      status: "Submitted",
      createdAt: now,
      updatedAt: now,
      history: [
        {
          status: "Submitted",
          at: now,
          note: `Report filed by ${input.studentName}. Analysis: ${analysis?.priority || "Medium"} priority, routed to ${analysis?.department || "General Operations"}.`,
        },
      ],
    };

    // Validate before saving
    const valid = ReportSchema.parse(newReport);
    const updated = [valid, ...existing];
    this.writeStorage(updated);
    return valid;
  }

  /**
   * Update report status with optional note
   */
  public updateStatus(id: string, newStatus: Status, note?: string): Report | null {
    const cleanId = id.trim().toUpperCase();
    const reports = this.readStorage();
    const index = reports.findIndex((r) => r.id.toUpperCase() === cleanId);
    if (index === -1) return null;

    const report = reports[index];
    const now = new Date().toISOString();

    const updatedReport: Report = {
      ...report,
      status: newStatus,
      updatedAt: now,
      history: [
        ...report.history,
        {
          status: newStatus,
          at: now,
          note: note || `Status changed to ${newStatus}`,
        },
      ],
    };

    reports[index] = ReportSchema.parse(updatedReport);
    this.writeStorage(reports);
    return reports[index];
  }

  /**
   * Override department, priority, or add custom admin note
   */
  public override(
    id: string,
    changes: {
      priority?: Priority;
      suggestedDepartment?: string;
      status?: Status;
      adminNote?: string;
      auditNote?: string;
    }
  ): Report | null {
    const cleanId = id.trim().toUpperCase();
    const reports = this.readStorage();
    const index = reports.findIndex((r) => r.id.toUpperCase() === cleanId);
    if (index === -1) return null;

    const report = reports[index];
    const now = new Date().toISOString();

    const historyItems = [...report.history];
    const notes: string[] = [];

    if (changes.priority && changes.priority !== report.priority) {
      notes.push(`Priority changed from ${report.priority} to ${changes.priority}`);
    }
    if (
      changes.suggestedDepartment &&
      changes.suggestedDepartment !== report.suggestedDepartment
    ) {
      notes.push(`Department re-routed to ${changes.suggestedDepartment}`);
    }
    if (changes.status && changes.status !== report.status) {
      notes.push(`Status updated to ${changes.status}`);
    }
    const noteText = changes.adminNote || changes.auditNote;
    if (noteText) {
      notes.push(`Staff note: ${noteText}`);
    }

    if (notes.length > 0) {
      historyItems.push({
        status: changes.status || report.status,
        at: now,
        note: notes.join(". "),
      });
    }

    const updated: Report = {
      ...report,
      priority: changes.priority || report.priority,
      suggestedDepartment:
        changes.suggestedDepartment || report.suggestedDepartment,
      status: changes.status || report.status,
      updatedAt: now,
      history: historyItems,
    };

    reports[index] = ReportSchema.parse(updated);
    this.writeStorage(reports);
    return reports[index];
  }

  /**
   * Reset repository to fresh demo seed data
   */
  public reset(): Report[] {
    this.writeStorage(SEED_REPORTS);
    return [...SEED_REPORTS];
  }
}

export const repository = new ReportRepository();
export const reportRepo = repository;


