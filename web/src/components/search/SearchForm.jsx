import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, FlaskConical, Globe, Languages, Leaf, RotateCw, Sigma } from 'lucide-react'
import { getMeta } from '../../api/client'
import { useSearch } from '../../store/SearchContext'
import AvailabilityGrid from './AvailabilityGrid'
import Chip from '../ui/Chip'
import Button from '../ui/Button'

// Icônes importées une à une (pas de `import *` : le bundle reste léger)
const SUBJECT_ICONS = { sigma: Sigma, 'book-open': BookOpen, languages: Languages, 'flask-conical': FlaskConical, leaf: Leaf, globe: Globe }

export const GOALS = [
  { key: 'catch_up', label: 'Rattraper un retard' },
  { key: 'exam_prep', label: 'Préparer un examen' },
  { key: 'method', label: 'Méthode de travail' },
  { key: 'conversation', label: "Pratique de l'oral" },
]

function Step({ n, title, hint, optional, children }) {
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0 sm:gap-3.5">
      <legend className="mb-3 flex items-center gap-2.5 p-0 text-base font-semibold sm:mb-3.5 sm:gap-3 sm:text-lg">
        <span className={`inline-grid size-6 place-items-center rounded-full font-mono text-xs sm:size-7 sm:text-[13px] ${optional ? 'bg-lavender text-ink' : 'bg-ink text-white'}`}>
          {n}
        </span>
        {title}
        {optional && <span className="text-[13px] font-normal text-muted sm:text-sm">Optionnel</span>}
      </legend>
      {hint && <p className="-mt-2 text-[13px] text-muted sm:text-sm">{hint}</p>}
      {children}
    </fieldset>
  )
}

function ChipsSkeleton({ count, width = 'w-28' }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className={`h-11 ${width} animate-pulse rounded-full bg-mist`} />
  ))
}

export default function SearchForm() {
  const { data: meta, isLoading, isError, refetch } = useQuery({ queryKey: ['meta'], queryFn: getMeta })
  const { search, update } = useSearch()
  const navigate = useNavigate()

  const level = meta?.levels.find(l => l.id === search.levelId)
  const subject = meta?.subjects.find(s => s.id === search.subjectId)
  const n = search.windows.length
  const ready = Boolean(level && subject && n > 0)

  // Le résumé dit ce qui manque : le bouton désactivé n'est jamais une énigme
  const summary = !level ? 'Choisissez le niveau scolaire'
    : !subject ? 'Choisissez la matière'
    : n === 0 ? 'Touchez au moins un moment de disponibilité'
    : `${subject.name} · ${level.name} · ${n} moment${n > 1 ? 's' : ''} choisi${n > 1 ? 's' : ''}`

  const submit = (e) => {
    e.preventDefault()
    if (ready) navigate('/tuteurs')
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-white p-10 text-center shadow-panel">
        <p className="text-muted">Impossible de charger le formulaire pour le moment.</p>
        <Button variant="ghost" onClick={() => refetch()}><RotateCw size={16} aria-hidden="true" /> Réessayer</Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-[26px] rounded-[20px] bg-white px-4 py-5 shadow-panel sm:gap-9 sm:rounded-3xl sm:p-10">
      <Step n="1" title="Niveau scolaire">
        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {isLoading ? <ChipsSkeleton count={4} width="w-24" /> : meta.levels.map(l => (
            <Chip key={l.id} active={search.levelId === l.id} onClick={() => update({ levelId: l.id })}>{l.name}</Chip>
          ))}
        </div>
      </Step>

      <Step n="2" title="Matière">
        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {isLoading ? <ChipsSkeleton count={6} /> : meta.subjects.map(s => (
            <Chip key={s.id} icon={SUBJECT_ICONS[s.icon]} active={search.subjectId === s.id}
                  onClick={() => update({ subjectId: s.id })}>{s.name}</Chip>
          ))}
        </div>
      </Step>

      <Step n="3" title="Quand est-il disponible ?"
            hint="Touchez une ou plusieurs cases. Les tuteurs proposés seront libres à ces moments.">
        <AvailabilityGrid value={search.windows} onChange={windows => update({ windows })} />
      </Step>

      <Step n="4" title="Un objectif particulier ?" optional>
        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {GOALS.map(g => (
            <Chip key={g.key} active={search.goal === g.key}
                  onClick={() => update({ goal: search.goal === g.key ? null : g.key })}>{g.label}</Chip>
          ))}
        </div>
      </Step>

      {/* Desktop : pied de formulaire. Mobile : barre fixée en bas d'écran. */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col gap-2 border-t border-line bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_-20px_rgba(31,35,51,0.3)]
                      sm:static sm:z-auto sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-0 sm:pb-0 sm:pt-7 sm:shadow-none">
        <p aria-live="polite" className="text-center text-[13px] text-muted sm:text-left sm:text-[15px]">{summary}</p>
        <Button type="submit" disabled={!ready} className="w-full sm:w-auto">
          Voir les tuteurs<span className="hidden sm:inline"> disponibles</span> <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </div>
    </form>
  )
}
