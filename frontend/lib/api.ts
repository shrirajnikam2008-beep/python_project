/**
 * Waypoint API Layer
 *
 * All data fetching goes through this module.
 * When FastAPI backend is ready, replace the mock imports with actual fetch() calls.
 * The function signatures remain stable — the UI will not need changes.
 */

import type { StudentProfile, Skill, Route, Destination } from '@/lib/types'
import { mockStudent } from '@/lib/mock-data/student'
import { mockSkills, getSkillById as _getSkillById } from '@/lib/mock-data/skills'
import { mockRoutes, getRouteById as _getRouteById, balancedRouteNodes, balancedRouteEdges } from '@/lib/mock-data/routes'
import { mockDestinations } from '@/lib/mock-data/destinations'
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

// ─── Skills ──────────────────────────────────────────────────────────────────

export async function getAllSkills(): Promise<Skill[]> {
  await delay(300)
  return mockSkills
}

export async function getSkillById(id: string): Promise<Skill | null> {
  await delay(200)
  return _getSkillById(id) ?? null
}

export async function getSkillGaps(currentSkillIds: string[]): Promise<Skill[]> {
  await delay(400)
  return mockSkills.filter((s) => !currentSkillIds.includes(s.id))
}

// ─── Destinations ─────────────────────────────────────────────────────────────

export async function getDestinations(): Promise<Destination[]> {
  await delay(300)
  return mockDestinations
}

// ─── Routes ──────────────────────────────────────────────────────────────────

export async function getRoutes(): Promise<Route[]> {
  await delay(400)
  return mockRoutes
}

export async function getRoute(routeId: string): Promise<Route | null> {
  await delay(300)
  return _getRouteById(routeId) ?? null
}

// ─── Route Map Graph ─────────────────────────────────────────────────────────

export async function getRouteGraph(routeId: string): Promise<{
  nodes: Node<RouteNodeData>[]
  edges: Edge[]
} | null> {
  await delay(500)
  // For R2, return the balanced route graph for all routes
  // In production: fetch route-specific graph from backend
  if (!_getRouteById(routeId)) return null
  return {
    nodes: balancedRouteNodes,
    edges: balancedRouteEdges,
  }
}
