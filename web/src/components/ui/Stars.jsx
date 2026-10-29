import { ratingLabel } from '../../lib/format'

/** « ★ 4,9 (87 avis) » */
export default function Stars({ rating, count, className = 'text-sm' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="#F2B01E" aria-hidden="true">
        <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
      </svg>
      <strong className="font-semibold">{ratingLabel(rating)}</strong>
      <span className="text-muted">({count} avis)</span>
    </span>
  )
}
