import clsx from 'clsx'

const HALOS = ['rgba(246,168,184,0.7)', 'rgba(170,184,247,0.75)']

/** Avatar illustré (maquette) : silhouette au trait sur halo rose ou bleu selon le tuteur. */
export default function Avatar({ name, seed = 0, className }) {
  const halo = HALOS[seed % HALOS.length]

  return (
    <div className={clsx('relative grid shrink-0 place-items-center overflow-hidden bg-mist', className)}>
      <div
        aria-hidden="true"
        className="absolute aspect-square h-[120%] rounded-full"
        style={{ background: `radial-gradient(circle, ${halo} 0%, transparent 70%)` }}
      />
      <svg viewBox="0 0 160 150" role="img" aria-label={`Avatar de ${name}`}
           className="relative h-[78%] w-auto" fill="none" stroke="#1F2333"
           strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
        <circle cx="80" cy="52" r="24" fill="#FFFFFF" />
        <path d="M57 46c4-20 40-24 46 0" />
        <path d="M36 140c0-40 20-58 44-58s44 18 44 58" fill="#FFFFFF" />
        <path d="M62 120h36v20H62z" fill="#FFFFFF" />
        <path d="M80 120v20" />
      </svg>
    </div>
  )
}
