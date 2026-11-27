import type { Level } from "../data/recipes";

export function Segmented({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: [string, string, string];
  value: Level;
  onChange: (value: Level) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-12 shrink-0 text-base text-forest">{label}</span>
      <div className="grid flex-1 grid-cols-3 border border-forest/40">
        {options.map((option, index) => {
          const selected = value === index;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              className={`h-12 border-l border-forest/25 text-base first:border-l-0 ${selected ? "bg-forest text-rice" : "text-ink"}`}
              onClick={() => onChange(index as Level)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
