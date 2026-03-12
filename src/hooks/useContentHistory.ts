import { useState, useCallback, useEffect } from "react";

import type { ContentType } from "../types/form";

export interface HistoryEntry {
  id: string;
  contentType: ContentType;
  topic: string;
  content: string;
  timestamp: number;
}

const STORAGE_KEY = "acs-content-history";
const MAX_ENTRIES = 50;

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useContentHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Quota exceeded — silently degrade
    }
  }, [history]);

  const addEntry = useCallback((contentType: ContentType, topic: string, content: string) => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      contentType,
      topic,
      content,
      timestamp: Date.now(),
    };
    setHistory((prev) => [entry, ...prev].slice(0, MAX_ENTRIES));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addEntry, clearHistory };
}
