import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RoleProvider } from "@/components/context/RoleContext";
import { AppShell } from "@/components/layout/AppShell";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "CampusDesk - AI-Driven Campus Assistant",
  description:
  "Central campus operations help desk: conversational AI assistant, automated priority triage, report tracking, and facilities audit management.",
  icons: {
    icon: "/logo-dark.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <html lang="en" data-theme="light">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap"
        rel="stylesheet"
      />
    </head>
    <body style={{ margin: 0, padding: 0 }}>
      <RoleProvider>
        <AppShell>{children}</AppShell>
      </RoleProvider>
    </body>
  </html>
  );
}
