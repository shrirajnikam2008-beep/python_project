'use client'

import { motion } from 'framer-motion'
import { MapPin, Compass, Route, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    number: '01',
    icon: MapPin,
    title: 'Know Where You Are',
    description:
      'Map your current academic standing, completed credits, and existing programming & mathematical foundations.',
    highlight: 'Instant skill inventory',
  },
  {
    number: '02',
    icon: Compass,
    title: 'Choose Where You Want To Go',
    description:
      'Select your target tech destination — from AI/ML Engineer to Cloud Architecture. Waypoint calculates your exact requirements.',
    highlight: 'Pinpoint skill gap analysis',
  },
  {
    number: '03',
    icon: Route,
    title: 'Find Your Optimal Route',
    description:
      'Compare fast-track, balanced, and foundational paths on an interactive dependency DAG. Click any node to see why it matters.',
    highlight: 'Interactive React Flow roadmap',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white border-t border-slate-100 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full mb-3 border border-blue-100">
            How It Works
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            From current status to career ready
          </h2>
          <p className="mt-3 text-base text-slate-500">
            Waypoint simplifies complex prerequisite chains into a clear, navigable roadmap.
          </p>
        </motion.div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-xs text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-3xl font-black text-slate-200 group-hover:text-blue-100 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                  <span>{step.highlight}</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Callout banner */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Ready to chart your academic route?</h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Set up your profile in under 2 minutes. Start viewing your skill gaps and customized learning routes today.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Launch Setup Wizard <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
