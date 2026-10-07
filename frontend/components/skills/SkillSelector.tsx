'use client'

import { useState, useMemo } from 'react'
import {
  SKILL_CATEGORIES,
  CANONICAL_SKILL_DEFINITIONS,
  searchSkillTaxonomy,
  normalizeSkillId,
  resolveSkillById,
  type CanonicalSkill,
} from '@/lib/skill-taxonomy'
import type { SkillCategory } from '@/lib/types'
import { Search, Plus, X, Check, Sparkles, Filter, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SkillSelectorProps {
  selectedSkills: string[]
  onChange: (skills: string[], proficiencies?: Record<string, 'Beginner' | 'Intermediate' | 'Advanced'>) => void
  initialProficiencies?: Record<string, 'Beginner' | 'Intermediate' | 'Advanced'>
  className?: string
  label?: string
  helperText?: string
}

export function SkillSelector({
  selectedSkills,
  onChange,
  initialProficiencies = {},
  className,
  label = 'Your Current Skills & Competencies',
  helperText = 'Select or search across 20 academic, scientific, engineering, design, and business disciplines.',
}: SkillSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [proficiencies, setProficiencies] =
    useState<Record<string, 'Beginner' | 'Intermediate' | 'Advanced'>>(initialProficiencies)

  // Custom skill inline modal/popover state
  const [customSkillName, setCustomSkillName] = useState('')
  const [customSkillCategory, setCustomSkillCategory] = useState<SkillCategory>('Research & Scientific Skills')
  const [customSkillProficiency, setCustomSkillProficiency] =
    useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate')
  const [showCustomModal, setShowCustomModal] = useState(false)

  // Normalized set of selected skill IDs for fast lookup
  const selectedNormalizedSet = useMemo(() => {
    return new Set(selectedSkills.map(normalizeSkillId))
  }, [selectedSkills])

  // Filtered skills list
  const filteredSkills = useMemo(() => {
    const list = searchSkillTaxonomy(searchQuery, activeCategory)
    return list
  }, [searchQuery, activeCategory])

  // Add or remove canonical skill
  const toggleSkill = (skill: CanonicalSkill) => {
    const norm = normalizeSkillId(skill.id)
    if (selectedNormalizedSet.has(norm)) {
      const updated = selectedSkills.filter((s) => normalizeSkillId(s) !== norm)
      const nextProfs = { ...proficiencies }
      delete nextProfs[norm]
      setProficiencies(nextProfs)
      onChange(updated, nextProfs)
    } else {
      const updated = [...selectedSkills, skill.id]
      const nextProfs = {
        ...proficiencies,
        [norm]: proficiencies[norm] || 'Intermediate',
      }
      setProficiencies(nextProfs)
      onChange(updated, nextProfs)
    }
  }

  // Remove skill
  const removeSkill = (skillId: string) => {
    const norm = normalizeSkillId(skillId)
    const updated = selectedSkills.filter((s) => normalizeSkillId(s) !== norm)
    const nextProfs = { ...proficiencies }
    delete nextProfs[norm]
    setProficiencies(nextProfs)
    onChange(updated, nextProfs)
  }

  // Update proficiency for a selected skill
  const updateProficiency = (
    skillId: string,
    level: 'Beginner' | 'Intermediate' | 'Advanced'
  ) => {
    const norm = normalizeSkillId(skillId)
    const nextProfs = {
      ...proficiencies,
      [norm]: level,
    }
    setProficiencies(nextProfs)
    onChange(selectedSkills, nextProfs)
  }

  // Handle adding custom skill
  const handleAddCustomSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = customSkillName.trim()
    if (!trimmed) return

    const norm = normalizeSkillId(trimmed)
    if (selectedNormalizedSet.has(norm)) {
      // Already selected
      setShowCustomModal(false)
      setCustomSkillName('')
      return
    }

    const updated = [...selectedSkills, trimmed]
    const nextProfs = {
      ...proficiencies,
      [norm]: customSkillProficiency,
    }
    setProficiencies(nextProfs)
    onChange(updated, nextProfs)
    setCustomSkillName('')
    setShowCustomModal(false)
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header Info */}
      <div>
        <label className="block text-sm font-bold text-slate-800">{label}</label>
        {helperText && <p className="text-xs text-slate-500 mt-0.5">{helperText}</p>}
      </div>

      {/* Search Bar + Add Custom Skill Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills (e.g., Quantum Mechanics, Linear Algebra, Technical Writing...)"
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowCustomModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 text-blue-600" />
          <span>Add Custom Skill</span>
        </button>
      </div>

      {/* Custom Skill Modal / Drawer Form */}
      {showCustomModal && (
        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Add Unlisted / Custom Skill
            </span>
            <button
              type="button"
              onClick={() => setShowCustomModal(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="sm:col-span-1">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Skill Name
              </label>
              <input
                type="text"
                value={customSkillName}
                onChange={(e) => setCustomSkillName(e.target.value)}
                placeholder="e.g. CRISPR, SolidWorks, SEO"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Category
              </label>
              <select
                value={customSkillCategory}
                onChange={(e) => setCustomSkillCategory(e.target.value as SkillCategory)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SKILL_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Proficiency
              </label>
              <select
                value={customSkillProficiency}
                onChange={(e) =>
                  setCustomSkillProficiency(
                    e.target.value as 'Beginner' | 'Intermediate' | 'Advanced'
                  )
                }
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="button"
              disabled={!customSkillName.trim()}
              onClick={() => handleAddCustomSkill()}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              Add to Profile
            </button>
          </div>
        </div>
      )}

      {/* Category Filter Pills (20 Broad Categories) */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          <Filter className="w-3 h-3" />
          <span>Filter by Discipline</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none py-1">
          <button
            type="button"
            onClick={() => setActiveCategory('All')}
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
              activeCategory === 'All'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            All Disciplines ({CANONICAL_SKILL_DEFINITIONS.length})
          </button>
          {SKILL_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
            const count = CANONICAL_SKILL_DEFINITIONS.filter((s) => s.category === cat.name).length
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.name)}
                className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all',
                  activeCategory === cat.name
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                {cat.name} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Taxonomy Skill Options (Chips Grid) */}
      <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-3.5 max-h-60 overflow-y-auto space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-200/60">
          <span>Click to select / unselect</span>
          <span className="font-semibold">{filteredSkills.length} available</span>
        </div>

        {filteredSkills.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-xs text-slate-500">No skills match &quot;{searchQuery}&quot;.</p>
            <button
              type="button"
              onClick={() => {
                setCustomSkillName(searchQuery)
                setShowCustomModal(true)
              }}
              className="mt-2 text-xs font-bold text-blue-600 hover:underline"
            >
              + Add &quot;{searchQuery}&quot; as a custom skill
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {filteredSkills.map((skill) => {
              const isSelected = selectedNormalizedSet.has(normalizeSkillId(skill.id))
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={cn(
                    'group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all text-left',
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  {isSelected ? (
                    <Check className="w-3 h-3 text-white stroke-[2.5]" />
                  ) : (
                    <Plus className="w-3 h-3 text-slate-400 group-hover:text-blue-500" />
                  )}
                  <span>{skill.name}</span>
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.2 rounded-full font-normal ml-0.5',
                      isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-400'
                    )}
                  >
                    {skill.category}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Selected Skills Tray with Proficiency Pickers */}
      {selectedSkills.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              Selected Skills ({selectedSkills.length})
            </span>
            <span className="text-[11px] text-slate-400">
              Adjust proficiency level for each skill
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {selectedSkills.map((rawSkillId) => {
              const norm = normalizeSkillId(rawSkillId)
              const resolved = resolveSkillById(rawSkillId)
              const level = proficiencies[norm] || 'Intermediate'

              return (
                <div
                  key={rawSkillId}
                  className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {resolved.name}
                      </span>
                      {resolved.isCustom && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded">
                          CUSTOM
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">
                      {resolved.category}
                    </span>
                  </div>

                  {/* Level selector + Remove */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <select
                      value={level}
                      onChange={(e) =>
                        updateProficiency(
                          rawSkillId,
                          e.target.value as 'Beginner' | 'Intermediate' | 'Advanced'
                        )
                      }
                      className="text-[11px] font-semibold py-1 px-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => removeSkill(rawSkillId)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-slate-100"
                      title="Remove skill"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
