'use client'

import { AlertTriangle, RotateCcw, X, ShieldAlert } from 'lucide-react'

interface RegenerateConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  lastCustomizedAt?: string
}

export function RegenerateConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  lastCustomizedAt,
}: RegenerateConfirmModalProps) {
  if (!isOpen) return null

  const formattedDate = lastCustomizedAt
    ? new Date(lastCustomizedAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'recently'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Warning Header */}
        <div className="p-6 bg-amber-50/70 border-b border-amber-200/80 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Reset Route to AI Recommendation?
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              You have personal customizations saved on this route from{' '}
              <strong>{formattedDate}</strong>.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3 text-xs text-slate-600 leading-relaxed">
          <p>
            Regenerating the route will <strong>replace all your customized tasks, status updates, custom milestones, and edge arrangements</strong> with the default AI-recommended curriculum.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium">
            💡 If you only want to add or modify individual tasks, you can use <strong>&quot;Edit Route&quot;</strong> without losing your work.
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between p-4 px-6 border-t border-slate-100 bg-slate-50/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-2xs transition-colors"
          >
            Keep My Custom Route
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to AI Default</span>
          </button>
        </div>
      </div>
    </div>
  )
}
