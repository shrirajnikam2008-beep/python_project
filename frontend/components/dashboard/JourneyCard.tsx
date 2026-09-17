import { ProgressRing } from '@/components/ui/ProgressRing'
import { Badge } from '@/components/ui/Badge'
import { MapPin } from 'lucide-react'

interface JourneyCardProps {
  destination: string
  progress: number
  completedSkills: number
  totalSkills: number
}

export function JourneyCard({ destination, progress, completedSkills, totalSkills }: JourneyCardProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="info" dot>In Progress</Badge>
          </div>
          <p className="text-xs text-slate-500 mb-0.5">Your destination</p>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
            {destination}
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-slate-900">{completedSkills}
                <span className="text-base font-normal text-slate-400">/{totalSkills}</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Skills acquired</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalSkills - completedSkills}</p>
              <p className="text-xs text-slate-500 mt-0.5">Skills remaining</p>
            </div>
          </div>
        </div>
        <div className="ml-4">
          <ProgressRing
            value={progress}
            size={88}
            strokeWidth={6}
            label={
              <div className="text-center">
                <p className="text-base font-bold text-slate-900">{progress}%</p>
                <p className="text-[9px] text-slate-400">done</p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  )
}
