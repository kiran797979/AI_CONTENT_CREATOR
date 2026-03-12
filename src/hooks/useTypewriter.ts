import { useState, useEffect, useMemo, useRef, useCallback } from "react";

interface TypewriterResult {
  displayedText: string;
  isTyping: boolean;
  skip: () => void;
}

export function useTypewriter(text: string, speed = 30): TypewriterResult {
  const words = useMemo(() => text.split(/(\s+)/), [text]);
  const totalWords = words.length;
  const hasContent = totalWords > 0 && text.length > 0;

  // Key state by text so React auto-resets when text changes
  const [state, setState] = useState({ wordIndex: 0, isTyping: hasContent, key: text });

  // Derive reset: when text changes, compute fresh initial state
  const resolved = state.key === text
    ? state
    : { wordIndex: 0, isTyping: hasContent, key: text };

  // Commit the derived state if it differs (conditional setState during render is allowed by React)
  if (resolved !== state) {
    setState(resolved);
  }

  const skippedRef = useRef(false);
  const rafId = useRef(0);
  const lastTime = useRef(0);

  // Subscribe: rAF loop drives word-by-word reveal
  useEffect(() => {
    skippedRef.current = false;
    lastTime.current = 0;

    if (!hasContent) return;

    function tick(now: number) {
      if (skippedRef.current) return;

      if (lastTime.current === 0) {
        lastTime.current = now;
      }

      const elapsed = now - lastTime.current;
      if (elapsed >= speed) {
        lastTime.current = now;
        setState((prev) => {
          if (prev.key !== text) return prev;
          const next = prev.wordIndex + 1;
          if (next >= totalWords) {
            return { ...prev, wordIndex: totalWords, isTyping: false };
          }
          return { ...prev, wordIndex: next };
        });
      }

      rafId.current = requestAnimationFrame(tick);
    }

    rafId.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId.current);
  }, [text, speed, totalWords, hasContent]);

  const skip = useCallback(() => {
    skippedRef.current = true;
    cancelAnimationFrame(rafId.current);
    setState((prev) => ({ ...prev, wordIndex: totalWords, isTyping: false }));
  }, [totalWords]);

  const displayedText = words.slice(0, resolved.wordIndex).join("");

  return { displayedText, isTyping: resolved.isTyping, skip };
}
