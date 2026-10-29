import clsx from 'clsx'

const colors = {
  rose: 'rgba(246,168,184,0.55)',
  blue: 'rgba(170,184,247,0.6)',
}

/** Halo flou décoratif (rose ou bleu), positionné par className. */
export default function Halo({ color = 'blue', className }) {
  return (
    <div
      aria-hidden="true"
      className={clsx('pointer-events-none absolute rounded-full', className)}
      style={{ background: `radial-gradient(circle, ${colors[color]} 0%, transparent 70%)` }}
    />
  )
}
