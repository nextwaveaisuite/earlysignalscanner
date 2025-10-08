import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Early Signal Scanner",
  description: "AI-powered microcap discovery for beginners",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
