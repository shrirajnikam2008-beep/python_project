'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Compass, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import { HeroRouteViz } from './HeroRouteViz'

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-400/15 to-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-300/10 blur-[80px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50/80 border border-blue-200/80 rounded-full mb-6 shadow-xs backdrop-blur-xs">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-semibold text-blue-800 tracking-wide">
                Academic &amp; Career Navigation Platform
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-6">
              Your career is a journey.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Know your next step.
              </span>
            </h1>

            {/* Supporting Subtitle */}
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-xl font-normal">
              Waypoint is like Google Maps for your academic and career trajectory. Discover your skill gaps, explore alternative learning routes, and navigate with clarity.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30"
              >
                Start Your Journey
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs"
              >
                See How It Works
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Trust points */}
            <div className="mt-10 pt-8 border-t border-slate-200/60 grid grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">50+</p>
                <p className="text-xs text-slate-500 mt-0.5">Career destinations</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">200+</p>
                <p className="text-xs text-slate-500 mt-0.5">Prerequisite skills</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">100%</p>
                <p className="text-xs text-slate-500 mt-0.5">Student-centric</p>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Visual */}
          <motion.div
            className="lg:col-span-5 flex justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          >
            <HeroRouteViz />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
