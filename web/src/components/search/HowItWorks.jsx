import Tag from '../ui/Tag'

const STEPS = [
  ['Vous décrivez le besoin', 'Niveau, matière et moments libres de votre enfant, en quelques touches.'],
  ['Nous classons les tuteurs', 'Seuls les tuteurs compatibles et libres apparaissent, triés selon leurs créneaux, leurs avis et leur expérience.'],
  ['Vous réservez en un clic', "Choisissez un créneau sur la carte du tuteur : la confirmation s'affiche immédiatement."],
]

export default function HowItWorks() {
  return (
    <section id="etapes" className="mx-auto flex max-w-[1200px] scroll-mt-6 flex-col gap-10 px-4 py-20 sm:px-6 md:gap-14 md:py-28">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="text-[28px] font-semibold tracking-[-0.02em] md:text-[40px]">Comment ça marche</h2>
        <p className="max-w-[480px] text-base leading-relaxed text-muted md:text-[17px]">
          Du besoin à la réservation confirmée, sans intervention humaine.
        </p>
      </div>
      <ol className="grid list-none gap-4 p-0 sm:gap-6 md:grid-cols-3">
        {STEPS.map(([title, text], i) => (
          <li key={title} className="flex flex-col gap-4 rounded-[20px] bg-mist p-6 md:p-8">
            <Tag tone="rose" className="self-start text-[13px]">Étape {i + 1}</Tag>
            <h3 className="text-xl font-semibold md:text-[22px]">{title}</h3>
            <p className="text-[15px] leading-relaxed text-muted">{text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
