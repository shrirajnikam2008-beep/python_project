import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

export function NextStepCard() {
  return (
    <div className="bg-navy-900 text-white rounded-xl p-5 shadow-sm border border-navy-800">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-xs font-medium text-blue-300 uppercase tracking-wide">Recommended Next Step</span>
      </div>
      <h3 className="text-base font-bold text-white mb-1">
        Start with Data Structures
      </h3>
      <p className="text-sm text-slate-400 mb-4 leading-relaxed">
        Data Structures is a prerequisite for Machine Learning and SQL on your selected route.
      </p>
      <Link
        href="/route/balanced"
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        View Route <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
