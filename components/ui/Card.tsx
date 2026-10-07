import type { ReactNode } from "react";

type CardProps = {
  className?: string;
  children: ReactNode;
};

/** Kartu dasar: rounded-2xl, border tipis, latar putih, shadow lembut. */
export function Card({ className = "", children }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`.trim()}
    >
      {children}
    </div>
  );
}
