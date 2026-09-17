'use client'

import { RouteMap } from '@/components/route-map/RouteMap'

export function RouteMapClient({ routeId }: { routeId: string }) {
  return <RouteMap routeId={routeId} />
}