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

// ─── React Flow Graph Data for Fast Track Route (10 Weeks) ──────────────────
export const fastTrackRouteNodes: Node<RouteNodeData>[] = [
  {
    id: 'start',
    type: 'skillNode',
    position: { x: 320, y: 20 },
    data: { skillId: 'start', label: 'Start', category: 'Foundations', status: 'completed', priority: 'recommended', isStart: true },
  },
  {
    id: 'python',
    type: 'skillNode',
    position: { x: 320, y: 100 },
    data: { skillId: 'python', label: 'Python (Fast)', category: 'Programming', status: 'completed', priority: 'critical' },
  },
  {
    id: 'data-structures',
    type: 'skillNode',
    position: { x: 180, y: 210 },
    data: { skillId: 'data-structures', label: 'Data Structures', category: 'Foundations', status: 'next', priority: 'critical' },
  },
  {
    id: 'linear-algebra',
    type: 'skillNode',
    position: { x: 460, y: 210 },
    data: { skillId: 'linear-algebra', label: 'Linear Algebra', category: 'Mathematics', status: 'next', priority: 'critical' },
  },
  {
    id: 'sql',
    type: 'skillNode',
    position: { x: 180, y: 320 },
    data: { skillId: 'sql', label: 'SQL Essentials', category: 'Databases', status: 'locked', priority: 'high' },
  },
  {
    id: 'statistics',
    type: 'skillNode',
    position: { x: 460, y: 320 },
    data: { skillId: 'statistics', label: 'Applied Stats', category: 'Mathematics', status: 'locked', priority: 'critical' },
  },
  {
    id: 'data-analysis',
    type: 'skillNode',
    position: { x: 320, y: 430 },
    data: { skillId: 'data-analysis', label: 'Data Analysis', category: 'Data Science', status: 'locked', priority: 'high' },
  },
  {
    id: 'machine-learning',
    type: 'skillNode',
    position: { x: 320, y: 540 },
    data: { skillId: 'machine-learning', label: 'Machine Learning', category: 'Machine Learning', status: 'locked', priority: 'critical' },
  },
  {
    id: 'deep-learning',
    type: 'skillNode',
    position: { x: 320, y: 650 },
    data: { skillId: 'deep-learning', label: 'Deep Learning', category: 'Machine Learning', status: 'locked', priority: 'high' },
  },
  {
    id: 'goal',
    type: 'skillNode',
    position: { x: 320, y: 760 },
    data: { skillId: 'goal', label: 'AI / ML Engineer', category: 'Machine Learning', status: 'locked', priority: 'critical', isGoal: true },
  },
]

export const fastTrackRouteEdges: Edge[] = [
  { id: 'ft-start-python', source: 'start', target: 'python', type: 'smoothstep' },
  { id: 'ft-py-ds', source: 'python', target: 'data-structures', type: 'smoothstep' },
  { id: 'ft-py-la', source: 'python', target: 'linear-algebra', type: 'smoothstep' },
  { id: 'ft-ds-sql', source: 'data-structures', target: 'sql', type: 'smoothstep' },
  { id: 'ft-la-stats', source: 'linear-algebra', target: 'statistics', type: 'smoothstep' },
  { id: 'ft-sql-da', source: 'sql', target: 'data-analysis', type: 'smoothstep' },
  { id: 'ft-stats-da', source: 'statistics', target: 'data-analysis', type: 'smoothstep' },
  { id: 'ft-da-ml', source: 'data-analysis', target: 'machine-learning', type: 'smoothstep' },
  { id: 'ft-stats-ml', source: 'statistics', target: 'machine-learning', type: 'smoothstep' },
  { id: 'ft-ml-dl', source: 'machine-learning', target: 'deep-learning', type: 'smoothstep' },
  { id: 'ft-dl-goal', source: 'deep-learning', target: 'goal', type: 'smoothstep' },
]

// ─── React Flow Graph Data for Foundation First Route (20 Weeks) ─────────────
export const foundationRouteNodes: Node<RouteNodeData>[] = [
  {
    id: 'start',
    type: 'skillNode',
    position: { x: 360, y: 20 },
    data: { skillId: 'start', label: 'Start', category: 'Foundations', status: 'completed', priority: 'recommended', isStart: true },
  },
  {
    id: 'python',
    type: 'skillNode',
    position: { x: 200, y: 100 },
    data: { skillId: 'python', label: 'Python Mastery', category: 'Programming', status: 'completed', priority: 'critical' },
  },
  {
    id: 'git',
    type: 'skillNode',
    position: { x: 520, y: 100 },
    data: { skillId: 'git', label: 'Git & Linux', category: 'Tools', status: 'completed', priority: 'recommended' },
  },
  {
    id: 'data-structures',
    type: 'skillNode',
    position: { x: 120, y: 210 },
    data: { skillId: 'data-structures', label: 'Data Structures', category: 'Foundations', status: 'next', priority: 'critical' },
  },
  {
    id: 'linear-algebra',
    type: 'skillNode',
    position: { x: 360, y: 210 },
    data: { skillId: 'linear-algebra', label: 'Linear Algebra', category: 'Mathematics', status: 'next', priority: 'critical' },
  },
  {
    id: 'cloud-basics',
    type: 'skillNode',
    position: { x: 600, y: 210 },
    data: { skillId: 'cloud-basics', label: 'Cloud Basics', category: 'Tools', status: 'locked', priority: 'recommended' },
  },
  {
    id: 'sql',
    type: 'skillNode',
    position: { x: 120, y: 320 },
    data: { skillId: 'sql', label: 'Advanced SQL & DBs', category: 'Databases', status: 'locked', priority: 'high' },
  },
  {
    id: 'statistics',
    type: 'skillNode',
    position: { x: 360, y: 320 },
    data: { skillId: 'statistics', label: 'Rigorous Stats', category: 'Mathematics', status: 'locked', priority: 'critical' },
  },
  {
    id: 'data-analysis',
    type: 'skillNode',
    position: { x: 240, y: 430 },
    data: { skillId: 'data-analysis', label: 'Data Analysis & EDA', category: 'Data Science', status: 'locked', priority: 'high' },
  },
  {
    id: 'mlops',
    type: 'skillNode',
    position: { x: 500, y: 430 },
    data: { skillId: 'mlops', label: 'MLOps Pipeline', category: 'Tools', status: 'locked', priority: 'recommended' },
  },
  {
    id: 'machine-learning',
    type: 'skillNode',
    position: { x: 240, y: 540 },
    data: { skillId: 'machine-learning', label: 'Machine Learning', category: 'Machine Learning', status: 'locked', priority: 'critical' },
  },
  {
    id: 'deep-learning',
    type: 'skillNode',
    position: { x: 240, y: 650 },
    data: { skillId: 'deep-learning', label: 'Deep Learning', category: 'Machine Learning', status: 'locked', priority: 'high' },
  },
  {
    id: 'nlp',
    type: 'skillNode',
    position: { x: 480, y: 650 },
    data: { skillId: 'nlp', label: 'NLP & Transformers', category: 'Machine Learning', status: 'locked', priority: 'recommended' },
  },
  {
    id: 'goal',
    type: 'skillNode',
    position: { x: 360, y: 770 },
    data: { skillId: 'goal', label: 'AI / ML Engineer', category: 'Machine Learning', status: 'locked', priority: 'critical', isGoal: true },
  },
]

export const foundationRouteEdges: Edge[] = [
  { id: 'fn-start-py', source: 'start', target: 'python', type: 'smoothstep' },
  { id: 'fn-start-git', source: 'start', target: 'git', type: 'smoothstep' },
  { id: 'fn-py-ds', source: 'python', target: 'data-structures', type: 'smoothstep' },
  { id: 'fn-py-la', source: 'python', target: 'linear-algebra', type: 'smoothstep' },
  { id: 'fn-git-cloud', source: 'git', target: 'cloud-basics', type: 'smoothstep' },
  { id: 'fn-ds-sql', source: 'data-structures', target: 'sql', type: 'smoothstep' },
  { id: 'fn-la-stats', source: 'linear-algebra', target: 'statistics', type: 'smoothstep' },
  { id: 'fn-sql-da', source: 'sql', target: 'data-analysis', type: 'smoothstep' },
  { id: 'fn-stats-da', source: 'statistics', target: 'data-analysis', type: 'smoothstep' },
  { id: 'fn-cloud-mlops', source: 'cloud-basics', target: 'mlops', type: 'smoothstep' },
  { id: 'fn-da-ml', source: 'data-analysis', target: 'machine-learning', type: 'smoothstep' },
  { id: 'fn-stats-ml', source: 'statistics', target: 'machine-learning', type: 'smoothstep' },
  { id: 'fn-ml-dl', source: 'machine-learning', target: 'deep-learning', type: 'smoothstep' },
  { id: 'fn-ml-mlops', source: 'machine-learning', target: 'mlops', type: 'smoothstep' },
  { id: 'fn-dl-nlp', source: 'deep-learning', target: 'nlp', type: 'smoothstep' },
  { id: 'fn-dl-goal', source: 'deep-learning', target: 'goal', type: 'smoothstep' },
  { id: 'fn-nlp-goal', source: 'nlp', target: 'goal', type: 'smoothstep' },
  { id: 'fn-mlops-goal', source: 'mlops', target: 'goal', type: 'smoothstep' },
]

export function getRouteGraphData(
  routeId: string,
  destinationTitle?: string
): { nodes: Node<RouteNodeData>[]; edges: Edge[] } {
  let baseNodes: Node<RouteNodeData>[]
  let baseEdges: Edge[]

  if (routeId === 'fast-track') {
    baseNodes = fastTrackRouteNodes
    baseEdges = fastTrackRouteEdges
  } else if (routeId === 'foundation-first') {
    baseNodes = foundationRouteNodes
    baseEdges = foundationRouteEdges
  } else {
    baseNodes = balancedRouteNodes
    baseEdges = balancedRouteEdges
  }

  // Clone nodes to update goal label dynamically if destinationTitle is provided
  const nodes = baseNodes.map((n) => {
    if (n.data?.isGoal && destinationTitle) {
      return {
        ...n,
        data: {
          ...n.data,
          label: destinationTitle,
        },
      }
    }
    return n
  })

  return { nodes, edges: baseEdges }
}

export const getRouteById = (id: string): Route | undefined =>
  mockRoutes.find((r) => r.id === id)