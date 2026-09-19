'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navigation, ArrowLeft } from 'lucide-react'
import { ProgressStepper } from '@/components/onboarding/ProgressStepper'
import { ProfileStep } from '@/components/onboarding/ProfileStep'
import { AcademicStep } from '@/components/onboarding/AcademicStep'
import { SkillsStep } from '@/components/onboarding/SkillsStep'
import { DestinationStep } from '@/components/onboarding/DestinationStep'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { createStudentProfile, getStudentProfile } from '@/lib/api'
import type { StudentProfile } from '@/lib/types'

const STEPS = [
  { label: 'About You' },
  { label: 'Academics' },
  { label: 'Current Skills' },
  { label: 'Destination' },
]

const STEP_DESCRIPTIONS = [
  'Tell us where you are in your academic journey.',
  'Your academic details help calibrate workload recommendations. Skip if not applicable.',
  'Select the concepts you already feel comfortable with — or skip if you\'re just starting out.',
  'Select the career destination you want to navigate toward.',
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Partial<StudentProfile>>({
    currentSkills: [],
  })

  // Preload any existing profile data for editing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('waypoint_profile')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed) {
            setProfile(parsed)
          }
        } catch {
          // ignore corrupted json
        }
      }
    }
  }, [])

  const handleNext = (data: Partial<StudentProfile>) => {
    const updated = { ...profile, ...data }
    setProfile(updated)
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
    }
  }

  const handleFinal = async (data: { selectedDestinationId: string }) => {
    setSaving(true)
    const finalProfile: StudentProfile = {
      name: profile.name ?? 'Student',
      program: profile.program ?? 'Not specified',
      branch: profile.branch ?? 'Not specified',
      studentStage: profile.studentStage ?? 'just-exploring',
      semester: profile.semester,
      cgpa: profile.cgpa,
      creditsCompleted: profile.creditsCompleted,
      currentSkills: profile.currentSkills ?? [],
      selectedDestinationId: data.selectedDestinationId || 'ai-ml-engineer',
    }
    await createStudentProfile(finalProfile)
    router.push('/dashboard')
  }

  return (
    <AuthGuard>
    <div className="min-h-screen bg-slate-50/60 flex flex-col antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Wizard Navigation */}
      <nav className="border-b border-slate-200/80 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm tracking-wide">WAYPOINT</span>
              <span className="text-[10px] text-slate-400 font-normal block leading-none">Setup Wizard</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              Step {step + 1} of {STEPS.length}
            </span>
          </div>
        </div>
      </nav>

      {/* Wizard Progress Line */}
      <div className="w-full bg-slate-200/80 h-1">
        <motion.div
          className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600"
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        />
      </div>

      {/* Main Wizard Content Area */}
      <div className="flex-1 flex flex-col items-center justify-start py-8 sm:py-12 px-4 sm:px-6">
        <div className="w-full max-w-xl">
          {/* Stepper Header */}
          <div className="mb-8 flex justify-center overflow-x-auto pb-1">
            <ProgressStepper steps={STEPS} currentStep={step} />
          </div>

          {/* Form Card Container */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-lg shadow-slate-200/40 p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
                    <span>Part {step + 1}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1.5 tracking-tight">
                    {STEPS[step].label}
                  </h2>
                  <p className="text-sm text-slate-500">{STEP_DESCRIPTIONS[step]}</p>
                </div>

                {step === 0 && (
                  <ProfileStep
                    onNext={(d) => handleNext(d as Partial<StudentProfile>)}
                    defaultValues={
                      profile.name
                        ? {
                            name: profile.name,
                            branch: profile.branch ?? '',
                            program: profile.program ?? '',
                            semester: profile.semester,
                            studentStage: profile.studentStage,
                          }
                        : undefined
                    }
                  />
                )}
                {step === 1 && (
                  <AcademicStep
                    onNext={(d) => handleNext(d as Partial<StudentProfile>)}
                    defaultValues={
                      profile.cgpa !== undefined
                        ? { cgpa: profile.cgpa, creditsCompleted: profile.creditsCompleted }
                        : undefined
                    }
                  />
                )}
                {step === 2 && (
                  <SkillsStep
                    onNext={(d) => handleNext(d as Partial<StudentProfile>)}
                    defaultValues={{ currentSkills: profile.currentSkills ?? [] }}
                  />
                )}
                {step === 3 && (
                  <DestinationStep
                    onNext={handleFinal}
                    defaultValue={profile.selectedDestinationId ?? ''}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Back Action */}
          {step > 0 && (
            <div className="mt-4 flex justify-start">
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Previous step
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}
