'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

const programs = [
  'B.Tech Computer Science',
  'B.Tech Information Technology',
  'B.Tech Electronics',
  'B.Tech Mechanical',
  'B.Sc Computer Science',
  'BCA',
  'MCA',
  'M.Tech Computer Science',
]

interface ProfileStepProps {
  onNext: (data: { name: string; branch: string; program: string; semester: number }) => void
  defaultValues?: { name: string; branch: string; program: string; semester: number }
}

export function ProfileStep({ onNext, defaultValues }: ProfileStepProps) {
  const [name, setName] = useState(defaultValues?.name ?? '')
  const [program, setProgram] = useState(defaultValues?.program ?? '')
  const [semester, setSemester] = useState(defaultValues?.semester ?? 1)

  const valid = name.trim().length >= 2 && program.length > 0 && semester >= 1

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="name">
          Your name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Alex"
          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

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

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="semester">
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

      <div className="pt-2">
        <Button
          disabled={!valid}
          onClick={() => onNext({ name, branch: program, program, semester })}
          iconRight={<ArrowRight className="w-4 h-4" />}
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
