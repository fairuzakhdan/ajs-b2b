import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "solid" | "outline" | "ghost";
export type ButtonSize = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-sky-500 to-[#1E3A8A] text-white shadow-lg shadow-sky-500/20 hover:opacity-90",
  solid: "bg-[#1E3A8A] text-white hover:bg-[#162d6b]",
  outline:
    "border border-slate-300 text-slate-700 hover:border-sky-400 hover:text-[#1E3A8A]",
  ghost: "text-slate-600 hover:text-[#1E3A8A]",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
};

/** Helper agar elemen lain (mis. <Link>) bisa memakai style button yang sama. */
export function buttonClass(opts?: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const { variant = "solid", size = "md", className = "" } = opts ?? {};
  return `${base} ${variantClass[variant]} ${sizeClass[size]} ${className}`.trim();
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant, size, className, children } = props;
  const cls = buttonClass({ variant, size, className });

  if ("href" in props && props.href !== undefined) {
    return (
      <Link href={props.href} className={cls}>
        {children}
      </Link>
    );
  }

  // Buang prop khusus komponen agar tidak bocor sebagai atribut DOM.
  const {
    variant: _variant,
    size: _size,
    className: _className,
    children: _children,
    ...buttonAttrs
  } = props as ButtonAsButton;
  void _variant;
  void _size;
  void _className;
  void _children;

  return (
    <button className={cls} {...buttonAttrs}>
      {children}
    </button>
  );
}
