import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { UserSync } from "@/components/auth/UserSync";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InboxIQ - AI-Powered Intelligent Email Triage & Routing System",
  description:
    "Industry-level autonomous email triage platform: Intent detection, sentiment analysis, urgency scoring, security threat containment, multi-tone smart replies, and SLA analytics.",
  keywords: [
    "AI Email Triage",
    "Email Routing System",
    "Autonomous Email AI",
    "Gemini Email Classifier",
    "Enterprise Email Triage",
    "SLA Email Intelligence",
  ],
  authors: [{ name: "InboxIQ Enterprise Operations" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans">
          <UserSync />
          {children}
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: "#18181B",
                border: "1px solid #27272A",
                color: "#F8FAFC",
                borderRadius: "0.75rem",
                fontSize: "12px",
              },
            }}
            richColors
            closeButton
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
