import { useState, useRef, useCallback, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

type Placement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  label: string;
  children: ReactNode;
  placement?: Placement;
  delay?: number;
  disabled?: boolean;
}

const PLACEMENT_CLASSES: Record<Placement, string> = {
  top:    "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left:   "right-full top-1/2 -translate-y-1/2 mr-2",
  right:  "left-full top-1/2 -translate-y-1/2 ml-2",
};

const ARROW_CLASSES: Record<Placement, string> = {
  top:    "top-full left-1/2 -translate-x-1/2 border-t-gray-800 dark:border-t-zinc-800 border-x-transparent border-b-transparent",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 dark:border-b-zinc-800 border-x-transparent border-t-transparent",
  left:   "left-full top-1/2 -translate-y-1/2 border-l-gray-800 dark:border-l-zinc-800 border-y-transparent border-r-transparent",
  right:  "right-full top-1/2 -translate-y-1/2 border-r-gray-800 dark:border-r-zinc-800 border-y-transparent border-l-transparent",
};

const MOTION_OFFSET: Record<Placement, { x: number; y: number }> = {
  top:    { x: 0, y: 4 },
  bottom: { x: 0, y: -4 },
  left:   { x: 4, y: 0 },
  right:  { x: -4, y: 0 },
};

export default function Tooltip({
  label,
  children,
  placement = "top",
  delay = 150,
  disabled = false,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const show = useCallback(() => {
    if (disabled) return;
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay, disabled]);

  const hide = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  const offset = MOTION_OFFSET[placement];

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      aria-describedby={visible ? tooltipId : undefined}
    >
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, x: offset.x, y: offset.y }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: offset.x, y: offset.y }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={[
              "absolute z-50 pointer-events-none",
              "px-2.5 py-1.5 rounded-md",
              "bg-gray-800 border border-gray-700",
              "dark:bg-zinc-800 dark:border-zinc-700",
              "text-[11px] font-medium text-white",
              "whitespace-nowrap",
              "shadow-lg shadow-black/20",
              PLACEMENT_CLASSES[placement],
            ].join(" ")}
          >
            {label}
            <span
              aria-hidden="true"
              className={["absolute w-0 h-0 border-[4px]", ARROW_CLASSES[placement]].join(" ")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 