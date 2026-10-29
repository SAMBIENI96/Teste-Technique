import { useState } from 'react'
import clsx from 'clsx'

/** Photo du tuteur, avec silhouette illustrée si l'image ne charge pas. */
export default function Avatar({ src, name, className }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={clsx('relative grid shrink-0 place-items-center overflow-hidden bg-mist', className)}>
      {src && !failed ? (
        <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} className="size-full object-cover" />
      ) : (
        <svg viewBox="0 0 160 150" className="w-3/4" role="img" aria-label={name} fill="none" stroke="#1F2333"
             strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="80" cy="52" r="24" fill="#FFFFFF" />
          <path d="M57 46c4-20 40-24 46 0" />
          <path d="M36 140c0-40 20-58 44-58s44 18 44 58" fill="#FFFFFF" />
        </svg>
      )}
    </div>
  )
}
