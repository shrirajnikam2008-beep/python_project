import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  label: string
}

interface ProgressStepperProps {
  steps: Step[]
  currentStep: number // 0-indexed
}

export function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const done = i < currentStep
        const active = i === currentStep
        return (
          <div key={i} className="flex items-center">
            {/* Step circle */}
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-all duration-300',
                done
                  ? 'bg-green-500 border-green-500 text-white'
                  : active
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-slate-200 text-slate-400'
              )}
            >
              {done ? <Check className="w-3.5 h-3.5" /> : <span>{i + 1}</span>}
            </div>
            {/* Label */}
            <span
              className={cn(
                'ml-2 text-xs font-medium hidden sm:block',
                active ? 'text-slate-900' : done ? 'text-green-600' : 'text-slate-400'
              )}
            >
              {step.label}
            </span>
            {/* Connector */}
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'mx-3 h-px w-10 sm:w-16 transition-colors duration-300',
                  done ? 'bg-green-300' : 'bg-slate-200'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
