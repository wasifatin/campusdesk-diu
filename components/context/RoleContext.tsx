"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "student" | "admin";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  toggleRole: () => void;
  isAdmin: boolean;
}

const RoleContext = createContext<RoleContextType>({
  role: "student",
  setRole: () => {},
  toggleRole: () => {},
  isAdmin: false,
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("student");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("campusdesk_demo_role");
      if (saved === "admin" || saved === "student") {
        setRoleState(saved);
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    try {
      localStorage.setItem("campusdesk_demo_role", newRole);
    } catch {
      // ignore
    }
  };

  const toggleRole = () => {
    const next = role === "student" ? "admin" : "student";
    setRole(next);
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        toggleRole,
        isAdmin: role === "admin",
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}

