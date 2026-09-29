'use client';

import { useTransition } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  function handleConfirm() {
    startTransition(async () => {
      await onConfirm();
      onCancel(); // close after done
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden"
        style={{
          background: 'var(--surface)',
          borderColor: 'rgba(244,63,94,0.3)',
          animation: 'deleteModalIn 0.25s cubic-bezier(0.16,1,0.3,1) both',
        }}
      >
        {/* Red top accent bar */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#f43f5e,#ef4444)' }} />

        {/* Close button */}
        <button
          onClick={onCancel}
          disabled={isPending}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-all"
        >
          <X size={16} />
        </button>

        <div className="p-7">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.25)' }}
          >
            <AlertTriangle size={26} className="text-rose-400" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-7">{description}</p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isPending}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 border transition-all hover:bg-slate-700/50 disabled:opacity-50"
              style={{ borderColor: 'var(--border)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isPending}
              id="confirm-delete-btn"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: isPending
                  ? 'rgba(244,63,94,0.5)'
                  : 'linear-gradient(135deg,#f43f5e,#ef4444)',
                boxShadow: '0 4px 20px rgba(244,63,94,0.3)',
              }}
            >
              {isPending ? (
                <>
                  <span
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                    style={{ animation: 'spin 0.7s linear infinite' }}
                  />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 size={15} />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes deleteModalIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
