// ─── Student Stage ──────────────────────────────────────────────────────────
export type StudentStage =
  | 'just-exploring'
  | 'planning-to-enroll'
  | 'currently-enrolled'
  | 'working-professional'

// ─── Student Profile ───────────────────────────────────────────────────────
export interface StudentProfile {
  name: string
  program: string
  branch: string
  studentStage: StudentStage
  semester?: number              // optional — not relevant for non-enrolled students
  cgpa?: number                  // optional — not relevant for non-enrolled / beginners
  creditsCompleted?: number      // optional
  currentSkills: string[]
  selectedDestinationId: string
}

// ─── Resource Link ──────────────────────────────────────────────────────────
export interface ResourceLink {
  title: string
  type: 'Course' | 'Book' | 'Exam Portal' | 'Official Guide' | 'Research Paper' | 'Practice'
  url?: string
  provider?: string
}

// ─── Skill ─────────────────────────────────────────────────────────────────
export type SkillStatus = 'completed' | 'in-progress' | 'next' | 'locked'
export type SkillPriority = 'critical' | 'high' | 'recommended'
export type SkillCategory = 
  | 'Programming'
  | 'Mathematics'
  | 'Data Science'
  | 'Machine Learning'
  | 'Tools'
  | 'Databases'
  | 'Foundations'
  | 'Aptitude & Management'
  | 'General Studies'
  | 'Academic Research'

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  description: string
  currentLevel: 'None' | 'Beginner' | 'Intermediate' | 'Advanced'
  requiredLevel: 'Beginner' | 'Intermediate' | 'Advanced'
  status: SkillStatus
  priority: SkillPriority
  prerequisites: string[] // skill ids
  dependents: string[]   // skill ids
  estimatedWeeks: number
  whyItMatters: string
  resources?: ResourceLink[]
}

// ─── Skill Gap ─────────────────────────────────────────────────────────────
export interface SkillGap {
  skillId: string
  skill: Skill
  priority: SkillPriority
  gap: 'full' | 'partial'
}

// ─── Destination ───────────────────────────────────────────────────────────
export interface Destination {
  id: string
  title: string
  description: string
  icon: string
  requiredSkillCount: number
  avgSalary?: string
  category?: 'Technical' | 'Higher Studies' | 'Management' | 'Public Services' | 'Research'
  tags: string[]
  resources?: ResourceLink[]
}

// ─── Route ─────────────────────────────────────────────────────────────────
export type RouteWorkload = 'Low' | 'Medium' | 'High'

export interface RouteStep {
  skillId: string
  weekStart: number
  weekEnd: number
  milestone?: string
}

export interface Route {
  id: string
  name: string
  tagline: string
  description: string
  workload: RouteWorkload
  totalWeeks: number
  skillCount: number
  steps: RouteStep[]
  isRecommended?: boolean
}

// ─── Route Map (React Flow) ─────────────────────────────────────────────────
export interface RouteNodeData {
  skillId: string
  label: string
  category: SkillCategory
  status: SkillStatus
  priority: SkillPriority
  isGoal?: boolean
  isStart?: boolean
}

export interface RouteEdgeData {
  animated?: boolean
}

// ─── API Response Wrappers ──────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
}
