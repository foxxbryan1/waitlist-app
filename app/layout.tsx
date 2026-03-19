import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waitlist App",
  description: "Join our waitlist to get early access.",
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
