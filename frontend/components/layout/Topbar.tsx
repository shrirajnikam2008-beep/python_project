'use client'

import { Bell, Menu, Compass, ArrowUpRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface TopbarProps {
  title: string
  breadcrumb?: { label: string; href?: string }[]
  onOpenMobileNav?: () => void
}

export function Topbar({ title, breadcrumb, onOpenMobileNav }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {onOpenMobileNav && (
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 md:hidden transition-colors"
            aria-label="Open Navigation"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        <div>
          {breadcrumb && breadcrumb.length > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              {breadcrumb.map((crumb, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  {idx > 0 && <span className="text-slate-300 font-normal">/</span>}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-slate-600 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </div>
              ))}
            </div>
          )}
          <h1 className="text-base font-bold tracking-tight text-slate-900 leading-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Goal Pill */}
        <Link
          href="/route/balanced"
          className="hidden sm:inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/70 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100/80 transition-colors shadow-xs"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
          <span>Destination: <strong>AI / ML Engineer</strong></span>
          <ArrowUpRight className="h-3 w-3 text-blue-500" />
        </Link>

        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all shadow-xs"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        {/* Student Avatar */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 text-xs font-bold text-white shadow-xs">
            AS
          </div>
        </div>
      </div>
    </header>
  )
}
