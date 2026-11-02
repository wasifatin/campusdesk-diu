import { Category, Priority, AnalyzeResponse } from "./types";

export const CATEGORY_DEPARTMENT_MAP: Record<Category, string> = {
  "Classroom/Projector": "Academic AV & Media Services",
  "Wi-Fi/Internet": "Campus IT & Network Infrastructure",
  "Washroom/Cleanliness": "Facilities & Janitorial Services",
  "Fan/AC": "HVAC & Mechanical Maintenance",
  "Electricity": "Electrical Maintenance Division",
  "Transportation": "Campus Fleet & Logistics",
  "Campus Safety": "Campus Safety & Security Office",
  Other: "General Administration & Operations",
};

export const BASE_PRIORITY_MAP: Record<Category, Priority> = {
  "Campus Safety": "High",
  Electricity: "Medium",
  "Wi-Fi/Internet": "Medium",
  "Classroom/Projector": "Medium",
  Transportation: "Medium",
  "Fan/AC": "Low",
  "Washroom/Cleanliness": "Low",
  Other: "Low",
};

const CRITICAL_KEYWORDS = [
  "fire",
  "smoke",
  "sparks",
  "spark",
  "shock",
  "exposed wire",
  "injury",
  "threat",
  "harassment",
  "assault",
  "gas",
  "emergency",
];

const ESCALATE_ONE_KEYWORDS = [
  "exam",
  "entire building",
  "no power",
  "everyone",
  "flooding",
  "stuck",
];

const PRIORITY_ORDER: Priority[] = ["Low", "Medium", "High", "Critical"];

export function escalatePriority(current: Priority): Priority {
  const currentIndex = PRIORITY_ORDER.indexOf(current);
  if (currentIndex < PRIORITY_ORDER.length - 1) {
    return PRIORITY_ORDER[currentIndex + 1];
  }
  return current;
}

export function runRuleBasedAnalysis(params: {
  title: string;
  category: Category;
  location: string;
  description: string;
}): AnalyzeResponse {
  const { title, category, location, description } = params;
  const combinedText = `${title} ${description}`.toLowerCase();

  // 1. Base priority from category
  let priority: Priority = BASE_PRIORITY_MAP[category] || "Low";

  // 2. Check for one-level escalation
  const hasEscalateOne = ESCALATE_ONE_KEYWORDS.some((kw) =>
    combinedText.includes(kw)
  );
  if (hasEscalateOne) {
    priority = escalatePriority(priority);
  }

  // 3. Check for critical keywords (highest precedence)
  const hasCriticalKeyword = CRITICAL_KEYWORDS.some((kw) =>
    combinedText.includes(kw)
  );
  if (hasCriticalKeyword) {
    priority = "Critical";
  }

  // Department mapping
  const department =
    CATEGORY_DEPARTMENT_MAP[category] || "Campus Facilities Operations";

  // Determine standard next action based on priority
  let nextAction = "Routine maintenance ticket scheduled for department triage.";
  if (priority === "Critical") {
    nextAction =
      "Immediate alert triggered to on-duty response team; emergency dispatch initiated.";
  } else if (priority === "High") {
    nextAction =
      "Priority work order created; department supervisor notified within 1 business hour.";
  } else if (priority === "Medium") {
    nextAction =
      "Standard service ticket routed for technician review within 4 business hours.";
  }

  // Generate concise summary
  const cleanTitle = title.trim();
  const summary = `Report regarding "${cleanTitle}" located at ${location}. Categorized under ${category} with recommended routing to ${department}.`;

  return {
    summary,
    priority,
    department,
    nextAction,
    source: "rule-based",
    disclaimer: "Automated suggestion. Not a verified decision. Staff will review.",
  };
}

