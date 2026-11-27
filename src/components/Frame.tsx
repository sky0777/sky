import type { ReactNode } from "react";

export function Frame({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-rice text-ink">
      <div className="mx-auto flex min-h-dvh w-full max-w-[420px] flex-col px-7 pt-10 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-1 flex-col">{children}</div>
        {footer ? <div className="mt-10">{footer}</div> : null}
      </div>
    </div>
  );
}
