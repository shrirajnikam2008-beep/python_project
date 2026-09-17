import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const gaps = [
  { label: 'Critical', count: 3, color: 'bg-red-500', textColor: 'text-red-600', bgLight: 'bg-red-50' },
  { label: 'High Priority', count: 4, color: 'bg-amber-400', textColor: 'text-amber-600', bgLight: 'bg-amber-50' },
  { label: 'Recommended', count: 4, color: 'bg-slate-300', textColor: 'text-slate-500', bgLight: 'bg-slate-50' },
]

export function SkillGapSummary() {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900">Skill Gaps</h3>
        <Link
          href="/skill-gaps"
          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="space-y-2.5">
        {gaps.map((gap) => (
          <div key={gap.label} className={`flex items-center justify-between p-3 rounded-lg ${gap.bgLight}`}>
            <div className="flex items-center gap-2.5">
              <div className={`w-2 h-2 rounded-full ${gap.color}`} />
              <span className={`text-sm font-medium ${gap.textColor}`}>{gap.label}</span>
            </div>
            <span className={`text-sm font-bold ${gap.textColor}`}>{gap.count} skills</span>
          </div>
        ))}
      </div>
    </div>
  )
}
