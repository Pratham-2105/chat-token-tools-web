"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  // Example of programmatic navigation (not required right now)
  const goToChunker = () => {
    // You can add animations, analytics, or pre-checks here later
    router.push("/chunker");
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] relative z-10">
      {/* Frosted overlay (visual) */}
      <div className="absolute inset-0 pointer-events-none backdrop-blur-2xl backdrop-saturate-150"></div>

      {/* Main layout grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="w-full grid grid-cols-12 gap-6 items-center">

          {/* Sidebar placeholder */}
          <aside className="col-span-12 lg:col-span-2 xl:col-span-3" aria-hidden>
            <div className="h-[60vh] hidden lg:flex items-center justify-center select-none opacity-80">
              <div className="text-center">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Tooling for large-chat workflows
                </p>
                <p className="mt-4 text-xs text-gray-600 dark:text-gray-400">
                  Files kept for 1 hour • 30MB max
                </p>
              </div>
            </div>
          </aside>

          {/* Center content */}
          <section className="col-span-12 lg:col-span-8 xl:col-span-6 flex items-center justify-center">
            <div className="w-full max-w-xl bg-white/30 dark:bg-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome — choose a tool</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                Estimate tokens quickly or split large files into model-friendly chunks.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Token Estimator Button */}
                <Link
                  href="/estimator"
                  className="block py-3 px-4 rounded-lg border border-white/30 bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  <div className="text-lg font-medium">Token Estimator</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Quick counts & model fit
                  </div>
                </Link>

                {/* Chunker Button — Link OR Programmatic navigation */}
                <button
                  onClick={goToChunker}
                  className="block w-full py-3 px-4 rounded-lg border border-transparent hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gradient-to-br from-indigo-500 to-violet-600 text-white transition-all"
                >
                  <div className="text-lg font-medium">Chunker</div>
                  <div className="text-xs text-white/90 mt-1">
                    Split files & download ZIP
                  </div>
                </button>

                {/* Alternatively, you can use this simpler Link version instead:
                <Link
                  href="/chunker"
                  className="block py-3 px-4 rounded-lg border border-transparent hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gradient-to-br from-indigo-500 to-violet-600 text-white transition-all"
                >
                  <div className="text-lg font-medium">Chunker</div>
                  <div className="text-xs text-white/90 mt-1">
                    Split files & download ZIP
                  </div>
                </Link>
                */}
              </div>

              <p className="mt-6 text-xs text-gray-600 dark:text-gray-400">
                Built for privacy — files are stored temporarily and auto-deleted.
              </p>
            </div>
          </section>

          {/* Right column placeholder */}
          <div className="col-span-12 lg:col-span-2 xl:col-span-3 hidden lg:flex items-center justify-center">
            <div className="text-center text-sm text-gray-700 dark:text-gray-300">
              <p className="font-medium">Quick links</p>
              <p className="mt-2 opacity-80">Estimator • Chunker • Docs</p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-gray-600 dark:text-gray-400 pb-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Chat Token Tools — privacy-first • MIT
        </div>
      </footer>
    </div>
  );
}
