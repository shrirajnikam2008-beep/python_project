import type { Route } from '@/lib/types'
import type { Node, Edge } from 'reactflow'
import type { RouteNodeData } from '@/lib/types'

export const mockRoutes: Route[] = [
  {
    id: 'balanced',
    name: 'Balanced Route',
    tagline: 'Steady progress, solid foundations.',
    description:
      'A well-paced route that balances depth and speed. Covers all critical skills with time to solidify understanding before moving forward.',
    workload: 'Medium',
    totalWeeks: 16,
    skillCount: 12,
    isRecommended: true,
    steps: [
      { skillId: 'data-structures', weekStart: 1, weekEnd: 3 },
      { skillId: 'linear-algebra', weekStart: 2, weekEnd: 5 },
      { skillId: 'statistics', weekStart: 4, weekEnd: 7 },
      { skillId: 'sql', weekStart: 4, weekEnd: 5 },
      { skillId: 'data-analysis', weekStart: 6, weekEnd: 8 },
      { skillId: 'machine-learning', weekStart: 8, weekEnd: 13 },
      { skillId: 'deep-learning', weekStart: 12, weekEnd: 16 },
      { skillId: 'mlops', weekStart: 15, weekEnd: 16, milestone: 'Deploy your first model' },
    ],
  },
  {
    id: 'fast-track',
    name: 'Fast Track',
    tagline: 'Move fast. Cover the essentials.',
    description:
      'A focused, high-intensity route for those who want to reach ML proficiency quickly. Less depth, faster progress.',
    workload: 'High',
    totalWeeks: 10,
    skillCount: 10,
    isRecommended: false,
    steps: [
      { skillId: 'data-structures', weekStart: 1, weekEnd: 2 },
      { skillId: 'linear-algebra', weekStart: 1, weekEnd: 3 },
      { skillId: 'statistics', weekStart: 2, weekEnd: 4 },
      { skillId: 'sql', weekStart: 3, weekEnd: 4 },
      { skillId: 'data-analysis', weekStart: 4, weekEnd: 5 },
      { skillId: 'machine-learning', weekStart: 5, weekEnd: 9 },
      { skillId: 'deep-learning', weekStart: 8, weekEnd: 10 },
    ],
  },
  {
    id: 'foundation-first',
    name: 'Foundation First',
    tagline: 'Build deep roots before reaching high.',
    description:
      'A thorough route that ensures you fully understand each skill before progressing. Best for those who prefer conceptual clarity over speed.',
    workload: 'Low',
    totalWeeks: 20,
    skillCount: 14,
    isRecommended: false,
    steps: [
      { skillId: 'data-structures', weekStart: 1, weekEnd: 4 },
      { skillId: 'linear-algebra', weekStart: 3, weekEnd: 7 },
      { skillId: 'statistics', weekStart: 6, weekEnd: 10 },
      { skillId: 'sql', weekStart: 5, weekEnd: 7 },
      { skillId: 'data-analysis', weekStart: 8, weekEnd: 11 },
      { skillId: 'machine-learning', weekStart: 11, weekEnd: 17 },
      { skillId: 'deep-learning', weekStart: 16, weekEnd: 20 },
      { skillId: 'nlp', weekStart: 19, weekEnd: 20 },
      { skillId: 'mlops', weekStart: 19, weekEnd: 20, milestone: 'Production-ready ML pipeline' },
    ],
  },
]

// ─── React Flow Graph Data for Balanced Route ─────────────────────────────
export const balancedRouteNodes: Node<RouteNodeData>[] = [
  // Start node
  {
    id: 'start',
    type: 'skillNode',
    position: { x: 340, y: 20 },
    data: {
      skillId: 'start',
      label: 'Start',
      category: 'Foundations',
      status: 'completed',
      priority: 'recommended',
      isStart: true,
    },
  },
  // Completed skills
  {
    id: 'python',
    type: 'skillNode',
    position: { x: 200, y: 100 },
    data: {
      skillId: 'python',
      label: 'Python',
      category: 'Programming',
      status: 'completed',
      priority: 'critical',
    },
  },
  {
    id: 'git',
    type: 'skillNode',
    position: { x: 480, y: 100 },
    data: {
      skillId: 'git',
      label: 'Git',
      category: 'Tools',
      status: 'completed',
      priority: 'recommended',
    },
  },
  // Next skill
  {
    id: 'data-structures',
    type: 'skillNode',
    position: { x: 100, y: 220 },
    data: {
      skillId: 'data-structures',
      label: 'Data Structures',
      category: 'Foundations',
      status: 'next',
      priority: 'critical',
    },
  },
  {
    id: 'linear-algebra',
    type: 'skillNode',
    position: { x: 340, y: 220 },
    data: {
      skillId: 'linear-algebra',
      label: 'Linear Algebra',
      category: 'Mathematics',
      status: 'next',
      priority: 'critical',
    },
  },
  {
    id: 'sql',
    type: 'skillNode',
    position: { x: 580, y: 220 },
    data: {
      skillId: 'sql',
      label: 'SQL',
      category: 'Databases',
      status: 'locked',
      priority: 'high',
    },
  },
  {
    id: 'statistics',
    type: 'skillNode',
    position: { x: 220, y: 340 },
    data: {
      skillId: 'statistics',
      label: 'Statistics',
      category: 'Mathematics',
      status: 'locked',
      priority: 'critical',
    },
  },
  {
    id: 'data-analysis',
    type: 'skillNode',
    position: { x: 460, y: 340 },
    data: {
      skillId: 'data-analysis',
      label: 'Data Analysis',
      category: 'Data Science',
      status: 'locked',
      priority: 'high',
    },
  },
  {
    id: 'machine-learning',
    type: 'skillNode',
    position: { x: 340, y: 460 },
    data: {
      skillId: 'machine-learning',
      label: 'Machine Learning',
      category: 'Machine Learning',
      status: 'locked',
      priority: 'critical',
    },
  },
  {
    id: 'deep-learning',
    type: 'skillNode',
    position: { x: 200, y: 580 },
    data: {
      skillId: 'deep-learning',
      label: 'Deep Learning',
      category: 'Machine Learning',
      status: 'locked',
      priority: 'high',
    },
  },
  {
    id: 'mlops',
    type: 'skillNode',
    position: { x: 480, y: 580 },
    data: {
      skillId: 'mlops',
      label: 'MLOps',
      category: 'Tools',
      status: 'locked',
      priority: 'recommended',
    },
  },
  // Goal node
  {
    id: 'goal',
    type: 'skillNode',
    position: { x: 340, y: 700 },
    data: {
      skillId: 'goal',
      label: 'AI / ML Engineer',
      category: 'Machine Learning',
      status: 'locked',
      priority: 'critical',
      isGoal: true,
    },
  },
]

export const balancedRouteEdges: Edge[] = [
  { id: 'e-start-python', source: 'start', target: 'python', type: 'smoothstep', animated: false },
  { id: 'e-start-git', source: 'start', target: 'git', type: 'smoothstep', animated: false },
  { id: 'e-python-ds', source: 'python', target: 'data-structures', type: 'smoothstep' },
  { id: 'e-python-la', source: 'python', target: 'linear-algebra', type: 'smoothstep' },
  { id: 'e-ds-sql', source: 'data-structures', target: 'sql', type: 'smoothstep' },
  { id: 'e-la-stats', source: 'linear-algebra', target: 'statistics', type: 'smoothstep' },
  { id: 'e-sql-da', source: 'sql', target: 'data-analysis', type: 'smoothstep' },
  { id: 'e-stats-da', source: 'statistics', target: 'data-analysis', type: 'smoothstep' },
  { id: 'e-stats-ml', source: 'statistics', target: 'machine-learning', type: 'smoothstep' },
  { id: 'e-da-ml', source: 'data-analysis', target: 'machine-learning', type: 'smoothstep' },
  { id: 'e-la-ml', source: 'linear-algebra', target: 'machine-learning', type: 'smoothstep' },
  { id: 'e-ml-dl', source: 'machine-learning', target: 'deep-learning', type: 'smoothstep' },
  { id: 'e-ml-mlops', source: 'machine-learning', target: 'mlops', type: 'smoothstep' },
  { id: 'e-git-mlops', source: 'git', target: 'mlops', type: 'smoothstep' },
  { id: 'e-dl-goal', source: 'deep-learning', target: 'goal', type: 'smoothstep' },
  { id: 'e-mlops-goal', source: 'mlops', target: 'goal', type: 'smoothstep' },
]

export const getRouteById = (id: string): Route | undefined =>
  mockRoutes.find((r) => r.id === id)