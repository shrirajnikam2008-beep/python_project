'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { DestinationCard } from './DestinationCard'
import { SkeletonCard } from '@/components/ui/SkeletonLoader'
import { ErrorState } from '@/components/ui/ErrorState'
import { ArrowRight } from 'lucide-react'
import { getDestinations } from '@/lib/api'
import type { Destination } from '@/lib/types'

interface DestinationStepProps {
  onNext: (data: { selectedDestinationId: string }) => void
  defaultValue?: string
}

export function DestinationStep({ onNext, defaultValue }: DestinationStepProps) {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState(defaultValue ?? '')

  useEffect(() => {
    getDestinations()
      .then(setDestinations)
      .catch(() => setError('Could not load destinations.'))
      .finally(() => setLoading(false))
  }, [])

  if (error) return <ErrorState message={error} onRetry={() => { setError(null); setLoading(true); getDestinations().then(setDestinations).finally(() => setLoading(false)) }} />

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Choose the career you want to navigate toward. You can change this later.
      </p>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="space-y-2.5">
          {destinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              selected={selected === dest.id}
              onSelect={() => setSelected(dest.id)}
            />
          ))}
        </div>
      )}

      <div className="pt-2">
        <Button
          disabled={!selected}
          onClick={() => onNext({ selectedDestinationId: selected })}
          iconRight={<ArrowRight className="w-4 h-4" />}
          className="w-full"
        >
          Build My Route
        </Button>
      </div>
    </div>
  )
}
