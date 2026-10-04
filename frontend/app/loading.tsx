import { Navigation } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
          <Navigation className="h-7 w-7 animate-pulse" />
          <span className="absolute -inset-1 rounded-2xl border-2 border-blue-500/30 animate-ping" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 tracking-wide">Navigating Waypoint...</p>
          <p className="text-xs text-slate-400 mt-0.5">Calibrating your learning pathways</p>
        </div>
      </div>
    </div>
  )
}
