'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  label: string;
  pendingLabel?: string;
  className?: string;
}

export function SubmitButton({ label, pendingLabel, className }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0 ${className ?? ''}`}
    >
      {pending && <Loader2 size={15} className="animate-spin" />}
      {pending ? (pendingLabel ?? 'Saving...') : label}
    </button>
  );
}
