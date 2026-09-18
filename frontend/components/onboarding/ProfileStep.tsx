'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StudentStage } from '@/lib/types'

const programs = [
  'B.Tech Computer Science',
  'B.Tech Information Technology',
  'B.Tech Electronics',
  'B.Tech Mechanical',
  'B.Sc Computer Science',
  'B.Sc Mathematics / Statistics',
  'B.Com / BBA',
  'BA (Arts / Humanities)',
  'BCA',
  'MCA',
  'M.Tech Computer Science',
  'MBA',
  'Diploma in Engineering',
  'Class 11 / 12 (Science)',
  'Class 11 / 12 (Commerce)',
  'Other / Not listed',
]

const STUDENT_STAGES: { id: StudentStage; emoji: string; label: string; sub: string }[] = [
  { id: 'just-exploring', emoji: '🔍', label: 'Just Exploring', sub: 'Browsing options, no commitment' },
  { id: 'planning-to-enroll', emoji: '📋', label: 'Planning to Enroll', sub: 'Aspirant / Pre-admission' },
  { id: 'currently-enrolled', emoji: '🎓', label: 'Currently Enrolled', sub: 'Active student' },
  { id: 'working-professional', emoji: '💼', label: 'Working Professional', sub: 'Career changer / upskilling' },
]

interface ProfileStepProps {
  onNext: (data: { name: string; branch: string; program: string; semester?: number; studentStage: StudentStage }) => void
  defaultValues?: { name: string; branch: string; program: string; semester?: number; studentStage?: StudentStage }
}

export function ProfileStep({ onNext, defaultValues }: ProfileStepProps) {
  const [name, setName] = useState(defaultValues?.name ?? '')
  const [program, setProgram] = useState(defaultValues?.program ?? '')
  const [semester, setSemester] = useState<number | undefined>(defaultValues?.semester)
  const [stage, setStage] = useState<StudentStage>(defaultValues?.studentStage ?? 'currently-enrolled')

  const isEnrolled = stage === 'currently-enrolled'
  // Semester is only required for enrolled students
  const semesterOk = !isEnrolled || (semester !== undefined && semester >= 1)
  const valid = name.trim().length >= 2 && program.length > 0 && semesterOk

  return (
    <div className="space-y-5">
      {/* Student Stage */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Where are you in your journey?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {STUDENT_STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setStage(s.id)
                if (s.id !== 'currently-enrolled') setSemester(undefined)
              }}
              className={cn(
                'flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl border text-left transition-all text-xs',
                stage === s.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              <span className="text-base leading-none mt-0.5">{s.emoji}</span>
              <div>
                <p className="font-semibold">{s.label}</p>
                <p className={cn('text-[11px] mt-0.5', stage === s.id ? 'text-blue-200' : 'text-slate-400')}>
                  {s.sub}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="name">
          Your name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rahul"
          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Program */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="program">
          Program / Branch
        </label>
        <select
          id="program"
          value={program}
          onChange={(e) => setProgram(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="">Select your program</option>
          {programs.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Semester — only for enrolled students */}
      {isEnrolled && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Current semester
          </label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSemester(s)}
                className={`w-10 h-10 rounded-lg text-sm font-medium border transition-all ${
                  semester === s
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2">
        <Button
          disabled={!valid}
          onClick={() => onNext({ name, branch: program, program, semester, studentStage: stage })}
          iconRight={<ArrowRight className="w-4 h-4" />}
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

