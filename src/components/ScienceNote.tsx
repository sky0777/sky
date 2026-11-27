import { useState } from "react";

export function ScienceNote({ detail }: { detail: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-ink/15 pt-4">
      <button
        type="button"
        className="flex w-full items-baseline justify-between gap-4 text-left"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="text-base">为什么这样</span>
        <span className="text-base text-forest">{open ? "收起" : "展开"}</span>
      </button>
      {open ? <p className="mt-3 text-lg leading-relaxed">{detail}</p> : null}
    </div>
  );
}
