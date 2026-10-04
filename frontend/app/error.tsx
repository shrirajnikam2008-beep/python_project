'use client'

import { useEffect } from 'react'
import { AlertCircle, RotateCcw, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Unhandled waypoint application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/50">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-500 mx-auto mb-6">
          <AlertCircle className="w-7 h-7" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-red-700 bg-red-50 border border-red-200 mb-3">
          Navigation Interrupted
        </span>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          Something went wrong
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
          {error.message || 'An unexpected issue occurred while rendering this view.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
