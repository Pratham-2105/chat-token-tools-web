"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function EstimatorPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);

  // Simulate token estimation
  const handleEstimate = () => {
    if (!text.trim()) {
      setResult("Please enter or upload some text first.");
      return;
    }

    // Basic token estimation placeholder: assume ~0.75 tokens per word
    const words = text.trim().split(/\s+/).length;
    const tokens = Math.round(words * 0.75);

    setResult(`Approximate tokens: ${tokens} (based on ${words} words)`);
  };

  // Load a sample text
  const handleLoadSample = () => {
    const sample = `Large language models process text as tokens, not words. Tokens can be as short as one character or as long as one word. The Chat Token Tools app helps you estimate token usage for your text before sending it to an API.`;
    setText(sample);
    setResult(null);
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] px-4 sm:px-6 lg:px-8">
      {/* Frosted overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl backdrop-saturate-150 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 py-12 relative z-10">
        {/* Sidebar (placeholder for now) */}
        <aside className="col-span-12 lg:col-span-3 xl:col-span-2 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl shadow-sm p-4 hidden lg:block">
          <h2 className="text-sm font-semibold mb-2">Estimator Sidebar</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Quick links, presets, or recent estimations.
          </p>
        </aside>

        {/* Main estimator area */}
        <main className="col-span-12 lg:col-span-6 xl:col-span-7">
          <div className="bg-white/30 dark:bg-white/5 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-xl p-8">
            {/* Header */}
            <header className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">Token Estimator</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Paste text or upload a .txt/.docx to estimate approximate tokens for popular models.
                </p>
              </div>
              <div className="hidden sm:block">
                <Link
                  href="/"
                  className="text-xs px-3 py-2 rounded-md hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  ← Back to home
                </Link>
              </div>
            </header>

            {/* Input section */}
            <section className="mt-6 space-y-4">
              <div className="rounded-md border border-white/20 bg-white/10 p-4 flex flex-col">
                <label className="text-xs font-medium mb-2">Input text</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste or type your text here..."
                  className="w-full h-48 resize-none bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 outline-none border-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-md p-2 cursor-text"
                ></textarea>

                {/* File upload */}
                <div className="mt-3 flex items-center justify-between">
                  <label
                    htmlFor="fileInput"
                    className="text-xs text-indigo-400 cursor-pointer hover:underline select-none"
                  >
                    Upload .txt / .docx
                  </label>
                  <input
                    id="fileInput"
                    type="file"
                    accept=".txt,.docx"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (file.name.endsWith(".txt")) {
                        const content = await file.text();
                        setText(content);
                        setResult(null);
                      } else if (file.name.endsWith(".docx")) {
                        setResult("⚠️ .docx support coming soon (via mammoth).");
                      }
                    }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleEstimate}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md hover:shadow-lg hover:-translate-y-[1px] active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-all duration-200 cursor-pointer select-none"
                >
                  Estimate tokens
                </button>

                <button
                  onClick={handleLoadSample}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-white/20 bg-white/10 text-sm hover:bg-white/20 hover:-translate-y-[1px] active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-all duration-200 cursor-pointer select-none"
                >
                  Load sample text
                </button>
              </div>

              {/* Results */}
              <div className="rounded-md border border-white/20 bg-white/5 p-4">
                <h3 className="text-sm font-semibold mb-2">Estimated results</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {result
                    ? result
                    : "No data yet — run an estimation to see tokens per model and suggested chunk sizes."}
                </p>
              </div>
            </section>
          </div>
        </main>

        {/* Right panel (model presets/info) */}
        <aside className="col-span-12 lg:col-span-3 xl:col-span-3 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl shadow-sm p-4">
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold mb-2">Model Presets</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Select a model to see recommended token limits.
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold mb-2">Estimator Settings</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Word/token heuristics, include/exclude whitespace, etc.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
