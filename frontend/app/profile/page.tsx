'use client'

import { useState, useEffect } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { getStudentProfile, updateStudentProfile, getDestinations } from '@/lib/api'
import type { StudentProfile, Destination } from '@/lib/types'
import { SkillSelector } from '@/components/skills/SkillSelector'
import {
  User,
  GraduationCap,
  Target,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Compass,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PROGRAM_OPTIONS = [
  'B.Tech Information Technology',
  'B.Tech Computer Science and Engineering',
  'B.Tech Electronics & Communication',
  'B.Tech Mechanical Engineering',
  'B.Tech Data Science & AI',
  'B.Sc Computer Science',
  'B.Sc Mathematics / Physics',
  'Dual Degree / Integrated M.Tech',
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [program, setProgram] = useState('')
  const [branch, setBranch] = useState('')
  const [semester, setSemester] = useState(1)
  const [cgpa, setCgpa] = useState(8.0)
  const [creditsCompleted, setCreditsCompleted] = useState(60)
  const [selectedDestinationId, setSelectedDestinationId] = useState('')
  const [currentSkills, setCurrentSkills] = useState<string[]>([])
  const [skillProficiencies, setSkillProficiencies] = useState<
    Record<string, 'Beginner' | 'Intermediate' | 'Advanced'>
  >({})
  const [careerGoals, setCareerGoals] = useState('')
  const [preferredDomains, setPreferredDomains] = useState('')
  const [preferredMode, setPreferredMode] = useState<'Remote' | 'In-person' | 'Hybrid'>('Hybrid')

  useEffect(() => {
    Promise.all([getStudentProfile(), getDestinations()])
      .then(([p, dests]) => {
        setProfile(p)
        setDestinations(dests)
        if (p) {
          setName(p.name || '')
          setProgram(p.program || '')
          setBranch(p.branch || '')
          setSemester(p.semester || 1)
          setCgpa(p.cgpa || 8.0)
          setCreditsCompleted(p.creditsCompleted || 60)
          setSelectedDestinationId(p.selectedDestinationId || 'ai-ml-engineer')
          setCurrentSkills(p.currentSkills || [])
          const goalsStr = Array.isArray(p.careerGoals)
            ? p.careerGoals.join(', ')
            : p.careerGoals || ''
          setCareerGoals(goalsStr)

          const domainsStr = Array.isArray(p.preferredDomains)
            ? p.preferredDomains.join(', ')
            : p.preferredDomains || ''
          setPreferredDomains(domainsStr)

          const validMode = (p.preferredMode === 'Remote' || p.preferredMode === 'In-person' || p.preferredMode === 'Hybrid')
            ? p.preferredMode
            : 'Hybrid'
          setPreferredMode(validMode)
        }
      })
      .catch((err) => {
        console.error('Failed to load profile:', err)
        setError('Failed to load profile details.')
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSaving(true)
    setError(null)
    setSavedSuccess(false)

    try {
      const updated = await updateStudentProfile({
        name,
        program,
        branch,
        semester,
        cgpa,
        creditsCompleted,
        selectedDestinationId,
        currentSkills,
        skillProficiencies,
        careerGoals: careerGoals
          ? careerGoals.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        preferredDomains: preferredDomains
          ? preferredDomains.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        preferredMode,
      })
      setProfile(updated)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 4000)
    } catch (err) {
      console.error(err)
      setError('Could not update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AuthGuard>
      <AppShell
        title="Student Profile & Competencies"
        breadcrumb={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Profile' },
        ]}
      >
        <div className="max-w-4xl mx-auto pb-16 space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/40 border border-blue-400/30 flex items-center justify-center text-2xl font-bold">
                  {name ? name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                    {name || 'Student Profile'}
                  </h1>
                  <p className="text-xs sm:text-sm text-blue-200 mt-0.5">
                    {program || 'Degree program'} • Semester {semester}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Profile</span>
              </button>
            </div>
          </div>

          {/* Success Banner */}
          <AnimatePresence>
            {savedSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm font-semibold shadow-xs"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p>Profile updated successfully!</p>
                  <p className="text-xs text-emerald-600 font-normal">
                    Your learning routes, skill gap analysis, and opportunity recommendations have been refreshed.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-sm">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading your profile...</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Section 1: Personal & Academic Info */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Personal &amp; Academic Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Alex Sharma"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Program / Degree
                    </label>
                    <input
                      type="text"
                      list="programs"
                      value={program}
                      onChange={(e) => {
                        setProgram(e.target.value)
                        setBranch(e.target.value)
                      }}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. B.Tech Information Technology"
                    />
                    <datalist id="programs">
                      {PROGRAM_OPTIONS.map((p) => (
                        <option key={p} value={p} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current Semester
                    </label>
                    <div className="flex gap-1.5 flex-wrap">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSemester(s)}
                          className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all ${
                            semester === s
                              ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current CGPA (out of 10)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.05"
                      value={cgpa}
                      onChange={(e) => setCgpa(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Destination Target */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Compass className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Career Destination Goal
                    </h2>
                    <p className="text-xs text-slate-500">
                      Your route DAG graph and skill gap roadmap align to this destination role.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {destinations.map((dest) => {
                    const isSelected = selectedDestinationId === dest.id
                    return (
                      <div
                        key={dest.id}
                        onClick={() => setSelectedDestinationId(dest.id)}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-600 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{dest.icon}</span>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {dest.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                          {dest.description}
                        </p>
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
                          {dest.requiredSkillCount} Core Skills
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Section 3: Comprehensive 20-Category Skill Selector */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Skills &amp; Multi-Disciplinary Competencies
                    </h2>
                    <p className="text-xs text-slate-500">
                      Include both technical engineering skills and academic, scientific, research, communication, business, and domain proficiencies.
                    </p>
                  </div>
                </div>

                <SkillSelector
                  selectedSkills={currentSkills}
                  initialProficiencies={skillProficiencies}
                  onChange={(skills, profs) => {
                    setCurrentSkills(skills)
                    if (profs) setSkillProficiencies(profs)
                  }}
                />
              </div>

              {/* Section 4: Preferences & Objectives */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Career Preferences &amp; Goals
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Career Goals (comma separated)
                    </label>
                    <input
                      type="text"
                      value={careerGoals}
                      onChange={(e) => setCareerGoals(e.target.value)}
                      placeholder="e.g. AI/ML Engineer, Graduate Researcher, Tech Lead"
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Mode
                    </label>
                    <div className="flex gap-2">
                      {(['Hybrid', 'Remote', 'In-person'] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setPreferredMode(mode)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                            preferredMode === mode
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm sticky bottom-4 z-20">
                <div className="text-xs text-slate-500">
                  {currentSkills.length} skills selected • Target: {destinations.find((d) => d.id === selectedDestinationId)?.title || 'Career Goal'}
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-95"
                >
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </AppShell>
    </AuthGuard>
  )
}
