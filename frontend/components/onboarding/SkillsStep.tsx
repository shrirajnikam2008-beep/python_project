'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const SKILL_CATEGORIES = [
  {
    category: 'Programming & Web',
    skills: [
      { id: 'python', label: 'Python' },
      { id: 'cpp', label: 'C++' },
      { id: 'java', label: 'Java' },
      { id: 'javascript', label: 'JavaScript' },
      { id: 'html-css', label: 'HTML / CSS' },
      { id: 'react', label: 'React' },
    ],
  },
  {
    category: 'Foundations & Math',
    skills: [
      { id: 'data-structures', label: 'Data Structures & Algorithms' },
      { id: 'linear-algebra', label: 'Linear Algebra' },
      { id: 'statistics', label: 'Statistics & Probability' },
    ],
  },
  {
    category: 'Data & Machine Learning',
    skills: [
      { id: 'sql', label: 'SQL & Relational DBs' },
      { id: 'machine-learning', label: 'Machine Learning (Basics)' },
    ],
  },
  {
    category: 'Tools & DevOps',
    skills: [
      { id: 'git', label: 'Git & Version Control' },
      { id: 'linux', label: 'Linux CLI' },
      { id: 'docker', label: 'Docker' },
    ],
  },
]

interface SkillsStepProps {
  onNext: (data: { currentSkills: string[] }) => void
  defaultValues?: { currentSkills: string[] }
}

export function SkillsStep({ onNext, defaultValues }: SkillsStepProps) {
  const [selected, setSelected] = useState<string[]>(
    defaultValues?.currentSkills ?? []
  )

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      {/* Beginner shortcut */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl">
        <p className="text-xs text-blue-700 leading-relaxed mb-2.5">
          Select what you already feel comfortable with. Waypoint will automatically compute what skills you need next.
        </p>
        <button
          type="button"
          onClick={() => onNext({ currentSkills: [] })}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-white border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-lg transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          I&apos;m a complete beginner — start from scratch
        </button>
      </div>

      <div className="space-y-4">
        {SKILL_CATEGORIES.map((group) => (
          <div key={group.category}>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              {group.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => {
                const active = selected.includes(skill.id)
                return (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => toggle(skill.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-150',
                      active
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                        : 'bg-white border-slate-200/90 text-slate-700 hover:border-slate-300 hover:bg-slate-50/80'
                    )}
                  >
                    {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    {skill.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          {selected.length === 0
            ? 'No skills selected — that\'s fine!'
            : `${selected.length} skill${selected.length === 1 ? '' : 's'} selected`}
        </span>

        <Button
          onClick={() => onNext({ currentSkills: selected })}
          iconRight={<ArrowRight className="w-4 h-4" />}
          className="px-6 py-2.5 rounded-xl font-semibold"
        >
          Confirm Skills
        </Button>
      </div>
    </div>
  )
}
