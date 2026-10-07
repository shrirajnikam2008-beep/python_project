'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { SkillSelector } from '@/components/skills/SkillSelector'

interface SkillsStepProps {
  onNext: (data: {
    currentSkills: string[]
    skillProficiencies?: Record<string, 'Beginner' | 'Intermediate' | 'Advanced'>
  }) => void
  defaultValues?: {
    currentSkills?: string[]
    skillProficiencies?: Record<string, 'Beginner' | 'Intermediate' | 'Advanced'>
  }
}

export function SkillsStep({ onNext, defaultValues }: SkillsStepProps) {
  const [selected, setSelected] = useState<string[]>(
    defaultValues?.currentSkills ?? []
  )
  const [proficiencies, setProficiencies] = useState<
    Record<string, 'Beginner' | 'Intermediate' | 'Advanced'>
  >(defaultValues?.skillProficiencies ?? {})

  return (
    <div className="space-y-6">
      {/* Beginner shortcut */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between">
        <p className="text-xs text-blue-700 leading-relaxed pr-3">
          Select all skills you currently possess across engineering, scientific, research, design, and business disciplines.
        </p>
        <button
          type="button"
          onClick={() => onNext({ currentSkills: [], skillProficiencies: {} })}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-white border border-blue-200 hover:border-blue-400 px-3 py-1.5 rounded-lg transition-all shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Start from scratch
        </button>
      </div>

      {/* 20-Category Multi-Disciplinary Skill Selector */}
      <SkillSelector
        selectedSkills={selected}
        initialProficiencies={proficiencies}
        onChange={(skills, profs) => {
          setSelected(skills)
          if (profs) setProficiencies(profs)
        }}
        label="Select or Search Your Skills"
        helperText="Search from 80+ standard disciplines or add any custom skill."
      />

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          {selected.length === 0
            ? "No skills selected — that's fine!"
            : `${selected.length} skill${selected.length === 1 ? '' : 's'} selected`}
        </span>

        <Button
          onClick={() => onNext({ currentSkills: selected, skillProficiencies: proficiencies })}
          iconRight={<ArrowRight className="w-4 h-4" />}
          className="px-6 py-2.5 rounded-xl font-semibold"
        >
          Confirm Skills
        </Button>
      </div>
    </div>
  )
}
