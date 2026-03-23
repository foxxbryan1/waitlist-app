import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

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
      <body className="bg-[#0d0d12] text-gray-900 antialiased">
        <Navbar />
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}
