import { Link } from 'react-router-dom'
import { ChevronLeft, SlidersHorizontal } from 'lucide-react'
import Tag from '../ui/Tag'

/** Rappel de la recherche. Desktop : bandeau de puces. Mobile : barre compacte. */
export default function SearchSummary({ subject, level, moments }) {
  return (
    <>
      <div className="flex items-center gap-2 border-b border-line bg-white px-3 py-3.5 sm:hidden">
        <Link to="/" aria-label="Retour à la recherche" className="grid size-11 place-items-center rounded-xl text-ink">
          <ChevronLeft size={20} aria-hidden="true" />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-[15px] font-semibold">{subject} · {level}</span>
          <span className="truncate text-[13px] text-muted">{moments.join(' · ')}</span>
        </div>
        <Link to="/" className="inline-flex min-h-11 items-center px-1.5 text-sm font-semibold text-ink underline underline-offset-3">
          Modifier
        </Link>
      </div>

      <div className="hidden flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 shadow-card sm:flex">
        <div className="flex flex-wrap items-center gap-2.5">
          <Tag tone="ink" pill>{subject}</Tag>
          <Tag tone="lavender" pill>{level}</Tag>
          {moments.map(m => <Tag key={m} tone="lavender" pill>{m}</Tag>)}
        </div>
        <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink no-underline hover:text-ink-soft">
          <SlidersHorizontal size={16} aria-hidden="true" /> Modifier la recherche
        </Link>
      </div>
    </>
  )
}
