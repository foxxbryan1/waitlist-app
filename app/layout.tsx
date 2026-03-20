import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Launchly — AI Marketing on Autopilot",
  description: "Join the Launchly waitlist for early access to AI-powered marketing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
