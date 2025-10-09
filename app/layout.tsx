import "./globals.css";
import HeaderBar from "@/components/HeaderBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignalRadar – Early Signal Scanner",
  description: "Beginner-friendly crypto signal radar with risk and confidence."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <HeaderBar />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
