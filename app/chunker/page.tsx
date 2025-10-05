import React from "react";

export default function ChunkerPage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] px-4 sm:px-6 lg:px-8">
      {/* Glassy background overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl backdrop-saturate-150 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 py-12 relative z-10">
        {/* Sidebar (15–20%) */}
        <aside className="col-span-12 lg:col-span-3 xl:col-span-2 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl shadow-sm p-4 hidden lg:block">
          <h2 className="text-sm font-semibold mb-2">Sidebar</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Placeholder for navigation or file info
          </p>
        </aside>

        {/* Main upload area (center) */}
        <section className="col-span-12 lg:col-span-6 xl:col-span-7">
          <div className="h-[70vh] flex flex-col justify-center items-center rounded-2xl border-2 border-dashed border-white/30 bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 transition-all">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Drag and drop your file here
            </p>
            <button className="px-4 py-2 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-md shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400">
              Browse Files
            </button>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Supported: .txt, .docx (max 30MB)
            </p>
          </div>
        </section>

        {/* Right panel (model info + token settings) */}
        <aside className="col-span-12 lg:col-span-3 xl:col-span-3 bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl shadow-sm p-4">
          <div className="space-y-6">
            {/* Model info box */}
            <div className="border-b border-white/20 pb-4">
              <h2 className="text-sm font-semibold mb-2">Model Info</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Choose Free or Paid to view model token limits.
              </p>
            </div>

            {/* Token settings box */}
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
