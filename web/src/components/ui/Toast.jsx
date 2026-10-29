import { AnimatePresence, m } from 'framer-motion'
import { useEffect } from 'react'

/** Message éphémère en bas d'écran ; se ferme seul après 4 s. */
export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [message, onClose])

  return (
    <AnimatePresence>
      {message && (
        <m.div
          initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }}
          // Mobile : en haut, pour ne pas masquer le bouton d'action de la feuille de réservation
          className="fixed inset-x-4 top-4 z-[60] sm:bottom-6 sm:top-auto mx-auto max-w-sm rounded-[14px] bg-ink px-4 py-3 text-sm text-white shadow-lift"
          onClick={onClose}
          role="status"
        >
          {message}
        </m.div>
      )}
    </AnimatePresence>
  )
}
