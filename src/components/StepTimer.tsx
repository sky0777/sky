import { formatRemaining, type TimerPhase } from "../hooks/useStepTimer";

export function StepTimer({
  remaining,
  duration,
  phase,
  idleLabel,
  note,
  onPause,
  onStart,
  onReset,
}: {
  remaining: number;
  duration: number;
  phase: TimerPhase;
  idleLabel: string;
  note?: string;
  onPause: () => void;
  onStart: () => void;
  onReset: () => void;
}) {
  const progress = 1 - remaining / duration;
  const done = phase === "done";
  const running = phase === "running";
  const label = running ? "暂停" : phase === "paused" ? "继续" : idleLabel;

  return (
    <div className="mt-6">
      <p
        className="text-center text-[3.25rem] leading-none font-medium tabular-nums tracking-tight"
        aria-label={`剩余 ${formatRemaining(remaining)}`}
      >
        {formatRemaining(remaining)}
      </p>
      <div className="mt-4 h-[3px] w-full bg-ink/15" aria-hidden="true">
        <div
          className={`h-full bg-gold ${done ? "timer-alert" : ""}`}
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>
      <div className="mt-4 flex min-h-8 justify-center">
        {done ? (
          <p role="status" className="border-b-2 border-gold pb-0.5 text-2xl">
            时间到
          </p>
        ) : note ? (
          <p className="text-center text-base">{note}</p>
        ) : null}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          className="ghost"
          onClick={running ? onPause : onStart}
          disabled={done}
        >
          {label}
        </button>
        <button type="button" className="ghost" onClick={onReset}>
          复位
        </button>
      </div>
    </div>
  );
}
