'use client'

import { motion } from 'framer-motion'
import { Navigation, Check, Play, Lock, Trophy, Sparkles } from 'lucide-react'

type NodeStatus = 'completed' | 'active' | 'locked' | 'goal'

interface VisualNode {
  id: string
  label: string
  sub: string
  x: number
  y: number
  status: NodeStatus
  icon?: string
}

const nodes: VisualNode[] = [
  { id: 'start', label: 'You (Current)', sub: 'Semester 5 • IT', x: 190, y: 35, status: 'completed' },
  { id: 'python', label: 'Python & Git', sub: 'Completed Foundation', x: 90, y: 120, status: 'completed' },
  { id: 'math', label: 'Linear Algebra', sub: 'Mathematics Track', x: 290, y: 120, status: 'completed' },
  { id: 'ds', label: 'Data Structures', sub: 'Up Next (Prerequisite)', x: 90, y: 215, status: 'active' },
  { id: 'stats', label: 'Statistics & Prob', sub: 'Locked Gap', x: 290, y: 215, status: 'locked' },
  { id: 'ml', label: 'Machine Learning', sub: 'Core Discipline', x: 190, y: 310, status: 'locked' },
  { id: 'goal', label: 'AI / ML Engineer', sub: 'Career Destination', x: 190, y: 405, status: 'goal' },
]

const edges = [
  { from: 'start', to: 'python', x1: 190, y1: 55, x2: 90, y2: 105, completed: true },
  { from: 'start', to: 'math', x1: 190, y1: 55, x2: 290, y2: 105, completed: true },
  { from: 'python', to: 'ds', x1: 90, y1: 140, x2: 90, y2: 200, active: true },
  { from: 'math', to: 'stats', x1: 290, y1: 140, x2: 290, y2: 200, completed: false },
  { from: 'ds', to: 'ml', x1: 90, y1: 235, x2: 190, y2: 295, completed: false },
  { from: 'stats', to: 'ml', x1: 290, y1: 235, x2: 190, y2: 295, completed: false },
  { from: 'ml', to: 'goal', x1: 190, y1: 330, x2: 190, y2: 390, completed: false },
]

export function HeroRouteViz() {
  return (
    <div className="relative w-full max-w-[420px] bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-5 overflow-hidden">
      {/* Background coordinate grid */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #94A3B8 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Top Header Card Info */}
      <div className="relative flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white">
            <Navigation className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 tracking-tight">Interactive Route Preview</span>
        </div>
        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Optimal Path
        </span>
      </div>

      <div className="relative h-[450px] w-full">
        <svg width="380" height="450" viewBox="0 0 380 450" className="w-full h-full overflow-visible">
          {/* Connecting Edge Paths */}
          {edges.map((edge, i) => (
            <motion.path
              key={`${edge.from}-${edge.to}`}
              d={`M ${edge.x1} ${edge.y1} C ${edge.x1} ${(edge.y1 + edge.y2) / 2}, ${edge.x2} ${(edge.y1 + edge.y2) / 2}, ${edge.x2} ${edge.y2}`}
              fill="none"
              stroke={edge.completed ? '#22C55E' : edge.active ? '#3B82F6' : '#CBD5E1'}
              strokeWidth={edge.active ? '2.5' : '2'}
              strokeDasharray={edge.completed || edge.active ? undefined : '4 3'}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
            />
          ))}

          {/* Render Nodes */}
          {nodes.map((node, i) => {
            const isCompleted = node.status === 'completed'
            const isActive = node.status === 'active'
            const isGoal = node.status === 'goal'

            return (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
              >
                {/* Node Box */}
                <rect
                  x={node.x - 70}
                  y={node.y - 18}
                  width="140"
                  height="36"
                  rx="10"
                  fill={isGoal ? '#0F172A' : isActive ? '#EFF6FF' : isCompleted ? '#FFFFFF' : '#F8FAFC'}
                  stroke={isGoal ? '#1E293B' : isActive ? '#3B82F6' : isCompleted ? '#86EFAC' : '#E2E8F0'}
                  strokeWidth={isActive ? '2' : '1.25'}
                  className="filter drop-shadow-xs"
                />

                {/* Node Status Dot / Icon Container */}
                <circle
                  cx={node.x - 52}
                  cy={node.y}
                  r="7"
                  fill={isGoal ? '#F59E0B' : isActive ? '#3B82F6' : isCompleted ? '#22C55E' : '#94A3B8'}
                />

                {/* Main Label */}
                <text
                  x={node.x - 38}
                  y={node.y - 2}
                  fontSize="9.5"
                  fontWeight="700"
                  fill={isGoal ? '#FFFFFF' : isActive ? '#1D4ED8' : isCompleted ? '#0F172A' : '#64748B'}
                  fontFamily="Inter, sans-serif"
                >
                  {node.label}
                </text>

                {/* Subtitle */}
                <text
                  x={node.x - 38}
                  y={node.y + 9}
                  fontSize="7.5"
                  fill={isGoal ? '#94A3B8' : isActive ? '#3B82F6' : '#94A3B8'}
                  fontFamily="Inter, sans-serif"
                >
                  {node.sub}
                </text>
              </motion.g>
            )
          })}
        </svg>
      </div>

      {/* Interactive Legend Bar */}
      <div className="relative mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Acquired (4)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span>Next Up (1)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          <span>Locked (6)</span>
        </div>
      </div>
    </div>
  )
}
