// app/estimator/page.tsx
import React from "react";
import Link from "next/link";

export default function EstimatorPage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] px-4 sm:px-6 lg:px-8">
      {/* Frosted overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl backdrop-saturate-150 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 py-12 relative z-10">
        {/* Sidebar (placeholder) */}
        <aside className="col-span-12 lg:col-span-3 xl:col-span-2 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl shadow-sm p-4 hidden lg:block">
          <h2 className="text-sm font-semibold mb-2">Estimator Sidebar</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Quick links, presets, or recent estimations.
          </p>
        </aside>

        {/* Main estimator area */}
        <main className="col-span-12 lg:col-span-6 xl:col-span-7">
          <div className="bg-white/30 dark:bg-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-xl p-8">
            <header className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">Token Estimator</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Paste text or upload a .txt/.docx to estimate approximate tokens for popular models.
                </p>
              </div>
              <div className="hidden sm:block">
                <Link href="/" className="text-xs px-3 py-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  ← Back to home
                </Link>
              </div>
            </header>

            <section className="mt-6 space-y-4">
              {/* Input area placeholder */}
              <div className="rounded-md border border-white/20 bg-white/10 p-4 min-h-[180px] flex flex-col">
                <label className="text-xs font-medium mb-2">Input text</label>
                <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                  {/* Replace with a textarea / upload component later */}
                  <div className="h-full w-full flex items-center justify-center opacity-70 select-none">
                    Paste text here or upload a .txt/.docx (component pending)
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="inline-flex items-center px-4 py-2 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  Estimate tokens
                </button>

                <button className="inline-flex items-center px-4 py-2 rounded-md border border-white/20 bg-white/10 text-sm hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  Load sample text
                </button>
              </div>

              {/* Results preview placeholder */}
              <div className="rounded-md border border-white/20 bg-white/5 p-4">
                <h3 className="text-sm font-semibold mb-2">Estimated results</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">No data yet — run an estimation to see tokens per model and suggested chunk sizes.</p>
              </div>
            </section>
          </div>
        </main>

        {/* Right panel (model presets/info) */}
        <aside className="col-span-12 lg:col-span-3 xl:col-span-3 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl shadow-sm p-4">
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold mb-2">Model Presets</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">Select a model to see recommended token limits.</p>
            </div>

            <div>
              <h2 className="text-sm font-semibold mb-2">Estimator Settings</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">Word/token heuristics, include/exclude whitespace, etc.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
