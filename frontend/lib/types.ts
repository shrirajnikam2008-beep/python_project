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
  studentStage?: StudentStage
  semester?: number              // optional — not relevant for non-enrolled students
  cgpa?: number                  // optional — not relevant for non-enrolled / beginners
  creditsCompleted?: number      // optional
  currentSkills: string[]
  skillProficiencies?: Record<string, 'Beginner' | 'Intermediate' | 'Advanced'>
  customSkills?: string[]
  selectedDestinationId: string
  careerGoals?: string | string[]
  preferredDomains?: string[]
  preferredMode?: 'Online' | 'In-person' | 'Hybrid' | 'Flexible' | 'Remote'
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
  | 'Programming & Software'
  | 'AI & Machine Learning'
  | 'Data & Analytics'
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology & Life Sciences'
  | 'Research & Scientific Skills'
  | 'Electronics & Hardware'
  | 'Engineering'
  | 'Communication'
  | 'Leadership & Management'
  | 'Business & Entrepreneurship'
  | 'Design & Creativity'
  | 'Finance & Economics'
  | 'Writing & Documentation'
  | 'Project Management'
  | 'Productivity'
  | 'Domain Knowledge'
  | 'Other'
  // Backward compatibility with legacy categories
  | 'Programming'
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
  isCustom?: boolean
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

export interface RouteTask {
  id: string
  skillId?: string
  title: string
  description?: string
  category: SkillCategory | string
  status: SkillStatus
  priority: SkillPriority
  estimatedTime?: string       // e.g. "6 hours" or "2 weeks"
  targetDate?: string          // e.g. "20 Oct 2026"
  deadline?: string
  skills?: string[]            // associated skill IDs or names
  notes?: string
  milestone?: string
  weekStart?: number
  weekEnd?: number
  isCustom?: boolean
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
  tasks?: RouteTask[]
  isRecommended?: boolean
  isCustomized?: boolean
  lastCustomizedAt?: string
  customVersion?: number
}

// ─── Route Map (React Flow) ─────────────────────────────────────────────────
export interface RouteNodeData {
  skillId: string
  taskId?: string
  label: string
  category: SkillCategory | string
  status: SkillStatus
  priority: SkillPriority
  description?: string
  estimatedTime?: string
  targetDate?: string
  notes?: string
  milestone?: string
  skills?: string[]
  isGoal?: boolean
  isStart?: boolean
  isCustom?: boolean
  isEditMode?: boolean
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

// ─── Opportunities & Ecosystem ──────────────────────────────────────────────
export type OpportunityType = 
  | 'Hackathon' 
  | 'Internship' 
  | 'Research' 
  | 'Incubator' 
  | 'Competition'
  | 'Fellowship'
  | 'Scholarship'
  | 'Open Source'
  | 'Student Program'

export type SourceTrustLevel = 'official' | 'recognized' | 'third_party'
export type VerificationStatus = 'verified' | 'stale' | 'unverified' | 'expired' | 'mock_demo'
export type FreshnessCategory = 'NEW' | 'RECENT' | 'CLOSING_SOON' | 'EXPIRED' | 'UNVERIFIED'
export type RetrievalMethod = 'official_api' | 'rss_atom' | 'public_structured' | 'manual_curated'

export interface StructuredEligibility {
  minYear?: number
  maxYear?: number
  eligibleBranches?: string[]
  cgpaRequirement?: number
  nationality?: string
  otherRequirements?: string
}

export interface MatchScoreBreakdown {
  score: number                 // 0 to 100
  profileMatch: number          // 0 to 25
  currentSkillMatch: number     // 0 to 10
  skillGapAlignment: number     // 0 to 10
  careerAlignment: number       // 0 to 20
  eligibilityMatch: number      // 0 to 15
  freshness: number             // 0 to 10
  deadlineUrgency: number       // 0 to 5
  sourceTrust: number           // 0 to 5
  reasons: string[]
}

export interface OpportunitySource {
  id: string
  name: string
  domain: string
  sourceType: 'Government' | 'University' | 'Corporate' | 'Foundation' | 'Platform' | 'Manual'
  trustLevel: SourceTrustLevel
  retrievalMethod: RetrievalMethod
  verifiedUrl: string
  enabled: boolean
  lastChecked?: string
}

export interface OpportunitySearchCriteria {
  query?: string
  domains?: string[]
  types?: OpportunityType[]
  targetYear?: number
  branch?: string
  locationScope?: string[]
  mode?: ('Online' | 'In-person' | 'Hybrid')[]
  minMatchScore?: number
  sortBy?: 'best_match' | 'latest' | 'closing_soon' | 'trending'
}

export interface OpportunityPersonalizedExplanation {
  opportunityId: string
  matchSummary: string
  whyRecommended: string[]
  skillDevelopment: string[]
  careerRelevance: string
  bestFor: string
  potentialConcern?: string
}

export interface TopPicksResponse {
  bestCareerMatch?: Opportunity
  bestSkillBuilding?: Opportunity
  bestBeginner?: Opportunity
  bestResearch?: Opportunity
  bestClosingSoon?: Opportunity
}

export interface OpportunitySearchResult {
  mode: 'gemini' | 'deterministic_fallback'
  query: string
  parsedCriteria?: OpportunitySearchCriteria
  total: number
  items: Opportunity[]
  opportunities?: Opportunity[]
  personalizedSummary?: string
  recommendations?: OpportunityPersonalizedExplanation[]
  topPicks?: TopPicksResponse
  fallbackUsed: boolean
}

export interface Opportunity {
  id: string
  title: string
  organization: string
  type: OpportunityType
  description: string
  deadline: string
  stipendOrPrize?: string
  location: string
  eligibility: string
  url: string // canonical official URL
  mode: 'Online' | 'In-person' | 'Hybrid'
  destinations: string[] // matched destination IDs or ['all']
  tags: string[]
  featured?: boolean
  trendingScore?: number
  dailyBadge?: string
  applicantsToday?: number
  daysRemaining?: number
  isNewToday?: boolean
  isTrending?: boolean
  isClosingSoon?: boolean
  postedAt?: string

  // Extended Opportunity Intelligence fields
  skills?: string[]
  domains?: string[]
  structuredEligibility?: StructuredEligibility
  sourceUrl?: string
  officialUrl?: string
  sourceName?: string
  sourceType?: string
  sourceTrust?: SourceTrustLevel
  retrievalMethod?: RetrievalMethod
  lastVerified?: string
  verificationStatus?: VerificationStatus
  freshness?: FreshnessCategory
  postedDate?: string
  funding?: string
  matchScore?: number
  matchBreakdown?: MatchScoreBreakdown
  matchReasons?: string[]
  eligibilityStatus?: 'eligible' | 'partially_eligible' | 'not_eligible'
  isMock?: boolean

  // Gemini Personalization Extensions
  personalizedExplanation?: OpportunityPersonalizedExplanation
  aiPersonalized?: boolean
}

