import { useState, useEffect, useCallback, useMemo } from "react";

export interface CommandAction {
  id: string;
  name: string;
  category: string;
  icon: string; // SVG path d attribute
  shortcut?: string;
  execute: () => void;
}

interface UseCommandPaletteResult {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  query: string;
  setQuery: (q: string) => void;
  filtered: CommandAction[];
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  executeSelected: () => void;
}

function fuzzyMatch(text: string, query: string): boolean {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

export function useCommandPalette(actions: CommandAction[]): UseCommandPaletteResult {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return actions;
    return actions.filter(
      (a) => fuzzyMatch(a.name, query) || fuzzyMatch(a.category, query),
    );
  }, [actions, query]);

  // Reset selection when filtered results change
  const filteredLen = filtered.length;
  const resolvedIndex = selectedIndex >= filteredLen ? 0 : selectedIndex;
  if (resolvedIndex !== selectedIndex) {
    setSelectedIndex(resolvedIndex);
  }

  const executeSelected = useCallback(() => {
    if (filtered.length > 0 && resolvedIndex < filtered.length) {
      filtered[resolvedIndex].execute();
    }
  }, [filtered, resolvedIndex]);

  // Global keyboard listener: Ctrl+K / Cmd+K
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        if (!isOpen) {
          setQuery("");
          setSelectedIndex(0);
        }
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  return {
    isOpen,
    open,
    close,
    query,
    setQuery,
    filtered,
    selectedIndex: resolvedIndex,
    setSelectedIndex,
    executeSelected,
  };
}
