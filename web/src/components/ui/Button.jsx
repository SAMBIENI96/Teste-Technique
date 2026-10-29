import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-ink text-white hover:bg-ink-soft',
  ghost: 'bg-white text-ink ring-1 ring-line-strong hover:bg-mist',
}

/** Bouton d'action (DM Mono). `as` permet de l'utiliser comme lien. */
export default function Button({ as: Tag = 'button', loading, variant = 'primary', className, children, ...props }) {
  const disabled = loading || props.disabled
  return (
    <Tag
      {...props}
      disabled={Tag === 'button' ? disabled : undefined}
      aria-disabled={disabled || undefined}
      className={clsx(
        'inline-flex min-h-13 items-center justify-center gap-2.5 rounded-[14px] px-6 font-mono text-[15px] transition',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
        'active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100',
        variants[variant],
        className,
      )}
    >
      {loading && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
      {children}
    </Tag>
  )
}
