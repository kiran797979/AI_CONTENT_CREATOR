import { useEffect, useRef } from "react";
import type { FormData } from "../types/form";

const KEY = "acs-form-draft";

export function loadDraft(): Partial<FormData> | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function useAutoSave(formData: FormData, delayMs = 500): void {
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, JSON.stringify(formData));
      } catch {
        // quota — ignore
      }
    }, delayMs);

    return () => window.clearTimeout(timer.current);
  }, [formData, delayMs]);
}
