import { useCallback, useEffect, useRef, useState } from "react";

export type TimerPhase = "idle" | "running" | "paused" | "done";

export function useStepTimer(seconds: number, autoStart = true) {
  const duration = Math.max(1, seconds) * 1000;
  const [remaining, setRemaining] = useState(duration);
  const [phase, setPhase] = useState<TimerPhase>(autoStart ? "running" : "idle");
  const remainingRef = useRef(duration);
  const endRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "running") return;

    endRef.current = performance.now() + remainingRef.current;
    let frame = 0;

    const tick = (now: number) => {
      const left = Math.max(0, (endRef.current ?? now) - now);
      remainingRef.current = left;
      setRemaining(left);
      if (left <= 0) {
        endRef.current = null;
        setPhase("done");
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  const pause = useCallback(() => {
    setPhase((current) => (current === "running" ? "paused" : current));
    endRef.current = null;
  }, []);

  const start = useCallback(() => {
    if (remainingRef.current <= 0) return;
    setPhase((current) =>
      current === "paused" || current === "idle" ? "running" : current,
    );
  }, []);

  const reset = useCallback(() => {
    remainingRef.current = duration;
    endRef.current = null;
    setRemaining(duration);
    setPhase("idle");
  }, [duration]);

  return { remaining, duration, phase, pause, start, reset };
}

export function formatRemaining(ms: number) {
  const total = Math.ceil(ms / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
