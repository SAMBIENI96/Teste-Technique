import { Link } from 'react-router-dom'
import { CalendarSearch, SearchX } from 'lucide-react'
import Button from '../ui/Button'

/**
 * Aucun tuteur : on explique pourquoi et on propose l'action utile.
 * - d'autres moments conviennent → élargir en un clic ;
 * - personne n'enseigne ce couple matière × niveau → changer la recherche.
 */
export default function EmptyState({ subject, level, widerCount, onWiden }) {
  const canWiden = widerCount > 0

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-5 rounded-[22px] bg-white px-6 py-12 text-center shadow-card">
      <span className="grid size-16 place-items-center rounded-full bg-lavender text-ink">
        {canWiden ? <CalendarSearch size={28} aria-hidden="true" /> : <SearchX size={28} aria-hidden="true" />}
      </span>
      {canWiden ? (
        <>
          <h2 className="text-2xl font-semibold tracking-tight">Personne n'est libre à ces moments</h2>
          <p className="text-muted">
            Mais {widerCount} tuteur{widerCount > 1 ? 's' : ''} en {subject} ({level.toLowerCase()})
            {widerCount > 1 ? ' sont disponibles' : ' est disponible'} à d'autres moments de la semaine.
          </p>
          <Button onClick={onWiden}>Voir {widerCount > 1 ? 'ces tuteurs' : 'ce tuteur'}</Button>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold tracking-tight">Aucun tuteur pour cette recherche</h2>
          <p className="text-muted">
            Nous n'avons pas encore de tuteur en {subject} au niveau {level.toLowerCase()}. Essayez un autre niveau ou une autre matière.
          </p>
          <Button as={Link} to="/" variant="ghost" className="no-underline">Modifier la recherche</Button>
        </>
      )}
    </div>
  )
}
