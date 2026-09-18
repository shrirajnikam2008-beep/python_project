'use client'

import Link from 'next/link'
import { HeroSection } from '@/components/landing/HeroSection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Navigation, ArrowRight, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function LandingPage() {
  const { user, isLoading } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Global Landing Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Navigation className="h-4 w-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-base tracking-wider">WAYPOINT</span>
              <span className="text-[10px] text-slate-400 font-normal block leading-none">Navigate your next.</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            {isLoading ? (
              <div className="h-8 w-32 rounded-xl bg-slate-100 animate-pulse" />
            ) : user ? (
              /* Logged in — show dashboard shortcut */
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs hover:shadow-md"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Go to Dashboard
              </Link>
            ) : (
              /* Guest — show Login + Signup */
              <>
                <Link
                  href="/login"
                  className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 border border-slate-200 hover:border-slate-300"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs hover:shadow-md"
                >
                  Sign up free <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Hero & Sections */}
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Navigation className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-bold text-slate-900">WAYPOINT</span>
            <span className="text-xs text-slate-400">| Academic &amp; Career Navigation</span>
          </div>
          <p className="text-xs text-slate-500">
            Review 2 Release • Built for University Project Demo
          </p>
        </div>
      </footer>
    </div>
  )
}
