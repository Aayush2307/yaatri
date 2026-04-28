import type { ReactNode } from 'react';

type FieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

export function Field({ label, required = false, error, children }: FieldProps) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] uppercase tracking-[0.1em] text-[#7B74A8]">
        {label}
        {required ? <span className="ml-1 text-[#534AB7]">*</span> : null}
      </span>
      {children}
      {error ? <p className="mt-1.5 text-[11px] text-[#E24B4A]">{error}</p> : null}
    </label>
  );
}
