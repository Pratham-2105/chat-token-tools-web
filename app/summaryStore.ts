export type Summary = {
  id: string;
  createdAt: string;
  summary: string;
  model: string;
  sourceRange: string;
  topicTags: string[];
  tier: number;
  tierLabel: string;
  lineage: string[];
};

export type SummaryDraft = {
  summary: string;
  model: string;
  sourceRange?: string;
  topicTags?: string[];
};

type SummaryStore = {
  load: () => Summary[];
  save: (summaries: Summary[]) => void;
  saveApiKey: (apiKey: string) => void;
  getApiKey: () => string;
};

const STORAGE_KEY = "ctt.summaries.v1";
const API_KEY_STORAGE_KEY = "ctt.apiKey";
const COMPACT_THRESHOLD = 6;
const COMPACT_BATCH_SIZE = 4;

const defaultStore: SummaryStore = {
  load: () => {
    if (typeof window === "undefined") {
      return [];
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as Summary[];
    return Array.isArray(parsed) ? parsed : [];
  },
  save: (summaries) => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(summaries));
  },
  saveApiKey: (apiKey) => {
    if (typeof window === "undefined") {
      return;
    }
    if (!apiKey) {
      window.localStorage.removeItem(API_KEY_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  },
  getApiKey: () => {
    if (typeof window === "undefined") {
      return "";
    }
    return window.localStorage.getItem(API_KEY_STORAGE_KEY) ?? "";
  },
};

export const loadSummaries = () => defaultStore.load();

export const saveApiKey = (apiKey: string) => defaultStore.saveApiKey(apiKey);

export const getApiKey = () => defaultStore.getApiKey();

export const createSummary = (draft: SummaryDraft): Summary => {
  const createdAt = new Date().toISOString();
  const id = `summary_${createdAt}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    createdAt,
    summary: draft.summary,
    model: draft.model,
    sourceRange: draft.sourceRange ?? "",
    topicTags: draft.topicTags ?? [],
    tier: 1,
    tierLabel: "Tier 1",
    lineage: [id],
  };
};

export const addSummary = (summary: Summary) => {
  const summaries = loadSummaries();
  const updated = [summary, ...summaries];
  defaultStore.save(updated);
  return updated;
};

const buildCompactSummary = (summaries: Summary[]) => {
  const latestSummary = summaries[0];
  const createdAt = new Date().toISOString();
  const id = `summary_${createdAt}_${Math.random().toString(36).slice(2, 8)}`;
  const mergedSummary = summaries.map((item) => item.summary).join(" ");
  const mergedTags = Array.from(
    new Set(summaries.flatMap((item) => item.topicTags)),
  );
  const mergedLineage = summaries.flatMap((item) => item.lineage);
  const highestTier = Math.max(...summaries.map((item) => item.tier));
  const nextTier = highestTier + 1;

  return {
    id,
    createdAt,
    summary: mergedSummary,
    model: latestSummary?.model ?? "unknown",
    sourceRange: summaries
      .map((item) => item.sourceRange)
      .filter(Boolean)
      .join(", "),
    topicTags: mergedTags,
    tier: nextTier,
    tierLabel: `Tier ${nextTier}`,
    lineage: [id, ...mergedLineage],
  };
};

export const compactSummaries = () => {
  const summaries = loadSummaries();
  if (summaries.length < COMPACT_THRESHOLD) {
    return summaries;
  }
  const batch = summaries.slice(-COMPACT_BATCH_SIZE);
  const rest = summaries.slice(0, summaries.length - COMPACT_BATCH_SIZE);
  const compacted = buildCompactSummary(batch);
  const updated = [compacted, ...rest];
  defaultStore.save(updated);
  return updated;
};
