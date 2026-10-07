/**
 * Waypoint API Layer
 *
 * All data fetching goes through this module.
 * When FastAPI backend is ready, replace the mock imports with actual fetch() calls.
 * The function signatures remain stable — the UI will not need changes.
 */

import type { StudentProfile, Skill, Route, Destination, Opportunity, OpportunityType } from '@/lib/types'
import { mockStudent } from '@/lib/mock-data/student'
import { mockSkills, getSkillById as _getSkillById, getSkillsForDestination } from '@/lib/mock-data/skills'
import { mockRoutes, getRouteById as _getRouteById, getRouteGraphData } from '@/lib/mock-data/routes'
import { mockDestinations, getDestinationById } from '@/lib/mock-data/destinations'
import { mockOpportunities, getOpportunities as _getOpportunities } from '@/lib/mock-data/opportunities'
import type { Node, Edge } from 'reactflow'
import type { RouteNodeData } from '@/lib/types'


// Simulate network delay for realistic loading states
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

// ─── Student Profile ─────────────────────────────────────────────────────────

export async function getStudentProfile(): Promise<StudentProfile> {
  await delay(400)
  // In production: return fetch('/api/student/profile').then(r => r.json())
  const stored = typeof window !== 'undefined' ? localStorage.getItem('waypoint_profile') : null
  if (stored) return JSON.parse(stored) as StudentProfile
  return mockStudent
}

export async function createStudentProfile(profile: StudentProfile): Promise<StudentProfile> {
  await delay(600)
  // In production: return fetch('/api/student/profile', { method: 'POST', body: JSON.stringify(profile) }).then(r => r.json())
  if (typeof window !== 'undefined') {
    localStorage.setItem('waypoint_profile', JSON.stringify(profile))
  }
  return profile
}

export async function updateStudentProfile(updates: Partial<StudentProfile>): Promise<StudentProfile> {
  await delay(300)
  const current = await getStudentProfile()
  const updated: StudentProfile = {
    ...current,
    ...updates,
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem('waypoint_profile', JSON.stringify(updated))
  }
  return updated
}

// ─── Skills ──────────────────────────────────────────────────────────────────

export async function getAllSkills(
  destinationId?: string,
  currentSkillIds?: string[]
): Promise<Skill[]> {
  await delay(300)
  if (destinationId) {
    return getSkillsForDestination(destinationId, currentSkillIds ?? [])
  }
  return mockSkills
}

export async function getSkillById(id: string): Promise<Skill | null> {
  await delay(200)
  return _getSkillById(id) ?? null
}

export async function getSkillGaps(
  currentSkillIds: string[],
  destinationId?: string
): Promise<Skill[]> {
  await delay(400)
  const skills = destinationId
    ? getSkillsForDestination(destinationId, currentSkillIds)
    : mockSkills
  return skills.filter((s) => !currentSkillIds.includes(s.id) && s.status !== 'completed')
}

// ─── Destinations ─────────────────────────────────────────────────────────────

export async function getDestinations(): Promise<Destination[]> {
  await delay(300)
  return mockDestinations
}

export async function getDestination(id?: string): Promise<Destination> {
  await delay(200)
  return getDestinationById(id)
}

// ─── Routes & Customizations ─────────────────────────────────────────────────

export interface CustomRouteRecord {
  route: Route
  nodes: Node<RouteNodeData>[]
  edges: Edge[]
  customizedAt: string
}

const CUSTOM_ROUTES_KEY = 'waypoint_custom_routes'

function getCustomRouteStore(): Record<string, CustomRouteRecord> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(CUSTOM_ROUTES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveCustomRouteStore(store: Record<string, CustomRouteRecord>) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CUSTOM_ROUTES_KEY, JSON.stringify(store))
  }
}

export function getCustomizedRouteRecord(routeId: string): CustomRouteRecord | null {
  const store = getCustomRouteStore()
  return store[routeId] || null
}

export async function saveCustomizedRoute(
  routeId: string,
  route: Route,
  nodes: Node<RouteNodeData>[],
  edges: Edge[]
): Promise<Route> {
  await delay(150)
  const store = getCustomRouteStore()
  const now = new Date().toISOString()
  const updatedRoute: Route = {
    ...route,
    isCustomized: true,
    lastCustomizedAt: now,
    customVersion: (route.customVersion ?? 0) + 1,
  }
  store[routeId] = {
    route: updatedRoute,
    nodes,
    edges,
    customizedAt: now,
  }
  saveCustomRouteStore(store)
  return updatedRoute
}

export async function resetRouteToAIGenerated(routeId: string): Promise<boolean> {
  await delay(150)
  const store = getCustomRouteStore()
  if (store[routeId]) {
    delete store[routeId]
    saveCustomRouteStore(store)
    return true
  }
  return false
}

export async function getRoutes(): Promise<Route[]> {
  await delay(300)
  const store = getCustomRouteStore()
  return mockRoutes.map((r) => {
    if (store[r.id]) {
      return store[r.id].route
    }
    return r
  })
}

export async function getRoute(routeId: string): Promise<Route | null> {
  await delay(200)
  const custom = getCustomizedRouteRecord(routeId)
  if (custom) return custom.route
  return _getRouteById(routeId) ?? null
}

// ─── Route Map Graph ─────────────────────────────────────────────────────────

export async function getRouteGraph(
  routeId: string,
  destinationId?: string,
  destinationTitle?: string,
  currentSkillIds: string[] = []
): Promise<{
  nodes: Node<RouteNodeData>[]
  edges: Edge[]
  isCustomized?: boolean
  lastCustomizedAt?: string
} | null> {
  await delay(200)
  const custom = getCustomizedRouteRecord(routeId)
  if (custom && custom.nodes && custom.nodes.length > 0) {
    return {
      nodes: custom.nodes,
      edges: custom.edges,
      isCustomized: true,
      lastCustomizedAt: custom.customizedAt,
    }
  }
  if (!_getRouteById(routeId)) return null
  const base = getRouteGraphData(routeId, destinationId, destinationTitle, currentSkillIds)
  return {
    ...base,
    isCustomized: false,
  }
}

// ─── Opportunities & Action Ecosystem ────────────────────────────────────────
import {
  opportunityProvider,
  type OpportunityFilterOptions,
} from '@/lib/opportunity-provider'
import type { OpportunitySource, OpportunitySearchResult } from '@/lib/types'

export async function getOpportunities(
  destinationId?: string,
  type?: OpportunityType | 'all',
  filterMode?: 'all' | 'trending' | 'closing-soon' | 'new-today',
  profile?: StudentProfile | null
): Promise<Opportunity[]> {
  return opportunityProvider.getOpportunities(
    {
      destinationId,
      type,
      filterMode,
    },
    profile
  )
}

export async function getRecommendedOpportunities(
  profile: StudentProfile,
  options?: OpportunityFilterOptions
): Promise<Opportunity[]> {
  return opportunityProvider.getRecommendedOpportunities(profile, options)
}

export async function searchOpportunities(
  query: string,
  profile?: StudentProfile | null,
  options?: OpportunityFilterOptions
): Promise<OpportunitySearchResult> {
  return opportunityProvider.searchOpportunities(query, profile, options)
}

export async function getOpportunity(id: string): Promise<Opportunity | null> {
  return opportunityProvider.getOpportunity(id)
}

export async function getOpportunitySources(): Promise<OpportunitySource[]> {
  return opportunityProvider.getSources()
}

// When FastAPI backend is ready: replace these with fetch('/api/auth/...') calls.
// All UI consumers use this abstraction and will not need changes.

export interface AuthUser {
  id: string
  name: string
  email: string
}

interface StoredAccount {
  id: string
  name: string
  email: string
  passwordHash: string // btoa-encoded placeholder
}

const ACCOUNTS_KEY = 'waypoint_accounts'
const SESSION_KEY = 'waypoint_session'

function getAccounts(): StoredAccount[] {
  if (typeof window === 'undefined') return []
  const raw = localStorage.getItem(ACCOUNTS_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveAccounts(accounts: StoredAccount[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
  }
}

export async function authSignup(
  name: string,
  email: string,
  password: string
): Promise<AuthUser> {
  await delay(700)
  const accounts = getAccounts()
  if (accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email already exists.')
  }
  const newAccount: StoredAccount = {
    id: `user_${Date.now()}`,
    name,
    email: email.toLowerCase(),
    passwordHash: btoa(email.toLowerCase() + ':' + password),
  }
  saveAccounts([...accounts, newAccount])
  const user: AuthUser = { id: newAccount.id, name: newAccount.name, email: newAccount.email }
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  }
  return user
}

export async function authLogin(email: string, password: string): Promise<AuthUser> {
  await delay(700)
  const accounts = getAccounts()
  const account = accounts.find(
    (a) =>
      a.email.toLowerCase() === email.toLowerCase() &&
      a.passwordHash === btoa(email.toLowerCase() + ':' + password)
  )
  if (!account) {
    throw new Error('Invalid email or password.')
  }
  const user: AuthUser = { id: account.id, name: account.name, email: account.email }
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  }
  return user
}

export async function authLogout(): Promise<void> {
  await delay(200)
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
    // Keep profile data so returning users don't lose their journey
  }
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? (JSON.parse(raw) as AuthUser) : null
}

