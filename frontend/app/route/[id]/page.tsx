import { AppShell } from '@/components/layout/AppShell'
import { RouteMapClient } from './RouteMapClient'

interface RoutePageProps {
  params: { id: string }
}

export default function RoutePage({ params }: RoutePageProps) {
  const routeNames: Record<string, string> = {
    balanced: 'Balanced Route (16 Weeks)',
    'fast-track': 'Fast Track (10 Weeks)',
    'foundation-first': 'Foundation First (20 Weeks)',
  }
  const name = routeNames[params.id] ?? 'Learning Route Map'

  return (
    <AppShell
      title={name}
      breadcrumb={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Routes', href: '/routes' }, { label: name }]}
      noPadding
    >
      {/* Full-bleed responsive interactive canvas */}
      <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden">
        <RouteMapClient routeId={params.id} />
      </div>
    </AppShell>
  )
}