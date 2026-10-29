import { Link } from 'react-router-dom'
import clsx from 'clsx'

const STEPS = ['Besoin', 'Tuteurs', 'Réservation']

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-xl text-ink no-underline focus-visible:outline-2 focus-visible:outline-ink">
      <span className="grid size-[38px] place-items-center rounded-xl bg-ink">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c3 2 9 2 12 0v-5" />
        </svg>
      </span>
      <span className="text-lg font-bold tracking-tight">TutorMatch</span>
    </Link>
  )
}

/** En-tête : liens d'ancre sur l'accueil, fil d'étapes sur le parcours. */
export default function Header({ step }) {
  return (
    <header className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 sm:py-7">
      <Logo />
      {step ? (
        <nav aria-label="Étapes" className="hidden items-center gap-2.5 font-mono text-[13px] text-muted sm:flex">
          {STEPS.map((label, i) => (
            <span key={label} className="flex items-center gap-2.5">
              {i > 0 && <span aria-hidden="true">—</span>}
              <span aria-current={step === i + 1 ? 'step' : undefined}
                    className={clsx(step === i + 1 && 'rounded-full bg-lavender px-3 py-1.5 font-medium text-ink')}>
                {i + 1} {label}
              </span>
            </span>
          ))}
        </nav>
      ) : (
        <nav aria-label="Navigation principale" className="hidden items-center gap-8 font-mono text-sm md:flex">
          <a href="#etapes" className="text-ink no-underline hover:text-ink-soft">Comment ça marche</a>
          <a href="#tuteurs" className="text-ink no-underline hover:text-ink-soft">Nos tuteurs</a>
          <a href="#recherche" className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-white no-underline hover:bg-ink-soft">
            Réserver un cours
          </a>
        </nav>
      )}
    </header>
  )
}
