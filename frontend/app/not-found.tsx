import Link from 'next/link'
import { Navigation, Compass, LayoutDashboard, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xl shadow-slate-200/50">
        {/* Brand Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/20 mb-6">
          <Navigation className="w-7 h-7" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 mb-3">
          Error 404 • Lost in Navigation
        </span>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          Off the Mapped Route
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-8">
          The milestone or page you are trying to navigate to does not exist or has been rerouted.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all"
          >
            <LayoutDashboard className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <Link
            href="/routes"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all"
          >
            <Compass className="w-4 h-4" />
            Explore Routes
          </Link>
        </div>
      </div>

      <p className="mt-8 text-xs text-slate-400">
        Waypoint — Academic &amp; Career Navigation System
      </p>
    </div>
  )
}
