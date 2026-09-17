import type { Skill } from '@/lib/types'
import { SkillCard } from './SkillCard'

interface SkillGapSectionProps {
  title: string
  description: string
  skills: Skill[]
  isCurrentSkill?: boolean
}

export function SkillGapSection({ title, description, skills, isCurrentSkill }: SkillGapSectionProps) {
  if (skills.length === 0) return null
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} isCurrentSkill={isCurrentSkill} />
        ))}
      </div>
    </div>
  )
}
