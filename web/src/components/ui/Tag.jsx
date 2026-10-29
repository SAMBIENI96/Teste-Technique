import clsx from 'clsx'

const tones = {
  rose: 'bg-rose-soft text-rose',
  lavender: 'bg-lavender text-ink',
  ink: 'bg-ink text-white',
  white: 'bg-white text-ink',
}

/** Étiquette non interactive (DM Mono). */
export default function Tag({ tone = 'lavender', pill, className, children }) {
  return (
    <span className={clsx(
      'inline-flex items-center font-mono text-xs',
      pill ? 'rounded-full px-2.5 py-1.5 text-[13px]' : 'rounded-md px-2.5 py-1',
      tones[tone],
      className,
    )}>
      {children}
    </span>
  )
}
