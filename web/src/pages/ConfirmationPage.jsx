import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { m } from 'framer-motion'
import { CalendarPlus, Check } from 'lucide-react'
import { getBooking } from '../api/client'
import { useSearch } from '../store/SearchContext'
import { fullLabel } from '../lib/format'
import { downloadIcs } from '../lib/ics'
import Header from '../components/layout/Header'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Halo from '../components/ui/Halo'
import Tag from '../components/ui/Tag'

function Row({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 sm:gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-semibold">{children}</dd>
    </div>
  )
}

export default function ConfirmationPage() {
  const { reference } = useParams()
  const { reset } = useSearch()
  const navigate = useNavigate()
  // Déjà en cache après la réservation ; rechargé depuis l'API si la page est ouverte directement
  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ['booking', reference],
    queryFn: () => getBooking(reference),
    retry: false,
  })

  const newSearch = () => { reset(); navigate('/') }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-white">
      <Halo color="rose" className="-left-20 top-20 size-[300px] sm:left-[18%] sm:top-44 sm:size-[520px]" />
      <Halo color="blue" className="-right-24 top-52 size-[320px] sm:right-[16%] sm:top-64 sm:size-[540px]" />
      <div className="relative hidden sm:block"><Header step={3} /></div>

      <main className="relative flex flex-1 flex-col items-center gap-6 px-4 pb-8 pt-16 sm:justify-center sm:gap-7 sm:pb-16 sm:pt-0">
        {isLoading && <div className="h-80 w-full max-w-[480px] animate-pulse rounded-[22px] bg-mist" />}

        {isError && (
          <div className="flex max-w-md flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">Réservation introuvable</h1>
            <p className="text-muted">Vérifiez la référence ou lancez une nouvelle recherche.</p>
            <Button as={Link} to="/" className="no-underline">Nouvelle recherche</Button>
          </div>
        )}

        {booking && (
          <>
            <m.div
              initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 14, stiffness: 220 }}
              className="grid size-[76px] place-items-center rounded-full bg-success shadow-[0_0_0_9px_rgba(31,157,85,0.12)] sm:size-[88px] sm:shadow-[0_0_0_10px_rgba(31,157,85,0.12)]"
            >
              <Check size={40} strokeWidth={2.6} className="text-white" aria-hidden="true" />
            </m.div>

            <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                   className="flex flex-col gap-2 text-center sm:gap-2.5">
              <h1 className="text-[32px] font-semibold tracking-[-0.02em] sm:text-[44px]">C'est réservé !</h1>
              <p className="text-[15px] leading-normal text-muted sm:text-lg">
                {booking.tutor.first_name} retrouvera {booking.student_first_name} en visioconférence.
                <span className="hidden sm:inline"> Le créneau est bloqué pour vous.</span>
              </p>
            </m.div>

            <m.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                       aria-label="Récapitulatif"
                       className="flex w-full max-w-[480px] flex-col gap-4 rounded-[20px] bg-white p-5 shadow-[0_30px_70px_-35px_rgba(31,35,51,0.45)] sm:gap-5 sm:rounded-[22px] sm:p-7">
              <div className="flex items-center gap-3 sm:gap-3.5">
                <Avatar seed={booking.tutor.id} name={booking.tutor.first_name} className="size-[46px] rounded-[13px] sm:size-[52px] sm:rounded-[14px]" />
                <div className="flex flex-col">
                  <span className="text-base font-semibold sm:text-[17px]">{booking.tutor.first_name}</span>
                  <span className="text-[13px] text-muted sm:text-sm">{booking.subject} · {booking.level}</span>
                </div>
              </div>
              <dl className="flex flex-col gap-2.5 text-sm sm:gap-3 sm:text-[15px]">
                <Row label="Date">{fullLabel(booking.starts_at)}</Row>
                <Row label="Durée">1 heure</Row>
                <Row label="Élève">{booking.student_first_name}</Row>
                <Row label="Référence"><Tag tone="rose" className="text-[13px] font-medium">{booking.reference}</Tag></Row>
              </dl>
            </m.section>

            <div className="mt-auto flex w-full max-w-[480px] flex-col gap-2.5 sm:mt-0 sm:w-auto sm:max-w-none sm:flex-row sm:gap-3">
              <Button variant="ghost" onClick={() => downloadIcs(booking)}>
                <CalendarPlus size={18} aria-hidden="true" /> Ajouter à l'agenda
              </Button>
              <Button onClick={newSearch}>Nouvelle recherche</Button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
