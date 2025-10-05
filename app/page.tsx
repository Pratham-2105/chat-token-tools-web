// app/page.tsx
import React from "react";
import Link from "next/link";

export default function Page() {
  return (
<<<<<<< HEAD
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
        width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>
=======
    <div className="min-h-[calc(100vh-5rem)] relative z-10">
      {/* Frosted overlay (visual) */}
      <div className="absolute inset-0 pointer-events-none backdrop-blur-2xl backdrop-saturate-150"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="w-full grid grid-cols-12 gap-6 items-center">

          {/* Sidebar placeholder */}
          <aside className="col-span-12 lg:col-span-2 xl:col-span-3" aria-hidden>
            <div className="h-[60vh] hidden lg:flex items-center justify-center select-none opacity-80">
              <div className="text-center">
                <p className="text-sm text-gray-700 dark:text-gray-300">Tooling for large-chat workflows</p>
                <p className="mt-4 text-xs text-gray-600 dark:text-gray-400">Files kept for 1 hour • 30MB max</p>
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
                <Link href="/estimator" className="block py-3 px-4 rounded-lg border border-white/30 bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  <div className="text-lg font-medium">Token Estimator</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Quick counts & model fit</div>
                </Link>

                <Link href="/chunker" className="block py-3 px-4 rounded-lg border border-transparent hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gradient-to-br from-indigo-500 to-violet-600 text-white transition-all">
                  <div className="text-lg font-medium">Chunker</div>
                  <div className="text-xs text-white/90 mt-1">Split files & download ZIP</div>
                </Link>
              </div>

              <p className="mt-6 text-xs text-gray-600 dark:text-gray-400">Built for privacy — files are stored temporarily and auto-deleted.</p>
            </div>
          </section>

          {/* Right column placeholder */}
          <div className="col-span-12 lg:col-span-2 xl:col-span-3 hidden lg:flex items-center justify-center">
            <div className="text-center text-sm text-gray-700 dark:text-gray-300">
              <p className="font-medium">Quick links</p>
              <p className="mt-2 opacity-80">Estimator • Chunker • Docs</p>
            </div>
          </div>
>>>>>>> 5b496ec (Add base layout and landing page)

        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-gray-600 dark:text-gray-400 pb-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">© {new Date().getFullYear()} Chat Token Tools — privacy-first • MIT</div>
      </footer>
    </div>
  );
}
