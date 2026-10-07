import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

/**
 * Input teks global. Mendukung label + pesan error, dan meneruskan ref
 * sehingga kompatibel dengan register() react-hook-form.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className = "", ...rest },
  ref
) {
  return (
    <div>
      {label ? (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      ) : null}
      <input
        id={id}
        ref={ref}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400/40 ${
          error
            ? "border-red-300 focus:border-red-400"
            : "border-slate-300 focus:border-[#1E3A8A]"
        } ${className}`.trim()}
        {...rest}
      />
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
});
