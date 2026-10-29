import { m } from 'framer-motion'
import clsx from 'clsx'
import { Check } from 'lucide-react'
import Avatar from '../ui/Avatar'
import Stars from '../ui/Stars'
import Tag from '../ui/Tag'
import { dayLabel, timeLabel } from '../../lib/format'

const PREVIEW = 4

function Badge({ best, label, className }) {
  return (
    <span className={clsx(
      'rounded-full px-2.5 py-1.5 font-mono text-xs whitespace-nowrap',
      best ? 'bg-ink text-white' : 'bg-white text-ink ring-1 ring-line sm:ring-0',
      className,
    )}>
      {best ? 'Meilleur choix' : label}
    </span>
  )
}

function SlotButton({ slot, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex min-h-11 flex-col rounded-xl border border-line bg-mist px-3 py-2 text-left transition',
        'hover:border-ink hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
        className,
      )}
    >
      <span className="text-[11.5px] text-muted sm:text-xs">{dayLabel(slot.starts_at)}</span>
      <span className="text-[15px] font-semibold text-ink">{timeLabel(slot.starts_at)}</span>
    </button>
  )
}

/** Carte tuteur : un créneau touché ouvre directement la réservation. */
export default function TutorCard({ tutor, best, index, onBook }) {
  const slots = tutor.matching_slots
  const more = slots.length - PREVIEW

  return (
    <m.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.06, ease: 'easeOut' }}
      aria-label={`${tutor.first_name}, ${best ? 'meilleur choix' : tutor.label.toLowerCase()}`}
      className={clsx(
        'flex min-w-0 flex-col gap-3.5 rounded-[20px] border-2 bg-white p-3.5 sm:gap-4 sm:rounded-[22px] sm:p-4 sm:pb-5',
        best ? 'border-ink shadow-lift' : 'border-transparent shadow-card',
      )}
    >
      {/* Mobile : en-tête compact */}
      <div className="flex items-center gap-3 sm:hidden">
        <Avatar seed={tutor.id} name={tutor.first_name} className="size-15 rounded-2xl" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">{tutor.first_name}</h2>
            <Badge best={best} label={tutor.label} />
          </div>
          <span className="text-[13px] text-muted">
            <Stars rating={tutor.rating} count={tutor.reviews_count} className="text-[13px]" /> · {tutor.years_experience} ans
          </span>
        </div>
      </div>

      {/* Desktop : grande photo */}
      <div className="relative hidden sm:block">
        <Avatar seed={tutor.id} name={tutor.first_name} className="h-[168px] w-full rounded-[14px]" />
        <Badge best={best} label={tutor.label} className="absolute left-3 top-3" />
      </div>

      <div className="hidden flex-col gap-1.5 sm:flex">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-[22px] font-semibold">{tutor.first_name}</h2>
          <Stars rating={tutor.rating} count={tutor.reviews_count} />
        </div>
        <div className="flex flex-wrap gap-2">
          {tutor.subjects.map(s => <Tag key={s} tone="rose">{s}</Tag>)}
          <Tag tone="lavender">{tutor.years_experience} ans d'exp.</Tag>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted">{tutor.bio}</p>

      <ul className="flex list-none flex-col gap-1 p-0 sm:gap-1.5">
        {tutor.reasons.map(r => (
          <li key={r} className="flex items-center gap-2 text-[13px] sm:text-sm">
            <Check size={15} strokeWidth={2.6} className="shrink-0 text-success" aria-hidden="true" /> {r}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2.5 border-t border-line pt-3.5 sm:pt-4">
        <span className="font-mono text-xs tracking-[0.06em] text-muted">PROCHAINS CRÉNEAUX</span>
        {/* Mobile : défilement horizontal ; desktop : grille 2 colonnes */}
        <div className="-mx-3.5 flex gap-2 overflow-x-auto px-3.5 pb-0.5 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
          {slots.slice(0, PREVIEW).map(s => (
            <SlotButton key={s.id} slot={s} onClick={() => onBook(tutor, s.id)} className="shrink-0" />
          ))}
        </div>
        {more > 0 && (
          <button type="button" onClick={() => onBook(tutor, null)}
                  className="inline-flex min-h-11 w-fit items-center text-sm font-semibold text-ink underline underline-offset-3 hover:text-ink-soft">
            Voir les {slots.length} créneaux
          </button>
        )}
      </div>
    </m.article>
  )
}

export function TutorCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-[22px] bg-white p-4 shadow-card" aria-hidden="true">
      <div className="hidden h-[168px] animate-pulse rounded-[14px] bg-mist sm:block" />
      <div className="flex items-center gap-3 sm:hidden"><div className="size-15 animate-pulse rounded-2xl bg-mist" /><div className="h-5 w-32 animate-pulse rounded bg-mist" /></div>
      <div className="h-6 w-1/2 animate-pulse rounded bg-mist" />
      <div className="h-12 animate-pulse rounded bg-mist" />
      <div className="grid grid-cols-2 gap-2">{[0, 1, 2, 3].map(i => <div key={i} className="h-14 animate-pulse rounded-xl bg-mist" />)}</div>
    </div>
  )
}
