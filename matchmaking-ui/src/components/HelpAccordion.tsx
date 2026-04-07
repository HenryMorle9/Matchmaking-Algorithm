import type { ReactNode } from "react";

export default function HelpAccordion({ children }: { children: ReactNode }) {
  return (
    <details className="theme-help rounded px-5 py-4">
      <summary className="theme-label cursor-pointer select-none text-sm font-semibold">
        Quick Guide
      </summary>
      <div className="theme-help-content mt-4 text-sm leading-relaxed">
        {children}
      </div>
    </details>
  );
}
