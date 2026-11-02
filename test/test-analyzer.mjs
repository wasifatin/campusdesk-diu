import { runRuleBasedAnalysis, escalatePriority } from "../lib/rule-analyzer.js";

// Test 1: Category base priority
const test1 = runRuleBasedAnalysis({
  title: "Slow water drainage in restroom",
  category: "Washroom/Cleanliness",
  location: "Building C, 1st Floor",
  description: "Water is draining slowly from sink 2.",
});
console.log("Test 1 (Low base):", test1.priority === "Low" ? "PASS" : "FAIL", test1.priority);

// Test 2: Critical keyword escalation (fire/sparks)
const test2 = runRuleBasedAnalysis({
  title: "Sparks coming out of socket",
  category: "Electricity",
  location: "Lab 3",
  description: "Visible spark and smell of smoke near outlet.",
});
console.log("Test 2 (Critical keyword):", test2.priority === "Critical" ? "PASS" : "FAIL", test2.priority);

// Test 3: One-level escalation (exam)
const test3 = runRuleBasedAnalysis({
  title: "Wi-Fi is down during exam",
  category: "Wi-Fi/Internet",
  location: "Exam Hall A",
  description: "No connection for midterm exam.",
});
console.log("Test 3 (Escalate one: Med -> High):", test3.priority === "High" ? "PASS" : "FAIL", test3.priority);

// Test 4: Safety category base (High)
const test4 = runRuleBasedAnalysis({
  title: "Door lock broken on exterior door",
  category: "Campus Safety",
  location: "Dorm Entrance",
  description: "The exterior security door is not latching properly.",
});
console.log("Test 4 (Safety base High):", test4.priority === "High" ? "PASS" : "FAIL", test4.priority);

console.log("All rule analyzer unit checks passed!");

