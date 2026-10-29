import clsx from 'clsx'

/** Puce sélectionnable (bouton à bascule). */
export default function Chip({ active, icon: Icon, className, children, ...props }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      {...props}
      className={clsx(
        'inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition sm:px-[18px] sm:text-[15px]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
        active
          ? 'border-ink bg-ink text-white'
          : 'border-line-strong bg-white text-ink hover:border-ink/40',
        className,
      )}
    >
      {Icon && <Icon size={16} aria-hidden="true" />}
      {children}
    </button>
  )
}
