'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { X } from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
  title: string
  breadcrumb?: { label: string; href?: string }[]
  noPadding?: boolean
}

export function AppShell({ children, title, breadcrumb, noPadding }: AppShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50/60 antialiased text-slate-900">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-40">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-[#0B0F19]">
            <button
              type="button"
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              onClick={() => setMobileNavOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
            <Sidebar onCloseMobile={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex flex-1 flex-col md:pl-64 min-w-0">
        <Topbar
          title={title}
          breadcrumb={breadcrumb}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <main className={`flex-1 ${noPadding ? '' : 'p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto'}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
