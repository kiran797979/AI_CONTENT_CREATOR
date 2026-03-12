import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Toast } from "../hooks/useToast";

// ─── Variant config — small colored dot instead of full-color background ──────

const DOT_COLOR: Record<Toast["type"], string> = {
  success: "bg-emerald-400",
  error: "bg-red-400",
  info: "bg-blue-400",
};

const ICON_PATH: Record<Toast["type"], string> = {
  success: "M4.5 12.75l6 6 9-13.5",
  error: "M6 18L18 6M6 6l12 12",
  info: "M12 9v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z",
};

// ─── Single Toast ─────────────────────────────────────────────────────────────

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const duration = 4000;

  const dismiss = useCallback(() => {
    onDismiss(toast.id);
  }, [toast.id, onDismiss]);

  // Auto-dismiss timer
  useEffect(() => {
    timerRef.current = setTimeout(dismiss, duration);
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [dismiss]);

  // Pause timer on hover
  const handleMouseEnter = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    // Pause progress bar
    if (progressRef.current) {
      progressRef.current.style.animationPlayState = "paused";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    timerRef.current = setTimeout(dismiss, 1500);
    if (progressRef.current) {
      progressRef.current.style.animationPlayState = "running";
    }
  }, [dismiss]);

  return (
    <motion.div
      layout
      role="alert"
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.95 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="
        group relative w-full max-w-xs
        bg-zinc-900 border border-zinc-800 rounded-lg
        shadow-xl shadow-black/20
        overflow-hidden
        cursor-pointer
      "
      onClick={dismiss}
    >
      <div className="flex items-start gap-2.5 px-3.5 py-3">
        {/* Colored dot */}
        <span
          aria-hidden="true"
          className={`mt-1 shrink-0 w-1.5 h-1.5 rounded-full ${DOT_COLOR[toast.type]}`}
        />

        {/* Icon */}
        <span
          aria-hidden="true"
          className="shrink-0 mt-0.5 text-zinc-400"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d={ICON_PATH[toast.type]}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        {/* Message */}
        <span className="flex-1 text-xs text-zinc-200 leading-relaxed pt-px">
          {toast.message}
        </span>

        {/* Dismiss X — visible on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
          aria-label="Dismiss notification"
          className="
            shrink-0 mt-0.5 p-0.5 rounded
            text-zinc-600 opacity-0 group-hover:opacity-100
            hover:text-zinc-300 hover:bg-zinc-800
            transition-all duration-150
          "
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 2L10 10M10 2L2 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Progress bar — shrinks over duration */}
      <div className="h-px w-full bg-zinc-800">
        <div
          ref={progressRef}
          className={`h-full ${DOT_COLOR[toast.type]} opacity-60`}
          style={{
            animation: `toast-shrink ${duration}ms linear forwards`,
          }}
        />
      </div>
    </motion.div>
  );
}

// ─── Container ────────────────────────────────────────────────────────────────

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <>
      {/* Keyframe for progress bar — injected once */}
      <style>{`
        @keyframes toast-shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>

      <div
        aria-label="Notifications"
        className="
          fixed bottom-5 right-5 z-50
          flex flex-col gap-2 items-end
          pointer-events-none
        "
      >
        <AnimatePresence initial={false} mode="sync">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto w-full">
              <ToastItem toast={t} onDismiss={onDismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}