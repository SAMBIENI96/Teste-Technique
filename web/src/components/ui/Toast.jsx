import { AnimatePresence, motion } from 'framer-motion'
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
        <motion.div
          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
          className="fixed inset-x-4 bottom-6 z-[60] mx-auto max-w-sm rounded-[14px] bg-ink px-4 py-3 text-sm text-white shadow-lift"
          onClick={onClose}
          role="status"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
