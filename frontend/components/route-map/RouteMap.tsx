'use client'

import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  type NodeMouseHandler,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion } from 'framer-motion'
import { SkillNode } from './SkillNode'
import { SkillDetailPanel } from './SkillDetailPanel'
import { MapLegend } from './MapLegend'
import { SkeletonCard } from '@/components/ui/SkeletonLoader'
import { ErrorState } from '@/components/ui/ErrorState'
import { getRouteGraph, getRoutes } from '@/lib/api'
import { getSkillById } from '@/lib/mock-data/skills'
import type { Skill, Route, RouteNodeData } from '@/lib/types'
import {
  Compass,
  Layers,
  Sparkles,
  Zap,
  RotateCcw,
  Target,
  ArrowRight,
  Route as RouteIcon,
} from 'lucide-react'
import Link from 'next/link'

const nodeTypes = { skillNode: SkillNode }

const defaultEdgeOptions = {
  style: { stroke: '#94A3B8', strokeWidth: 2.2 },
  type: 'smoothstep' as const,
  animated: false,
}

const proOptions = { hideAttribution: true }

function RouteMapInner({ routeId }: { routeId: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const reactFlowInstance = useReactFlow()

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([getRouteGraph(routeId), getRoutes()])
      .then(([graph, allRoutes]) => {
        if (!graph) {
          setError('Route not found.')
          return
        }
        setNodes(graph.nodes)
        setEdges(graph.edges)
        setRoutes(allRoutes)
      })
      .catch(() => setError('Failed to load route map.'))
      .finally(() => setLoading(false))
  }, [routeId, setNodes, setEdges])

  const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
    const data = node.data as RouteNodeData
    if (data.isStart || data.isGoal) return
    const skill = getSkillById(data.skillId)
    setSelectedSkill(skill ?? null)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedSkill(null)
  }, [])

  const currentRoute = routes.find((r) => r.id === routeId) || {
    id: routeId,
    name: 'Balanced Route',
    totalWeeks: 16,
    skillCount: 12,
    workload: 'Medium',
  }

  const handleCenterOnNext = () => {
    reactFlowInstance.setCenter(100, 220, { zoom: 1.2, duration: 600 })
  }

  const handleResetView = () => {
    reactFlowInstance.fitView({ padding: 0.15, duration: 600 })
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Loading interactive route DAG graph...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <ErrorState
          message={error}
          onRetry={() => {
            setError(null)
            setLoading(true)
          }}
        />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative h-full w-full bg-slate-50/70 select-none overflow-hidden"
    >
      {/* Top Floating Route Control Banner */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-2xl z-20 flex flex-wrap items-center gap-2.5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-lg shadow-slate-200/50">
        {/* Route Dropdown / Switcher */}
        <div className="flex items-center gap-2 pr-3 sm:border-r border-slate-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">{currentRoute.name}</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                16w • 12 skills
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Target: AI / ML Engineer</p>
          </div>
        </div>

        {/* Quick Route Switches */}
        <div className="hidden md:flex items-center gap-1.5">
          {['balanced', 'fast-track', 'foundation-first'].map((id) => (
            <Link
              key={id}
              href={`/route/${id}`}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                routeId === id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {id === 'balanced' ? 'Balanced' : id === 'fast-track' ? 'Fast Track' : 'Foundation'}
            </Link>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={handleCenterOnNext}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors border border-blue-200"
            title="Focus on your immediate next skill"
          >
            <Target className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Focus Next Skill</span>
          </button>

          <button
            type="button"
            onClick={handleResetView}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
            title="Reset Map View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* React Flow Graph Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        proOptions={proOptions}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.35}
        maxZoom={1.8}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#CBD5E1"
        />
        <Controls
          showInteractive={false}
          position="bottom-right"
          className="!m-6"
        />
        <MiniMap
          nodeColor={(node) => {
            const d = node.data as RouteNodeData
            if (d?.isGoal) return '#F59E0B'
            if (d?.status === 'completed') return '#22C55E'
            if (d?.status === 'next') return '#2563EB'
            return '#CBD5E1'
          }}
          maskColor="rgba(248, 250, 252, 0.85)"
          position="top-right"
          className="!m-6 hidden lg:block"
        />
      </ReactFlow>

      {/* Floating Legend */}
      <MapLegend />

      {/* Slide-out Skill Detail Panel */}
      <SkillDetailPanel
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />
    </motion.div>
  )
}

export function RouteMap({ routeId }: { routeId: string }) {
  return (
    <ReactFlowProvider>
      <RouteMapInner routeId={routeId} />
    </ReactFlowProvider>
  )
}
