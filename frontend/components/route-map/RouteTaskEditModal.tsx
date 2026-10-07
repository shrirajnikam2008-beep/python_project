'use client'

import { useState } from 'react'
import type { RouteNodeData, SkillCategory, SkillStatus, SkillPriority } from '@/lib/types'
import { SKILL_CATEGORIES } from '@/lib/skill-taxonomy'
import {
  X,
  Save,
  Trash2,
  CheckCircle2,
  Play,
  RotateCcw,
  Sparkles,
  Calendar,
  Clock,
  Tag,
  AlertTriangle,
} from 'lucide-react'

interface RouteTaskEditModalProps {
  isOpen: boolean
  onClose: () => void
  taskData?: RouteNodeData | null
  existingNodes: { id: string; label: string }[]
  onSave: (data: RouteNodeData, connectFromId?: string) => void
  onDelete?: (taskId: string) => void
  isNew?: boolean
}

export function RouteTaskEditModal({
  isOpen,
  onClose,
  taskData,
  existingNodes,
  onSave,
  onDelete,
  isNew = false,
}: RouteTaskEditModalProps) {
  const [label, setLabel] = useState(taskData?.label || '')
  const [category, setCategory] = useState<SkillCategory>(
    (taskData?.category as SkillCategory) || 'Foundations'
  )
  const [status, setStatus] = useState<SkillStatus>(taskData?.status || 'next')
  const [priority, setPriority] = useState<SkillPriority>(
    taskData?.priority || 'high'
  )
  const [estimatedTime, setEstimatedTime] = useState(taskData?.estimatedTime || '3 weeks')
  const [targetDate, setTargetDate] = useState(taskData?.targetDate || '')
  const [milestone, setMilestone] = useState(taskData?.milestone || '')
  const [notes, setNotes] = useState(taskData?.notes || '')
  const [connectFromId, setConnectFromId] = useState(
    existingNodes.length > 0 ? existingNodes[0].id : 'start'
  )
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  if (!isOpen) return null

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!label.trim()) return

    const updated: RouteNodeData = {
      skillId: taskData?.skillId || `task-${Date.now()}`,
      label: label.trim(),
      category,
      status,
      priority,
      estimatedTime: estimatedTime.trim(),
      targetDate: targetDate.trim() || undefined,
      milestone: milestone.trim() || undefined,
      notes: notes.trim() || undefined,
      isCustom: isNew ? true : taskData?.isCustom ?? false,
      isGoal: taskData?.isGoal,
      isStart: taskData?.isStart,
    }

    onSave(updated, isNew ? connectFromId : undefined)
    onClose()
  }

  const handleDelete = () => {
    if (!taskData) return
    if (onDelete) {
      onDelete(taskData.skillId)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs font-bold text-xs">
              {isNew ? '+' : '✏️'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isNew ? 'Add Custom Task / Milestone' : 'Customize Route Task'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isNew
                  ? 'Add a new learning activity or milestone to your route map.'
                  : 'Edit details, update schedule, or adjust status.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Quick Status Bar */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Task Status
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(
                [
                  { id: 'next', label: 'Up Next', icon: Play, color: 'border-blue-500 text-blue-700 bg-blue-50' },
                  { id: 'in-progress', label: 'In Progress', icon: Clock, color: 'border-amber-500 text-amber-700 bg-amber-50' },
                  { id: 'completed', label: 'Completed', icon: CheckCircle2, color: 'border-emerald-500 text-emerald-700 bg-emerald-50' },
                  { id: 'locked', label: 'Planned', icon: Tag, color: 'border-slate-300 text-slate-600 bg-slate-100' },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatus(st.id)}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-bold border-2 transition-all ${
                    status === st.id
                      ? `${st.color} shadow-xs scale-102`
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <st.icon className="w-3.5 h-3.5 mb-1" />
                  <span className="text-[11px]">{st.label}</span>
                </button>
              ))}
            </div>
            {status === 'completed' && (
              <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                This task is marked complete. You can reopen it at any time.
              </p>
            )}
          </div>

          {/* Task Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Task / Skill Title *
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Deep Learning with PyTorch, Read Research Paper..."
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category / Domain
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SkillCategory)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SKILL_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as SkillPriority)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="critical">Critical (Must Have)</option>
                <option value="high">High Priority</option>
                <option value="recommended">Recommended (Elective)</option>
              </select>
            </div>
          </div>

          {/* Effort & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Effort / Duration
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="e.g. 2 weeks, 15 hours"
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Date / Deadline
              </label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Milestone Tag */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Milestone Achievement (Optional)
            </label>
            <div className="relative">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={milestone}
                onChange={(e) => setMilestone(e.target.value)}
                placeholder="e.g., Milestone: Deploy First Model, Publish Paper..."
                className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Connect From (only for new nodes) */}
          {isNew && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Connect Prerequisite (Place After)
              </label>
              <select
                value={connectFromId}
                onChange={(e) => setConnectFromId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {existingNodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    Connect after: {n.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notes / Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Personal Notes &amp; Learning Goals
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add key concepts, links to coursework, textbook chapters, or reminders..."
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Delete Danger Area (for existing nodes) */}
          {!isNew && onDelete && !taskData?.isStart && !taskData?.isGoal && (
            <div className="pt-3 border-t border-slate-100">
              {showDeleteConfirm ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-red-700">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Delete this task from your route? (Adjoining links will bridge)</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2.5 py-1 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-2.5 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-2xs"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete this task</span>
                </button>
              )}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleFormSubmit}
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isNew ? 'Add to Route Map' : 'Save Task Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
