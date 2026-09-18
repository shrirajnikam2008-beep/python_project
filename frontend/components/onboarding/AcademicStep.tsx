'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRight, SkipForward } from 'lucide-react'

interface AcademicStepProps {
  onNext: (data: { cgpa?: number; creditsCompleted?: number }) => void
  defaultValues?: { cgpa?: number; creditsCompleted?: number }
}

export function AcademicStep({ onNext, defaultValues }: AcademicStepProps) {
  const [skip, setSkip] = useState(!defaultValues?.cgpa)
  const [cgpa, setCgpa] = useState(defaultValues?.cgpa?.toString() ?? '')
  const [credits, setCredits] = useState(defaultValues?.creditsCompleted?.toString() ?? '')

  const cgpaNum = parseFloat(cgpa)
  const creditsNum = parseInt(credits, 10)
  const filledValid = !isNaN(cgpaNum) && cgpaNum >= 0 && cgpaNum <= 10 && !isNaN(creditsNum) && creditsNum >= 0
  const valid = skip || filledValid

  const handleContinue = () => {
    if (skip) {
      onNext({ cgpa: undefined, creditsCompleted: undefined })
    } else {
      onNext({ cgpa: cgpaNum, creditsCompleted: creditsNum })
    }
  }

  return (
    <div className="space-y-5">
      {/* Skip Toggle */}
      <div
        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
          skip ? 'bg-slate-100 border-slate-300' : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
        onClick={() => setSkip((v) => !v)}
      >
        <div className="flex items-center gap-2.5">
          <SkipForward className={`w-4 h-4 ${skip ? 'text-slate-600' : 'text-slate-400'}`} />
          <div>
            <p className="text-xs font-semibold text-slate-700">Not applicable / Skip</p>
            <p className="text-[11px] text-slate-400">For students not yet enrolled or just exploring</p>
          </div>
        </div>
        <div className={`w-10 h-5 rounded-full transition-colors ${skip ? 'bg-blue-600' : 'bg-slate-200'} relative`}>
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${skip ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
      </div>

      {!skip && (
        <>
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
        </>
      )}

      <div className="pt-2">
        <Button
          disabled={!valid}
          onClick={handleContinue}
          iconRight={<ArrowRight className="w-4 h-4" />}
          className="w-full"
        >
          {skip ? 'Skip & Continue' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}

