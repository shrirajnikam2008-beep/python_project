'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

interface AcademicStepProps {
  onNext: (data: { cgpa: number; creditsCompleted: number }) => void
  defaultValues?: { cgpa: number; creditsCompleted: number }
}

export function AcademicStep({ onNext, defaultValues }: AcademicStepProps) {
  const [cgpa, setCgpa] = useState(defaultValues?.cgpa?.toString() ?? '')
  const [credits, setCredits] = useState(defaultValues?.creditsCompleted?.toString() ?? '')

  const cgpaNum = parseFloat(cgpa)
  const creditsNum = parseInt(credits, 10)
  const valid = !isNaN(cgpaNum) && cgpaNum >= 0 && cgpaNum <= 10 && !isNaN(creditsNum) && creditsNum >= 0

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="cgpa">
          Current CGPA
        </label>
        <input
          id="cgpa"
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={cgpa}
          onChange={(e) => setCgpa(e.target.value)}
          placeholder="e.g. 8.2"
          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <p className="mt-1.5 text-xs text-slate-400">On a 10-point scale</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="credits">
          Credits completed
        </label>
        <input
          id="credits"
          type="number"
          min="0"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
          placeholder="e.g. 60"
          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* CGPA visual indicator */}
      {cgpaNum > 0 && cgpaNum <= 10 && (
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Academic Standing</span>
            <span className="font-medium">{cgpaNum >= 9 ? 'Outstanding' : cgpaNum >= 8 ? 'Excellent' : cgpaNum >= 7 ? 'Good' : cgpaNum >= 6 ? 'Average' : 'Below Average'}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(cgpaNum / 10) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="pt-2">
        <Button
          disabled={!valid}
          onClick={() => onNext({ cgpa: cgpaNum, creditsCompleted: creditsNum })}
          iconRight={<ArrowRight className="w-4 h-4" />}
          className="w-full"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
