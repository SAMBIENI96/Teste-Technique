import { ArrowRight } from 'lucide-react'
import Halo from '../ui/Halo'

/** Accroche + illustration visio (masquée sur mobile pour aller droit au formulaire). */
export default function Hero() {
  return (
    <section className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-12 px-4 pb-8 pt-2 sm:px-6 md:pb-24 md:pt-10">
      <div className="relative flex min-w-0 flex-[1_1_420px] flex-col gap-5 md:gap-6">
        <Halo color="blue" className="-right-16 -top-6 size-60 md:hidden" />
        <Halo color="rose" className="-left-16 top-16 size-52 md:hidden" />
        <h1 className="relative text-[32px] font-semibold leading-[1.12] tracking-[-0.02em] md:text-[56px] md:leading-[1.08] md:tracking-[-0.025em]">
          Le bon tuteur pour votre enfant, en trois choix
        </h1>
        <p className="relative max-w-[460px] text-[15px] leading-relaxed text-muted md:text-lg">
          Indiquez le niveau, la matière et ses moments libres. Nous trouvons les tuteurs disponibles
          et vous réservez le cours en visio, sans attendre de validation.
        </p>
        <a href="#recherche"
           className="hidden min-h-12 w-fit items-center gap-2.5 rounded-xl bg-ink px-6 font-mono text-[15px] text-white no-underline transition hover:bg-ink-soft md:inline-flex">
          Trouver un tuteur <ArrowRight size={16} aria-hidden="true" />
        </a>
        <div className="mt-2 hidden items-center gap-3.5 md:flex">
          <span className="grid size-9 place-items-center rounded-[10px] bg-[#FFF4D6]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#F2B01E" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" /></svg>
          </span>
          <p className="max-w-[300px] text-sm leading-normal text-muted">
            Réservation confirmée à l'écran, le créneau est bloqué aussitôt pour vous.
          </p>
        </div>
      </div>

      <div className="relative hidden h-[440px] min-w-0 flex-[1_1_440px] md:block">
        <Halo color="rose" className="left-[4%] top-[18%] size-[300px]" />
        <Halo color="blue" className="right-[2%] top-[26%] size-[320px]" />
        <svg viewBox="0 0 520 420" role="img" aria-label="Un tuteur et un élève en visioconférence sur un ordinateur portable"
             className="relative size-full" fill="none" stroke="#1F2333" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="58" y="34" width="104" height="58" rx="14" fill="#FFFFFF" />
          <path d="M84 92 76 108 100 92" />
          <circle cx="88" cy="63" r="4" fill="#1F2333" /><circle cx="110" cy="63" r="4" fill="#1F2333" /><circle cx="132" cy="63" r="4" fill="#1F2333" />
          <rect x="372" y="40" width="96" height="120" rx="6" fill="#FFFFFF" />
          <rect x="388" y="58" width="64" height="84" rx="2" />
          <path d="M402 84h36M402 100h28M402 116h32" />
          <rect x="110" y="120" width="300" height="190" rx="12" fill="#FFFFFF" />
          <path d="M260 132v166" />
          <circle cx="185" cy="186" r="28" fill="#FFFFFF" />
          <path d="M158 178c4-22 46-28 54-2" />
          <circle cx="175" cy="188" r="7" /><circle cx="196" cy="188" r="7" />
          <path d="M182 188h7" />
          <path d="M134 298c0-46 22-66 51-66s51 20 51 66" />
          <path d="M185 232v20" />
          <circle cx="335" cy="196" r="24" fill="#FFFFFF" />
          <path d="M312 190c2-20 40-24 46 0c-8-4-30-6-46 0z" fill="#1F2333" />
          <path d="M290 298c0-42 20-60 45-60s45 18 45 60" />
          <path d="M78 310h364l26 22H52z" fill="#FFFFFF" />
          <path d="M232 320h56" />
          <rect x="430" y="300" width="70" height="14" rx="3" fill="#FFFFFF" />
          <rect x="438" y="286" width="58" height="14" rx="3" fill="#FFFFFF" />
          <rect x="426" y="314" width="78" height="16" rx="3" fill="#1F2333" />
          <path d="M30 332h44l-6 50H36z" fill="#FFFFFF" />
          <path d="M52 332c0-30-14-46-24-56M52 332c0-34 8-52 22-62M52 332c-4-20-18-30-30-32" />
          <path d="M28 276c-6 4-8 10-4 14M74 270c6 0 10 6 8 12" />
        </svg>
      </div>
    </section>
  )
}
