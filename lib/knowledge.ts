/**
 * SAMPLE CAMPUS KNOWLEDGE BASE
 * Disclaimer: All data below is fictional sample data for demonstration purposes.
 * Fake phone extensions and sample campus locations are used.
 */

export interface FAQItem {
  id: string;
  category: string;
  keywords: string[];
  question: string;
  answer: string;
  suggestionChips?: string[];
}

export const CAMPUS_KNOWLEDGE_SUMMARY = `
CampusDesk Grounded Knowledge Base (SAMPLE DATA ONLY):
- University: Metropolitan Central University (Demo Campus)
- Emergency Security: Ext 555-0911 (Building S, 24/7 Dispatch)
- Campus Medical Center: Ext 555-0112 (East Wing, Mon-Fri 8am-8pm, On-call doctor 24/7)
- Facilities & Maintenance: Ext 555-0150 (Ground Floor, Works Dept, Mon-Sat 7am-7pm)
- IT Support & Network Services: Ext 555-0199 (Tech Hub Room 102, Mon-Fri 8am-6pm, it-helpdesk@demo-campus.edu)
- Dean of Students / Student Affairs: Ext 555-0100 (Admin Tower Level 3, Mon-Fri 9am-5pm)

Key Facilities & Schedules:
1. Central Library:
   - Regular Hours: Mon-Fri 8:00 AM - 10:00 PM; Sat-Sun 10:00 AM - 6:00 PM.
   - 24/7 Study Commons: Located on Level 1, requires student RFID tap after 10 PM.
   - Borrowing policy: Up to 5 books for undergraduates for 14 days; self-checkout kiosks near entrance.

2. Campus Wi-Fi & Internet:
   - Primary Network: 'Campus-Secure-5G' (WPA3-Enterprise, login using Student ID and university portal password).
   - Guest Network: 'Campus-Guest' (Rate-limited, requires SMS or email OTP confirmation).
   - Trouble connecting: Forget network, restart device, or visit IT Helpdesk in Tech Hub 102.

3. Classroom & AV Facilities:
   - Projector remotes and HDMI adapters are stored in the locked lectern; keys are signed out from the Floor Warden's station.
   - To report broken AV, projector lamps, or audio systems, submit a report via CampusDesk under 'Classroom/Projector'.

4. Transportation & Shuttle Loop:
   - Route A (Express): West Gate <-> Central Quad <-> Sports Complex. Departs every 15 minutes (7:30 AM - 8:30 PM).
   - Route B (Residential): Dorm Village <-> Science Block <-> South Library. Departs every 20 minutes (7:30 AM - 9:00 PM).
   - Night Owl Shuttle: Hourly between 9:00 PM and midnight from Central Quad.
   - All campus shuttles are free for students with valid student ID.

5. How to File Complaints & Issue Lifecycle:
   - Step 1: Submit an issue via CampusDesk with category, location, and description.
   - Step 2: Automated priority analysis triages report to the responsible department within 4 business hours.
   - Step 3: Work order assigned (Status: In Progress) and technicians dispatched.
   - Step 4: Resolution verification and status changed to 'Resolved'.
   - For urgent safety threats (fire, live wires, harassment), immediately dial Campus Security (Ext 555-0911).
`;

export const FAQ_DATABASE: FAQItem[] = [
  {
    id: "library-hours",
    category: "Library",
    keywords: ["library", "hours", "timing", "open", "close", "study", "books", "borrow"],
    question: "What are the Central Library hours and borrowing rules?",
    answer: "The Central Library is open Mon-Fri from 8:00 AM to 10:00 PM, and Sat-Sun from 10:00 AM to 6:00 PM. The Level 1 Study Commons is open 24/7 (tap your student ID card after 10 PM). Students may borrow up to 5 books for 14 days.",
    suggestionChips: ["Where is the 24/7 study area?", "How do I connect to Wi-Fi?", "Report a facility issue"],
  },
  {
    id: "wifi-connect",
    category: "IT / Wi-Fi",
    keywords: ["wifi", "wi-fi", "internet", "network", "connect", "password", "ssid", "slow"],
    question: "How do I connect to the campus Wi-Fi network?",
    answer: "Connect to 'Campus-Secure-5G' and log in with your Student ID and University portal password. For visitors, 'Campus-Guest' provides 4 hours of access with phone OTP. If connection drops, visit IT Support in Tech Hub 102 (Ext 555-0199).",
    suggestionChips: ["Report Wi-Fi outage", "IT Helpdesk hours", "Library hours"],
  },
  {
    id: "classroom-av",
    category: "Classrooms",
    keywords: ["classroom", "projector", "hdmi", "screen", "audio", "mic", "lectern", "remote", "lecture"],
    question: "How do I get a projector remote or fix classroom AV equipment?",
    answer: "Lectern keys and projector remotes are kept at the Floor Warden's desk on each floor. If a projector lamp or sound system fails during class, please submit a quick report under 'Classroom/Projector' or call Facilities Dispatch at Ext 555-0150.",
    suggestionChips: ["Report broken projector", "How does issue reporting work?", "Campus contacts"],
  },
  {
    id: "shuttle-transport",
    category: "Transportation",
    keywords: ["shuttle", "bus", "transport", "route", "timing", "schedule", "commute", "dorm", "night owl"],
    question: "What is the campus shuttle bus schedule?",
    answer: "Shuttles run daily! Route A (Central Quad <-> West Gate) runs every 15 mins from 7:30 AM to 8:30 PM. Route B (Dorm Village <-> Science Block) runs every 20 mins. The Night Owl shuttle runs hourly from 9:00 PM to midnight. Free with Student ID!",
    suggestionChips: ["Where are the shuttle stops?", "Campus safety contacts", "Library hours"],
  },
  {
    id: "complaint-process",
    category: "Complaints & Grievances",
    keywords: ["complaint", "issue", "report", "process", "track", "grievance", "timeline", "how to"],
    question: "How do I report an issue and track its resolution?",
    answer: "Click 'Report Issue' in the top menu, fill in your details and problem description. Our automated engine analyzes priority and assigns it to Facilities, IT, or Safety. You will receive a tracking ID (CAM-YYYYMMDD-XXXX) to monitor live status on the 'Track' page.",
    suggestionChips: ["Report an issue now", "Track an existing issue", "Emergency contacts"],
  },
  {
    id: "emergency-safety",
    category: "Safety & Emergency",
    keywords: ["emergency", "safety", "security", "fire", "danger", "police", "guard", "medical", "ambulance", "threat", "harassment"],
    question: "Who do I contact in case of an immediate campus emergency?",
    answer: "For immediate safety threats, fire, medical emergencies, or security incidents, dial Campus Security 24/7 Dispatch at Ext 555-0911 or the Campus Health Center at Ext 555-0112 immediately. For routine maintenance or non-urgent repairs, please use our Report form.",
    suggestionChips: ["Campus emergency numbers", "Report safety hazard", "Health center location"],
  },
  {
    id: "ac-electricity",
    category: "Facilities",
    keywords: ["ac", "air condition", "fan", "power", "electricity", "socket", "light", "plug", "blackout", "cold", "hot"],
    question: "How do I report air conditioning or electrical faults?",
    answer: "Use our Report Issue form under category 'Fan/AC' or 'Electricity'. For building-wide blackouts or sparking sockets, our system escalates the issue to Critical priority automatically.",
    suggestionChips: ["Report electrical issue", "Facilities contact number", "Track an issue"],
  },
  {
    id: "contacts-directory",
    category: "Contacts",
    keywords: ["contact", "phone", "number", "email", "office", "directory", "call", "extension"],
    question: "What are the essential campus emergency and service contacts?",
    answer: "Essential Campus Contacts (Sample Exts):\n• Security Dispatch: Ext 555-0911 (24/7)\n• Medical Clinic: Ext 555-0112 (East Wing)\n• Facilities Maintenance: Ext 555-0150\n• IT Helpdesk: Ext 555-0199\n• Dean of Students Office: Ext 555-0100",
    suggestionChips: ["How to file a report", "Library hours", "Wi-Fi setup"],
  },
];

