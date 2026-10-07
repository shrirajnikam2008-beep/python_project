'use client'

import { useCallback, useEffect, useState, useMemo } from 'react'
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
  type Node,
  type Edge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { motion } from 'framer-motion'
import { SkillNode } from './SkillNode'
import { SkillDetailPanel } from './SkillDetailPanel'
import { MapLegend } from './MapLegend'
import { RouteTaskEditModal } from './RouteTaskEditModal'
import { RegenerateConfirmModal } from './RegenerateConfirmModal'
import { ErrorState } from '@/components/ui/ErrorState'
import {
  getRouteGraph,
  getRoutes,
  getStudentProfile,
  saveCustomizedRoute,
  resetRouteToAIGenerated,
} from '@/lib/api'
import { getDestinationById } from '@/lib/mock-data/destinations'
import { getSkillById } from '@/lib/mock-data/skills'
import type { Skill, Route, RouteNodeData, SkillCategory } from '@/lib/types'
import {
  Compass,
  RotateCcw,
  Target,
  Edit3,
  Check,
  Plus,
  Sparkles,
  HelpCircle,
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
  const [nodes, setNodes, onNodesChange] = useNodesState<RouteNodeData>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [destinationTitle, setDestinationTitle] = useState('AI / ML Engineer')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  // Customization & Edit Mode State
  const [isEditMode, setIsEditMode] = useState(false)
  const [isCustomized, setIsCustomized] = useState(false)
  const [lastCustomizedAt, setLastCustomizedAt] = useState<string | undefined>(undefined)
  const [editingTask, setEditingTask] = useState<RouteNodeData | null>(null)
  const [isAddingNewTask, setIsAddingNewTask] = useState(false)
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false)

  const reactFlowInstance = useReactFlow()

  // Load Route & Graph
  const loadRouteData = useCallback(() => {
    setLoading(true)
    setError(null)
    getStudentProfile()
      .then((p) => {
        const dest = getDestinationById(p?.selectedDestinationId)
        setDestinationTitle(dest.title)
        return Promise.all([
          getRouteGraph(routeId, p?.selectedDestinationId, dest.title, p?.currentSkills ?? []),
          getRoutes(),
        ])
      })
      .then(([graph, allRoutes]) => {
        if (!graph) {
          setError('Route not found.')
          return
        }
        setIsCustomized(graph.isCustomized ?? false)
        setLastCustomizedAt(graph.lastCustomizedAt)
        // Set nodes with edit mode flag
        setNodes(
          graph.nodes.map((n) => ({
            ...n,
            data: {
              ...n.data,
              isEditMode,
            },
          }))
        )
        setEdges(graph.edges)
        setRoutes(allRoutes)
      })
      .catch(() => setError('Failed to load route map.'))
      .finally(() => setLoading(false))
  }, [routeId, setNodes, setEdges, isEditMode])

  useEffect(() => {
    loadRouteData()
  }, [loadRouteData])

  // Sync isEditMode into nodes data
  useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isEditMode,
        },
      }))
    )
  }, [isEditMode, setNodes])

  const currentRoute: Route = useMemo(() => {
    return (
      routes.find((r) => r.id === routeId) || {
        id: routeId,
        name:
          routeId === 'fast-track'
            ? 'Fast Track'
            : routeId === 'foundation-first'
            ? 'Foundation First'
            : 'Balanced Route',
        totalWeeks: routeId === 'fast-track' ? 10 : routeId === 'foundation-first' ? 20 : 16,
        skillCount: routeId === 'fast-track' ? 10 : routeId === 'foundation-first' ? 14 : 12,
        workload: (routeId === 'fast-track'
          ? 'High'
          : routeId === 'foundation-first'
          ? 'Low'
          : 'Medium') as Route['workload'],
        tagline: 'Customized student learning route.',
        description: 'Adapted specifically to your academic schedule and goals.',
        steps: [],
      }
    )
  }, [routes, routeId])

  // Click on a node
  const onNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      const data = node.data as RouteNodeData
      if (data.isStart || data.isGoal) return

      if (isEditMode) {
        // In Edit Mode, clicking opens the task editor modal directly
        setEditingTask(data)
      } else {
        // In View Mode, open the slide-out detail panel
        const skill: Skill = getSkillById(data.skillId) || {
          id: data.skillId,
          name: data.label,
          category: data.category as SkillCategory,
          description: data.notes || `Task node for ${data.label}`,
          currentLevel: (data.status === 'completed' ? 'Intermediate' : 'Beginner') as Skill['currentLevel'],
          requiredLevel: 'Intermediate' as Skill['requiredLevel'],
          status: data.status,
          priority: data.priority,
          prerequisites: [],
          dependents: [],
          estimatedWeeks: parseInt(data.estimatedTime || '3', 10) || 3,
          whyItMatters: `Crucial milestone in your customized ${currentRoute.name}.`,
          isCustom: data.isCustom,
        }
        setSelectedSkill(skill)
      }
    },
    [isEditMode, currentRoute.name]
  )

  const onPaneClick = useCallback(() => {
    setSelectedSkill(null)
  }, [])

  // Save edited task
  const handleSaveTask = (updatedData: RouteNodeData, connectFromId?: string) => {
    const isNew = !nodes.some((n) => n.id === updatedData.skillId)

    if (isNew && connectFromId) {
      // Connect after specified node
      const connectFromNode = nodes.find((n) => n.id === connectFromId)
      const newPos = connectFromNode
        ? { x: connectFromNode.position.x + 40, y: connectFromNode.position.y + 110 }
        : { x: 340, y: 350 }

      const newNode: Node<RouteNodeData> = {
        id: updatedData.skillId,
        type: 'skillNode',
        position: newPos,
        data: {
          ...updatedData,
          isEditMode,
          isCustom: true,
        },
      }

      const newEdge: Edge = {
        id: `e-${connectFromId}-${updatedData.skillId}`,
        source: connectFromId,
        target: updatedData.skillId,
        type: 'smoothstep',
      }

      const updatedNodes = [...nodes, newNode]
      const updatedEdges = [...edges, newEdge]
      setNodes(updatedNodes)
      setEdges(updatedEdges)
      setIsCustomized(true)
      saveCustomizedRoute(routeId, currentRoute, updatedNodes, updatedEdges)
    } else {
      // Update existing node
      const updatedNodes = nodes.map((n) => {
        if (n.id === updatedData.skillId) {
          return {
            ...n,
            data: {
              ...n.data,
              ...updatedData,
              isEditMode,
            },
          }
        }
        return n
      })

      setNodes(updatedNodes)
      setIsCustomized(true)
      saveCustomizedRoute(routeId, currentRoute, updatedNodes, edges)

      // Sync with selectedSkill if open
      if (selectedSkill && selectedSkill.id === updatedData.skillId) {
        setSelectedSkill({
          ...selectedSkill,
          name: updatedData.label,
          category: updatedData.category as SkillCategory,
          status: updatedData.status,
          priority: updatedData.priority,
        })
      }
    }
  }

  // Delete task with edge bridging
  const handleDeleteTask = (taskId: string) => {
    // Find incoming sources and outgoing targets
    const incomingSources = edges.filter((e) => e.target === taskId).map((e) => e.source)
    const outgoingTargets = edges.filter((e) => e.source === taskId).map((e) => e.target)

    // Bridge incoming to outgoing
    const bridgedEdges: Edge[] = []
    incomingSources.forEach((src) => {
      outgoingTargets.forEach((tgt) => {
        if (src !== tgt && !edges.some((e) => e.source === src && e.target === tgt)) {
          bridgedEdges.push({
            id: `e-${src}-${tgt}`,
            source: src,
            target: tgt,
            type: 'smoothstep',
          })
        }
      })
    })

    const updatedNodes = nodes.filter((n) => n.id !== taskId)
    const updatedEdges = [
      ...edges.filter((e) => e.source !== taskId && e.target !== taskId),
      ...bridgedEdges,
    ]

    setNodes(updatedNodes)
    setEdges(updatedEdges)
    setIsCustomized(true)
    saveCustomizedRoute(routeId, currentRoute, updatedNodes, updatedEdges)

    if (selectedSkill?.id === taskId) {
      setSelectedSkill(null)
    }
  }

  // Quick Status update (e.g., Reopening completed task, marking completed)
  const handleUpdateStatus = (skillId: string, status: Skill['status']) => {
    const updatedNodes = nodes.map((n) => {
      if (n.id === skillId) {
        return {
          ...n,
          data: {
            ...n.data,
            status,
          },
        }
      }
      return n
    })

    setNodes(updatedNodes)
    setIsCustomized(true)
    saveCustomizedRoute(routeId, currentRoute, updatedNodes, edges)

    if (selectedSkill && selectedSkill.id === skillId) {
      setSelectedSkill({
        ...selectedSkill,
        status,
      })
    }
  }

  // Handle Route Regeneration (reset to AI recommended)
  const handleRegenerateClick = () => {
    if (isCustomized) {
      setShowRegenerateConfirm(true)
    } else {
      loadRouteData()
    }
  }

  const handleConfirmRegenerate = async () => {
    await resetRouteToAIGenerated(routeId)
    setIsCustomized(false)
    loadRouteData()
  }

  const handleCenterOnNext = () => {
    const nextNode = nodes.find((n) => n.data.status === 'next' || n.data.status === 'in-progress')
    if (nextNode) {
      reactFlowInstance.setCenter(nextNode.position.x + 80, nextNode.position.y + 40, {
        zoom: 1.2,
        duration: 600,
      })
    } else {
      reactFlowInstance.setCenter(100, 220, { zoom: 1.2, duration: 600 })
    }
  }

  const handleResetView = () => {
    reactFlowInstance.fitView({ padding: 0.15, duration: 600 })
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">
            Loading interactive route DAG graph...
          </p>
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
            loadRouteData()
          }}
        />
      </div>
    )
  }

  // Nodes suitable for connecting new tasks to
  const existingNodeOptions = nodes
    .filter((n) => !n.data.isGoal)
    .map((n) => ({ id: n.id, label: n.data.label }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative h-full w-full bg-slate-50/70 select-none overflow-hidden"
    >
      {/* Top Floating Route Control Banner */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-4xl z-20 flex flex-wrap items-center gap-2.5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-lg shadow-slate-200/50">
        {/* Route Dropdown / Switcher */}
        <div className="flex items-center gap-2 pr-3 sm:border-r border-slate-200">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-900">{currentRoute.name}</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                {currentRoute.totalWeeks}w • {nodes.filter((n) => !n.data.isStart && !n.data.isGoal).length} tasks
              </span>

              {/* Status Badge: AI Recommended vs Customized by You */}
              {isCustomized ? (
                <span
                  className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded-full border border-indigo-200 flex items-center gap-1"
                  title={`Customized by you${lastCustomizedAt ? ` at ${new Date(lastCustomizedAt).toLocaleTimeString()}` : ''}`}
                >
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  Customized by You
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.2 rounded-full border border-slate-200">
                  AI Recommended
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400">Target: {destinationTitle}</p>
          </div>
        </div>

        {/* Quick Route Switches */}
        <div className="hidden lg:flex items-center gap-1.5">
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
        <div className="flex items-center gap-1.5 ml-auto flex-wrap">
          {/* Edit Route Button (Primary Feature) */}
          <button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isEditMode
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            }`}
          >
            {isEditMode ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Done Editing</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Route</span>
              </>
            )}
          </button>

          {/* Add Task Button (Visible in Edit Mode or always) */}
          <button
            type="button"
            onClick={() => setIsAddingNewTask(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors border border-slate-200"
            title="Add a custom task or milestone"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Add Task</span>
          </button>

          {/* Regenerate Route Button */}
          <button
            type="button"
            onClick={handleRegenerateClick}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-medium transition-colors border border-slate-200"
            title="Regenerate Route using AI recommendation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Regenerate</span>
          </button>

          {/* Focus Next Skill */}
          <button
            type="button"
            onClick={handleCenterOnNext}
            className="p-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors border border-blue-200"
            title="Focus next skill"
          >
            <Target className="w-3.5 h-3.5" />
          </button>

          {/* Reset View */}
          <button
            type="button"
            onClick={handleResetView}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium transition-colors"
            title="Fit Map View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Edit Mode Instruction Banner */}
      {isEditMode && (
        <div className="absolute top-20 left-4 z-20 bg-emerald-50/90 backdrop-blur-xs border border-emerald-300 text-emerald-900 rounded-xl px-3.5 py-2 text-xs font-medium shadow-md flex items-center gap-2">
          <Edit3 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            <strong>Edit Mode Active:</strong> Click any node to edit title, status, notes, or delete it. Drag nodes to customize arrangement.
          </span>
        </div>
      )}

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
        nodesDraggable={true}
        nodesConnectable={isEditMode}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.35}
        maxZoom={1.8}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#CBD5E1" />
        <Controls showInteractive={false} position="bottom-right" className="!m-6" />
        <MiniMap
          nodeColor={(node) => {
            const d = node.data as RouteNodeData
            if (d?.isGoal) return '#F59E0B'
            if (d?.status === 'completed') return '#22C55E'
            if (d?.status === 'in-progress') return '#F59E0B'
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
        onUpdateStatus={handleUpdateStatus}
        onEditTask={(skill) => {
          const nodeData = nodes.find((n) => n.id === skill.id)?.data || {
            skillId: skill.id,
            label: skill.name,
            category: skill.category,
            status: skill.status,
            priority: skill.priority,
            estimatedTime: `${skill.estimatedWeeks} weeks`,
            notes: skill.description,
            isCustom: skill.isCustom,
          }
          setEditingTask(nodeData)
        }}
      />

      {/* Route Task Edit Modal (for editing existing task) */}
      <RouteTaskEditModal
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        taskData={editingTask}
        existingNodes={existingNodeOptions}
        onSave={(data) => handleSaveTask(data)}
        onDelete={(taskId) => handleDeleteTask(taskId)}
        isNew={false}
      />

      {/* Add Task Modal (for adding new task) */}
      <RouteTaskEditModal
        isOpen={isAddingNewTask}
        onClose={() => setIsAddingNewTask(false)}
        taskData={null}
        existingNodes={existingNodeOptions}
        onSave={(data, connectFromId) => handleSaveTask(data, connectFromId)}
        isNew={true}
      />

      {/* Regenerate Route Warning Modal */}
      <RegenerateConfirmModal
        isOpen={showRegenerateConfirm}
        onClose={() => setShowRegenerateConfirm(false)}
        onConfirm={handleConfirmRegenerate}
        lastCustomizedAt={lastCustomizedAt}
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
