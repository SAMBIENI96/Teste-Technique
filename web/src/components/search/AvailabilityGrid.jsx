import clsx from 'clsx'

export const DAYS = [
  { short: 'L', label: 'Lun', full: 'Lundi' },
  { short: 'M', label: 'Mar', full: 'Mardi' },
  { short: 'M', label: 'Mer', full: 'Mercredi' },
  { short: 'J', label: 'Jeu', full: 'Jeudi' },
  { short: 'V', label: 'Ven', full: 'Vendredi' },
  { short: 'S', label: 'Sam', full: 'Samedi' },
  { short: 'D', label: 'Dim', full: 'Dimanche' },
]

export const MOMENTS = [
  { key: 'morning', label: 'Matin', short: 'Matin', from: '08:00', to: '12:00' },
  { key: 'afternoon', label: 'Après-midi', short: 'Ap.-midi', from: '12:00', to: '17:00' },
  { key: 'evening', label: 'Soir', short: 'Soir', from: '17:00', to: '21:00' },
]

/** Raccourcis : plusieurs cases d'un geste. */
export const PRESETS = [
  { label: 'Tous les soirs', cells: [1, 2, 3, 4, 5].map(d => `${d}-evening`) },
  { label: 'Mercredi après-midi', cells: ['3-afternoon'] },
  { label: 'Week-end', cells: [6, 7].flatMap(d => [`${d}-morning`, `${d}-afternoon`]) },
]

const cellId = (day, moment) => `${day}-${moment}`

/** Grille jours × moments. Tient sans défilement dès 320 px. */
export default function AvailabilityGrid({ value, onChange }) {
  const selected = new Set(value)

  const toggle = (k) => {
    const next = new Set(selected)
    next.has(k) ? next.delete(k) : next.add(k)
    onChange([...next])
  }

  const applyPreset = (cells) => {
    const allOn = cells.every(c => selected.has(c))
    const next = new Set(selected)
    cells.forEach(c => (allOn ? next.delete(c) : next.add(c)))
    onChange([...next])
  }

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="Moments de la semaine" className="flex flex-col gap-[5px] sm:gap-2">
        <div className="flex items-center gap-[5px] sm:gap-2">
          <span className="w-[62px] shrink-0 sm:w-[110px]" />
          {DAYS.map(d => (
            <span key={d.full} className="flex-1 text-center font-mono text-[11.5px] text-muted sm:text-[13px]">
              <span className="sm:hidden" aria-hidden="true">{d.short}</span>
              <span className="hidden sm:inline">{d.label}</span>
            </span>
          ))}
        </div>
        {MOMENTS.map(m => (
          <div key={m.key} className="flex items-center gap-[5px] sm:gap-2">
            <span className="w-[62px] shrink-0 text-[13px] font-medium sm:w-[110px] sm:text-sm">
              <span className="sm:hidden">{m.short}</span>
              <span className="hidden sm:inline">{m.label}</span>
            </span>
            {DAYS.map((d, i) => {
              const k = cellId(i + 1, m.key)
              const on = selected.has(k)
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={on}
                  aria-label={`${d.full} ${m.label.toLowerCase()}`}
                  onClick={() => toggle(k)}
                  className={clsx(
                    'h-11 min-w-0 flex-1 rounded-[9px] border transition sm:rounded-[10px]',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
                    on
                      ? 'border-ink bg-ink shadow-[0_6px_14px_-6px_rgba(31,35,51,.5)]'
                      : 'border-line bg-mist hover:border-ink/30',
                  )}
                />
              )
            })}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[13px] text-muted">Raccourcis :</span>
        {PRESETS.map(p => {
          const on = p.cells.every(c => selected.has(c))
          return (
            <button
              key={p.label}
              type="button"
              aria-pressed={on}
              onClick={() => applyPreset(p.cells)}
              className={clsx(
                'min-h-9 rounded-full px-3 font-mono text-xs transition',
                on ? 'bg-ink text-white' : 'bg-lavender text-ink hover:bg-line',
              )}
            >
              {p.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** ["3-evening", …] → [{day:3, from:"17:00", to:"21:00"}, …] pour l'API */
export function toWindows(cells) {
  return cells.map(c => {
    const [day, key] = c.split('-')
    const m = MOMENTS.find(x => x.key === key)
    return { day: Number(day), from: m.from, to: m.to }
  })
}

/** ["3-evening", "6-morning"] → « Mer soir · Sam matin » (trié par jour puis moment) */
export function describeCells(cells, max = 3) {
  const order = (c) => { const [d, k] = c.split('-'); return d * 10 + MOMENTS.findIndex(m => m.key === k) }
  const labels = [...cells].sort((a, b) => order(a) - order(b)).map(c => {
    const [d, k] = c.split('-')
    return `${DAYS[d - 1].label} ${MOMENTS.find(m => m.key === k).label.toLowerCase()}`
  })
  return labels.length > max ? [...labels.slice(0, max), `+${labels.length - max}`] : labels
}
