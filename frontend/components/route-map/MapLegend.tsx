import { Check, Play, Lock, Trophy, Sparkles } from 'lucide-react'

export function MapLegend() {
  const items = [
    {
      icon: Check,
      bg: 'bg-emerald-500 text-white',
      label: 'Acquired Skill',
      sub: '4 completed',
    },
    {
      icon: Play,
      bg: 'bg-blue-600 text-white',
      label: 'Recommended Next',
      sub: '2 unlocked',
    },
    {
      icon: Lock,
      bg: 'bg-slate-200 text-slate-500',
      label: 'Locked Prerequisite',
      sub: '5 upcoming',
    },
    {
      icon: Trophy,
      bg: 'bg-amber-400 text-slate-900',
      label: 'Career Goal',
      sub: 'AI/ML Target',
    },
  ]

  return (
    <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-4 shadow-lg shadow-slate-200/50 z-20 max-w-xs hidden sm:block select-none">
      <div className="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-slate-100">
        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
          Node Legend
        </span>
        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
          Click node for details
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg shadow-2xs ${item.bg}`}>
                <Icon className="w-3 h-3 stroke-[2.5]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 leading-tight truncate">{item.label}</p>
                <p className="text-[10px] text-slate-400 truncate">{item.sub}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
