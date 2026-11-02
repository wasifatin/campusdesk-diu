"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

export function Banner() {
  return (
    <div
      role="region"
      aria-label="Demo Disclaimer Banner"
      className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 dark:text-amber-200 px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 text-center"
    >
      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" aria-hidden="true" />
      <span>
        <strong>Notice:</strong> Sample data and demo features. Not an official university system.
      </span>
    </div>
  );
}

