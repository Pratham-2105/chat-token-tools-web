// components/Topbar.tsx
import Link from "next/link";
import React from "react";

export default function Topbar() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/20 backdrop-blur-xl dark:bg-black/30 border-b border-white/10 shadow-sm z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-semibold shadow-md">
            CT
          </div>
          <h1 className="text-lg font-semibold">Chat Token Tools</h1>
        </div>

        <nav className="flex items-center gap-3">
          <Link href="/estimator" className="text-sm px-3 py-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            Token Estimator
          </Link>
        </nav>
      </div>
    </header>
  );
}
