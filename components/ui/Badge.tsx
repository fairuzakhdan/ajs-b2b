import type { ReactNode } from "react";

export type BadgeTone = "amber" | "emerald" | "red" | "slate" | "blue";

const toneClass: Record<BadgeTone, string> = {
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
  slate: "bg-slate-100 text-slate-600",
  blue: "bg-[#1E3A8A]/10 text-[#1E3A8A]",
};

type BadgeProps = {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
};

/** Pill status/label kecil. */
export function Badge({ tone = "slate", className = "", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${toneClass[tone]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
