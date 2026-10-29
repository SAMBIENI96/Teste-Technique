import { useCallback, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Check, RotateCw } from 'lucide-react'
import { getMeta, matchTutors } from '../api/client'
import { useSearch } from '../store/SearchContext'
import { DAYS, MOMENTS, describeCells, toWindows } from '../components/search/AvailabilityGrid'
import Header from '../components/layout/Header'
import SearchSummary from '../components/results/SearchSummary'
import TutorCard, { TutorCardSkeleton } from '../components/results/TutorCard'
import EmptyState from '../components/results/EmptyState'
import { BookingLayer } from '../components/booking/BookingDrawer'
import Button from '../components/ui/Button'
import Halo from '../components/ui/Halo'
import Toast from '../components/ui/Toast'

const ALL_CELLS = DAYS.flatMap((_, i) => MOMENTS.map(m => `${i + 1}-${m.key}`))

export default function ResultsPage() {
  const { search, update } = useSearch()
  const [selection, setSelection] = useState(null) // { tutorId, slotId }
  const [toast, setToast] = useState(null)
  const closeToast = useCallback(() => setToast(null), [])
  const closeDrawer = useCallback(() => setSelection(null), [])

  const ready = search.levelId && search.subjectId && search.windows.length > 0
  const payload = useMemo(() => ({
    level_id: search.levelId,
    subject_id: search.subjectId,
    windows: toWindows(search.windows),
    goal: search.goal,
  }), [search])
  const matchKey = ['match', payload]

  const { data: meta } = useQuery({ queryKey: ['meta'], queryFn: getMeta })
  const { data: tutors, isLoading, isError, refetch } = useQuery({
    queryKey: matchKey,
    queryFn: () => matchTutors(payload),
    enabled: Boolean(ready),
  })

  // Si rien ne correspond : combien de tuteurs à d'autres moments ?
  const isEmpty = tutors?.length === 0
  const { data: wider } = useQuery({
    queryKey: ['match', { ...payload, windows: 'all' }],
    queryFn: () => matchTutors({ ...payload, windows: toWindows(ALL_CELLS) }),
    enabled: Boolean(ready && isEmpty),
  })

  if (!ready) return <Navigate to="/" replace />

  const subject = meta?.subjects.find(s => s.id === search.subjectId)
  const level = meta?.levels.find(l => l.id === search.levelId)
  const selectedTutor = tutors?.find(t => t.id === selection?.tutorId)

  return (
    <div className="min-h-screen bg-lavender sm:bg-white">
      <div className="hidden sm:block"><Header step={2} /></div>

      <main className="relative min-h-[calc(100vh-96px)] overflow-hidden bg-lavender pb-16 sm:px-6 sm:pb-28 sm:pt-12">
        <Halo color="rose" className="-left-36 top-30 hidden size-[460px] sm:block" />
        <Halo color="blue" className="-right-30 top-[520px] size-[280px] sm:size-[480px]" />

        <div className="relative mx-auto flex max-w-[1200px] flex-col gap-4 sm:gap-8">
          {subject && level && (
            <SearchSummary subject={subject.name} level={level.name} moments={describeCells(search.windows)} />
          )}

          <div className="flex flex-wrap items-end justify-between gap-1 px-4 sm:gap-4 sm:px-0">
            <div className="flex flex-col gap-1 sm:gap-2">
              <h1 aria-live="polite" className="text-[26px] font-semibold tracking-[-0.02em] sm:text-[40px]">
                {isLoading ? 'Recherche des tuteurs…'
                  : tutors?.length ? `${tutors.length} tuteur${tutors.length > 1 ? 's' : ''} disponible${tutors.length > 1 ? 's' : ''}`
                  : isError ? 'Résultats indisponibles' : 'Aucun tuteur disponible'}
              </h1>
              {tutors?.length > 0 && (
                <p className="hidden text-base text-muted sm:block">Classés selon leurs créneaux compatibles, leurs avis et leur expérience.</p>
              )}
            </div>
            {tutors?.length > 0 && (
              <p className="flex items-center gap-2 text-sm text-muted">
                <Check size={16} className="hidden text-success sm:block" aria-hidden="true" /> Touchez un créneau pour réserver
              </p>
            )}
          </div>

          <div className="px-3 sm:px-0">
            {isLoading && (
              <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] sm:gap-6">
                {[0, 1, 2].map(i => <TutorCardSkeleton key={i} />)}
              </div>
            )}

            {isError && (
              <div className="flex flex-col items-center gap-4 rounded-[22px] bg-white p-10 text-center shadow-card">
                <p className="text-muted">Impossible de charger les tuteurs pour le moment.</p>
                <Button variant="ghost" onClick={() => refetch()}><RotateCw size={16} aria-hidden="true" /> Réessayer</Button>
              </div>
            )}

            {isEmpty && subject && level && (
              <EmptyState subject={subject.name} level={level.name} widerCount={wider?.length ?? 0}
                          onWiden={() => update({ windows: ALL_CELLS })} />
            )}

            {tutors?.length > 0 && (
              <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] sm:gap-6">
                {tutors.map((t, i) => (
                  <TutorCard key={t.id} tutor={t} best={i === 0 && tutors.length > 1} index={i}
                             onBook={(tutor, slotId) => setSelection({ tutorId: tutor.id, slotId })} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {subject && level && (
        <BookingLayer
          open={Boolean(selectedTutor)}
          tutor={selectedTutor}
          initialSlotId={selection?.slotId}
          subject={subject}
          level={level}
          matchKey={matchKey}
          onClose={closeDrawer}
          onToast={setToast}
        />
      )}
      <Toast message={toast} onClose={closeToast} />
    </div>
  )
}
