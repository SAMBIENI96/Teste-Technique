export default function Footer() {
  return (
    <footer className="bg-ink px-4 py-12 text-white sm:px-6 md:py-16">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8">
        <div className="flex max-w-[380px] flex-col gap-3">
          <span className="text-lg font-bold">Tutor</span>
          <p className="text-sm leading-relaxed text-[#B9BED3]">
            Cours particuliers en visioconférence avec des tuteurs qualifiés, réservés en quelques clics.
          </p>
        </div>
        <div className="border-t border-[#343A52] pt-6 text-[13px] text-[#B9BED3]">Prototype · test technique</div>
      </div>
    </footer>
  )
}
