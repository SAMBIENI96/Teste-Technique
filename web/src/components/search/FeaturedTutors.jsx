import { useQuery } from '@tanstack/react-query'
import { getTutors } from '../../api/client'
import Avatar from '../ui/Avatar'
import Stars from '../ui/Stars'
import Tag from '../ui/Tag'

/** Aperçu des tuteurs réels (GET /api/tutors), déjà classés par note bayésienne. */
export default function FeaturedTutors() {
  const { data: tutors, isLoading, isError } = useQuery({ queryKey: ['tutors'], queryFn: getTutors })
  if (isError) return null

  return (
    <section id="tuteurs" className="scroll-mt-6 bg-lavender px-4 py-20 sm:px-6 md:py-26">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 md:gap-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-[28px] font-semibold tracking-[-0.02em] md:text-[40px]">Des tuteurs qualifiés</h2>
          <p className="max-w-[480px] text-base leading-relaxed text-muted md:text-[17px]">
            Chaque profil affiche ses matières, son expérience et les avis des élèves.
          </p>
        </div>
        <ul className="grid list-none grid-cols-2 gap-3 p-0 sm:gap-6 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <li key={i} className="h-72 animate-pulse rounded-[20px] bg-white/70" />)
            : tutors.slice(0, 4).map(t => (
              <li key={t.id} className="flex flex-col gap-3 rounded-[20px] bg-white p-3 sm:gap-3.5 sm:p-4">
                <Avatar src={t.photo_url} name={t.first_name} className="aspect-[4/3] w-full rounded-[14px]" />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Tag tone="rose">{t.subjects[0]}</Tag>
                  <span className="text-[13px] text-muted">{t.years_experience} ans</span>
                </div>
                <h3 className="text-lg font-semibold">{t.first_name}</h3>
                <Stars rating={t.rating} count={t.reviews_count} className="text-[13px] sm:text-sm" />
              </li>
            ))}
        </ul>
      </div>
    </section>
  )
}
