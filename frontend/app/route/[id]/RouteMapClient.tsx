'use client'

import { RouteMap } from '@/components/route-map/RouteMap'
import { AuthGuard } from '@/components/auth/AuthGuard'

export function RouteMapClient({ routeId }: { routeId: string }) {
  return (
    <AuthGuard>
      <RouteMap routeId={routeId} />
    </AuthGuard>
  )
}