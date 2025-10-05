// components/Topbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Topbar() {
  const pathname = usePathname() || "/";

  // Right-side link logic
  const rightLink =
    pathname === "/estimator"
      ? { href: "/chunker", label: "Token Chunker" }
      : pathname === "/chunker"
      ? { href: "/estimator", label: "Token Estimator" }
      : null;

  // Landing page centers logo
  const containerJustify =
    pathname === "/" ? "justify-center" : "justify-between";

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-xl dark:bg-black/30 border-b border-white/10 shadow-sm z-40 transition-all">
      <div
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center ${containerJustify}`}
      >
        {/* Logo + Title */}
        <Link
          href="/"
          aria-label="Chat Token Tools home"
          className="flex items-center gap-3 rounded-md select-none cursor-pointer group 
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 
                     transition-all duration-200"
        >
          <div
            className="w-9 h-9 rounded-md bg-gradient-to-br from-indigo-500 to-violet-500 
                       flex items-center justify-center text-white font-semibold shadow-md 
                       transform transition-transform duration-200 group-hover:scale-105 
                       active:scale-95"
          >
            CT
          </div>
          <h1
            className="text-lg font-semibold drop-shadow-sm transition-colors duration-200 
                       group-hover:text-indigo-400"
          >
            Chat Token Tools
          </h1>
        </Link>

        {/* Right navigation link */}
        {rightLink ? (
          <nav className="flex items-center gap-3">
            <Link
              href={rightLink.href}
              className="text-sm px-3 py-2 rounded-md border border-white/10 bg-transparent 
                         hover:bg-white/10 hover:border-white/20 
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400
                         transition-all duration-200"
            >
              {rightLink.label}
            </Link>
          </nav>
        ) : (
          <div aria-hidden className="hidden lg:block" />
        )}
      </div>
    </header>
  );
}
