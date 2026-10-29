// Les créneaux sont définis à l'heure de la plateforme : on les affiche dans ce fuseau,
// quel que soit celui du navigateur (sinon « Soir 17h-21h » s'afficherait décalé).
const TZ = import.meta.env.VITE_TIMEZONE || 'Africa/Casablanca'

const parts = (iso, options) =>
  Object.fromEntries(
    new Intl.DateTimeFormat('fr-FR', { timeZone: TZ, ...options })
      .formatToParts(new Date(iso))
      .map(p => [p.type, p.value.replace('.', '')])
  )

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

/** « Sam 31 oct » */
export const dayLabel = (iso) => {
  const p = parts(iso, { weekday: 'short', day: 'numeric', month: 'short' })
  return `${cap(p.weekday)} ${p.day} ${p.month}`
}

/** « 17h00 » */
export const timeLabel = (iso) => {
  const p = parts(iso, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
  return `${p.hour}h${p.minute}`
}

/** « Mercredi 4 novembre à 17h00 » */
export const fullLabel = (iso) => {
  const p = parts(iso, { weekday: 'long', day: 'numeric', month: 'long' })
  return `${cap(p.weekday)} ${p.day} ${p.month} à ${timeLabel(iso)}`
}

/** « 4,9 » */
export const ratingLabel = (n) => Number(n).toFixed(1).replace('.', ',')
