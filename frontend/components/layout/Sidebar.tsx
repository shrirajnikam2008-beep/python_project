'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Map,
  BarChart3,
  Route,
  Navigation,
  Compass,
  GraduationCap,
  LogOut,
  UserCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Overview', badge: null },
  { href: '/onboarding', icon: UserCheck, label: 'Profile & Goal', badge: null },
  { href: '/route/balanced', icon: Map, label: 'My Route', badge: 'Active' },
  { href: '/skill-gaps', icon: BarChart3, label: 'Skill Gaps', badge: '11 gaps' },
  { href: '/routes', icon: Route, label: 'Routes', badge: '3 paths' },
]

export function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <aside className="flex h-full w-64 flex-col bg-[#0B0F19] text-slate-300 border-r border-slate-800/80 select-none">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-slate-800/60 bg-[#0B0F19]/90 backdrop-blur-sm">
        <Link
          href="/dashboard"
          onClick={onCloseMobile}
          className="flex items-center gap-3 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20 text-white transition-transform group-hover:scale-105">
            <Navigation className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white tracking-wider">WAYPOINT</span>
              <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/30">
                R2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal leading-none mt-0.5">Navigate your next.</p>
          </div>
        </Link>
      </div>

      {/* Target Destination Pin Card */}
      <div className="p-3.5 mx-3 mt-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
          <span className="flex items-center gap-1 font-medium text-slate-300">
            <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" /> Target Goal
          </span>
          <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px] border border-emerald-500/20">
            42%
          </span>
        </div>
        <p className="text-xs font-semibold text-white truncate">AI / ML Engineer</p>
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full w-[42%]" />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)

          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className="relative block"
            >
              <div
                className={cn(
                  'flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-blue-600/15 text-white font-semibold border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-colors',
                      isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-300'
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-md font-medium',
                      isActive
                        ? 'bg-blue-500/30 text-blue-300 border border-blue-400/30'
                        : 'bg-slate-800 text-slate-400'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0B0F19]/90">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-xs text-white shadow-inner">
            {initials}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0B0F19] bg-emerald-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.name ?? 'Student'}</p>
            <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
              {user?.email ?? 'Not signed in'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Sign out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}

