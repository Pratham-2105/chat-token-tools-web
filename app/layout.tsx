// app/layout.tsx
import "./globals.css";
import React from "react";
import Topbar from "./components/Topbar";

export const metadata = {
  title: "Chat Token Tools",
  description: "Token Estimator & Chunker — privacy-first tooling for long chats",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-indigo-300/30 via-purple-300/20 to-pink-300/30 dark:from-indigo-900/40 dark:via-purple-900/30 dark:to-black/40 text-gray-900 dark:text-gray-100">
        <Topbar />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
