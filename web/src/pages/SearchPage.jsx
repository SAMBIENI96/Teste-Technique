import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Hero from '../components/search/Hero'
import SearchForm from '../components/search/SearchForm'
import HowItWorks from '../components/search/HowItWorks'
import FeaturedTutors from '../components/search/FeaturedTutors'
import Halo from '../components/ui/Halo'

export default function SearchPage() {
  return (
    <div className="overflow-x-clip pb-28 sm:pb-0">
      <Header />
      <main>
        <Hero />

        <section id="recherche" className="relative scroll-mt-4 bg-lavender px-3 py-5 sm:px-6 md:py-24">
          <Halo color="rose" className="-left-30 top-20 hidden size-[420px] md:block" />
          <Halo color="blue" className="-right-25 bottom-10 hidden size-[440px] md:block" />
          <div className="relative mx-auto flex max-w-[880px] flex-col gap-8">
            <div className="hidden flex-col items-center gap-3 text-center md:flex">
              <h2 className="text-[40px] font-semibold leading-tight tracking-[-0.02em]">De quoi votre enfant a-t-il besoin ?</h2>
              <p className="max-w-[520px] text-[17px] leading-relaxed text-muted">
                Trois choix suffisent. Aucune saisie au clavier avant la réservation.
              </p>
            </div>
            <SearchForm />
          </div>
        </section>

        <HowItWorks />
        <FeaturedTutors />
      </main>
      <Footer />
    </div>
  )
}
