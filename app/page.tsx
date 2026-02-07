"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type Summary,
  addSummary,
  compactSummaries,
  createSummary,
  getApiKey,
  loadSummaries,
  saveApiKey,
} from "./summaryStore";

type SplitChunk = {
  id: number;
  filename: string;
  text: string;
  approxTokens: number;
};

const DEFAULT_MODEL = "gpt-4.1-mini";

export default function Home() {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [summaryText, setSummaryText] = useState("");
  const [topicTags, setTopicTags] = useState("");
  const [sourceRange, setSourceRange] = useState("");
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [rawChat, setRawChat] = useState("");
  const [maxTokens, setMaxTokens] = useState("");
  const [splitChunks, setSplitChunks] = useState<SplitChunk[]>([]);
  const [splitError, setSplitError] = useState("");

  useEffect(() => {
    const initialSummaries = loadSummaries();
    const storedKey = getApiKey();
    setSummaries(initialSummaries);
    if (storedKey) {
      setApiKeyInput(storedKey);
    }
  }, []);

  const maskedKey = useMemo(() => {
    if (!apiKeyInput) {
      return "";
    }
    if (apiKeyInput.length <= 8) {
      return "••••••••";
    }
    return `${apiKeyInput.slice(0, 4)}••••${apiKeyInput.slice(-4)}`;
  }, [apiKeyInput]);

  const handleSaveKey = () => {
    saveApiKey(apiKeyInput.trim());
  };

  const handleAddSummary = () => {
    if (!summaryText.trim()) {
      return;
    }
    const newSummary = createSummary({
      model,
      summary: summaryText.trim(),
      sourceRange: sourceRange.trim(),
      topicTags: topicTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
    const updatedSummaries = addSummary(newSummary);
    setSummaries(updatedSummaries);
    setSummaryText("");
    setTopicTags("");
    setSourceRange("");
  };

  const handleCompact = () => {
    const updatedSummaries = compactSummaries();
    setSummaries(updatedSummaries);
  };

  const handleSplitChat = async () => {
    if (!rawChat.trim()) {
      setSplitError("Add chat content before splitting.");
      return;
    }
    setSplitError("");
    const response = await fetch("/api/split", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: rawChat,
        model,
        maxTokens: maxTokens ? Number(maxTokens) : undefined,
      }),
    });

    if (!response.ok) {
      setSplitError("Unable to split chat. Please try again.");
      return;
    }

    const payload = (await response.json()) as { chunks: SplitChunk[] };
    setSplitChunks(payload.chunks);
  };

  const handleDownloadChunk = (chunk: SplitChunk) => {
    const blob = new Blob([chunk.text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = chunk.filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
            Chat Token Tools
          </p>
          <h1 className="text-4xl font-semibold text-white">
            Persistent Summaries Workspace
          </h1>
          <p className="max-w-2xl text-base text-slate-300">
            Create multi-level summaries whenever a model context window fills
            up. Summaries are stored locally and can be carried into new chats.
            Use compaction to merge older summaries into larger, higher-level
            snapshots.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-slate-950/40">
          <h2 className="text-xl font-semibold text-white">API Key</h2>
          <p className="mt-2 text-sm text-slate-400">
            Your key is stored locally in your browser only. Never paste a key
            you cannot revoke. The app will only send it to the summarization
            endpoint you choose.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-600"
              placeholder="sk-..."
              type="password"
              value={apiKeyInput}
              onChange={(event) => setApiKeyInput(event.target.value)}
            />
            <button
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
              type="button"
              onClick={handleSaveKey}
            >
              Save key
            </button>
          </div>
          {apiKeyInput ? (
            <p className="mt-3 text-xs text-slate-500">
              Stored key: <span className="font-mono">{maskedKey}</span>
            </p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-slate-950/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Chat Splitter
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Split long chats into context-sized files you can upload
                individually for summarization.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              Target model
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                value={model}
                onChange={(event) => setModel(event.target.value)}
              >
                <option value="gpt-4.1-mini">gpt-4.1-mini</option>
                <option value="gpt-4.1">gpt-4.1</option>
                <option value="gpt-4o-mini">gpt-4o-mini</option>
                <option value="gpt-4o">gpt-4o</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Max context tokens (optional)
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
                placeholder="Defaults to model context limit"
                value={maxTokens}
                onChange={(event) => setMaxTokens(event.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              Chat transcript
              <textarea
                className="min-h-[160px] w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
                placeholder="Paste the full chat transcript to split..."
                value={rawChat}
                onChange={(event) => setRawChat(event.target.value)}
              />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
              type="button"
              onClick={handleSplitChat}
            >
              Split into files
            </button>
            {splitError ? (
              <span className="text-xs text-rose-400">{splitError}</span>
            ) : null}
            <p className="text-xs text-slate-500">
              Files are created locally in your browser. No content is sent
              anywhere except the local split endpoint.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {splitChunks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">
                No split files yet. Add a transcript and split to generate
                files.
              </div>
            ) : (
              splitChunks.map((chunk) => (
                <article
                  key={chunk.id}
                  className="flex h-full flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500">
                        File {chunk.id}
                      </p>
                      <h3 className="text-sm font-semibold text-slate-100">
                        {chunk.filename}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500">
                      ~{chunk.approxTokens} tokens
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">
                    {chunk.text.slice(0, 220)}
                    {chunk.text.length > 220 ? "…" : ""}
                  </p>
                  <button
                    className="mt-auto rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-indigo-400 hover:text-white"
                    type="button"
                    onClick={() => handleDownloadChunk(chunk)}
                  >
                    Download file
                  </button>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-slate-950/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Summary Composer
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Record a summary snapshot and attach metadata to make future
                retrieval accurate.
              </p>
            </div>
            <button
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-indigo-400 hover:text-white"
              type="button"
              onClick={handleCompact}
            >
              Compact summaries
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              Model
              <select
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
                value={model}
                onChange={(event) => setModel(event.target.value)}
              >
                <option value="gpt-4.1-mini">gpt-4.1-mini</option>
                <option value="gpt-4.1">gpt-4.1</option>
                <option value="gpt-4o-mini">gpt-4o-mini</option>
                <option value="gpt-4o">gpt-4o</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-300">
              Source range (messages)
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
                placeholder="e.g. 120-168"
                value={sourceRange}
                onChange={(event) => setSourceRange(event.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              Summary text
              <textarea
                className="min-h-[120px] w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
                placeholder="Write the compressed summary here..."
                value={summaryText}
                onChange={(event) => setSummaryText(event.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              Topic tags (comma-separated)
              <input
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
                placeholder="summaries, security, chrome-extension"
                value={topicTags}
                onChange={(event) => setTopicTags(event.target.value)}
              />
            </label>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              type="button"
              onClick={handleAddSummary}
            >
              Save summary
            </button>
            <p className="text-xs text-slate-500">
              Summaries are stored locally in your browser via a local storage
              adapter.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-slate-950/40">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Summary Library
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Keep a lineage of summaries and merge them when you hit context
                limits.
              </p>
            </div>
            <span className="text-sm text-slate-400">
              {summaries.length} stored summaries
            </span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {summaries.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 p-6 text-sm text-slate-400">
                No summaries saved yet. Add one above to get started.
              </div>
            ) : (
              summaries.map((summary) => (
                <article
                  key={summary.id}
                  className="flex h-full flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-500">
                        {summary.tierLabel}
                      </p>
                      <h3 className="text-sm font-semibold text-slate-100">
                        {summary.model}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500">
                      {summary.createdAt}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300">{summary.summary}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                    {summary.sourceRange ? (
                      <span className="rounded-full border border-slate-800 px-2 py-0.5">
                        Range: {summary.sourceRange}
                      </span>
                    ) : null}
                    {summary.topicTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-800 px-2 py-0.5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600">
                    Lineage: {summary.lineage.join(" → ")}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
