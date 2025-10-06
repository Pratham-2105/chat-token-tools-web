"use client";

import React, { useRef, useState, useCallback } from "react";

export default function ChunkerPage() {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileMeta, setFileMeta] = useState<{
    name: string;
    size: number;
    words?: number;
    estimatedTokens?: number;
    textPreview?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const MAX_BYTES = 30 * 1024 * 1024; // 30MB
  const ACCEPTED = [".txt", ".docx"];

  // --- Updated estimation logic (same as your Java tool) ---
  const estimateTokensFromText = (text: string) => {
    const cleanText = text.trim();
    if (!cleanText) return { words: 0, tokens: 0 };

    const words = cleanText.split(/\s+/).length;
    const charCount = cleanText.length;

    // Conservative heuristic: use whichever is higher
    const tokenByWords = Math.round(words * 1.33);
    const tokenByChars = Math.round(charCount / 4);

    const estimatedTokens = Math.max(tokenByWords, tokenByChars);
    return { words, tokens: estimatedTokens };
  };

  const handleFile = useCallback(async (file: File | null) => {
    setError(null);
    setFileMeta(null);
    if (!file) return;

    const ext = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
    const hasValidExt = ACCEPTED.includes(`.${ext}`);
    if (!hasValidExt) {
      setError("Unsupported file type — only .txt and .docx allowed.");
      return;
    }

    if (file.size > MAX_BYTES) {
      setError("File is too large — max 30MB allowed.");
      return;
    }

    const meta: {
      name: string;
      size: number;
      words?: number;
      estimatedTokens?: number;
      textPreview?: string;
    } = { name: file.name, size: file.size };

    if (file.name.toLowerCase().endsWith(".txt")) {
      try {
        const text = await file.text();
        const { words, tokens } = estimateTokensFromText(text);
        meta.words = words;
        meta.estimatedTokens = tokens;
        meta.textPreview = text.slice(0, 8000);
      } catch {
        setError("Failed to read .txt file.");
        return;
      }
    } else {
      meta.textPreview = undefined;
      meta.estimatedTokens = undefined;
      meta.words = undefined;
    }

    setFileMeta(meta);
  }, []);

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    handleFile(f);
    // reset value so same file can be picked again if needed
    e.currentTarget.value = "";
  };

  const openFilePicker = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  // --- Drag & Drop handling ---
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragging) setDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    if (!f) {
      setError("No file dropped.");
      return;
    }
    await handleFile(f);
  };

  const humanFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] px-4 sm:px-6 lg:px-8">
      {/* Glassy background overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl backdrop-saturate-150 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 py-12 relative z-10">
        {/* Sidebar placeholder (to remove later) */}
        <aside className="col-span-12 lg:col-span-3 xl:col-span-2 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl shadow-sm p-4 hidden lg:block">
          <h2 className="text-sm font-semibold mb-2">Sidebar</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Placeholder for navigation or file info
          </p>
        </aside>

        {/* Main upload area */}
        <section className="col-span-12 lg:col-span-6 xl:col-span-7">
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            role="button"
            tabIndex={0}
            aria-label="File upload drop zone"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openFilePicker();
              }
            }}
            className={`h-[70vh] flex flex-col justify-center items-center rounded-2xl border-2 border-dashed px-6 py-8 ${
              dragging
                ? "border-indigo-400 bg-white/30 dark:bg-white/20"
                : "border-white/30 bg-white/20 dark:bg-white/10"
            } hover:bg-white/30 dark:hover:bg-white/20 transition-all cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400`}
          >
            {/* Top instruction */}
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 select-none text-center">
              {dragging ? "Drop file to upload" : "Drag and drop your file here"}
            </p>

            {/* Button directly under the instruction */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={openFilePicker}
                className="px-4 py-2 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-md shadow-md hover:shadow-lg hover:-translate-y-[1px] active:translate-y-[1px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-pointer select-none"
              >
                Browse Files
              </button>

              {/* Supported text right beneath the button */}
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Supported: .txt, .docx • max 30MB
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.docx"
              className="hidden"
              onChange={onFileInputChange}
            />

            {/* Feedback section - placed directly below the controls */}
            <div className="mt-6 w-full px-6">
              {error && (
                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 rounded-md p-3">
                  {error}
                </div>
              )}

              {!error && fileMeta && (
                <div className="rounded-md border border-white/10 bg-white/5 p-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{fileMeta.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {humanFileSize(fileMeta.size)}
                        {fileMeta.words !== undefined &&
                          fileMeta.estimatedTokens !== undefined && (
                            <>
                              {" "}
                              • {fileMeta.words} words • ≈{" "}
                              {fileMeta.estimatedTokens} tokens
                            </>
                          )}
                      </div>
                    </div>

                    <button
                      onClick={async () => {
                        if (!fileMeta) return;
                        if (fileMeta.textPreview !== undefined) {
                          const blob = new Blob([fileMeta.textPreview], {
                            type: "text/plain",
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = fileMeta.name;
                          a.click();
                          URL.revokeObjectURL(url);
                        } else {
                          setError(
                            ".docx download not available client-side (parsing not implemented)."
                          );
                          setTimeout(() => setError(null), 3000);
                        }
                      }}
                      className="px-3 py-1 rounded-md text-xs border border-white/10 hover:bg-white/10 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                    >
                      Download preview
                    </button>
                  </div>

                  {fileMeta.textPreview ? (
                    <div className="mt-3 max-h-36 overflow-auto text-xs bg-white/10 p-2 rounded-md border border-white/5">
                      <pre className="whitespace-pre-wrap">
                        {fileMeta.textPreview}
                      </pre>
                    </div>
                  ) : (
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      No preview available for this file type yet.
                    </div>
                  )}
                </div>
              )}

              {/* Remove file action (only show when a file is selected) */}

              {fileMeta && (
                <div className="mt-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setFileMeta(null);
                      setError(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
              }}
                className="text-xs text-red-500 hover:text-red-600 active:text-red-700 flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                aria-label="Remove selected file">
                    <span className="text-sm">❌</span>
                    <span>Remove file</span>
                  </button>
                </div>
            )}


              {!error && !fileMeta && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  No file selected yet.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right info panel */}
        <aside className="col-span-12 lg:col-span-3 xl:col-span-3 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl shadow-sm p-4">
          <div className="space-y-6">
            <div className="border-b border-white/20 pb-4">
              <h2 className="text-sm font-semibold mb-2">Model Info</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Choose Free or Paid to view model token limits.
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold mb-2">Token Settings</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Configure chunk size, buffer, and overlap here.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
