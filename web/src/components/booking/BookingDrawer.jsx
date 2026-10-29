import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { X } from 'lucide-react'
import { createBooking, errorMessage } from '../../api/client'
import { dayLabel, timeLabel } from '../../lib/format'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

const isDesktop = () => window.matchMedia('(min-width: 640px)').matches

function Field({ label, error, ...props }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      <input
        {...props}
        aria-invalid={Boolean(error) || undefined}
        className={clsx(
          'h-12 rounded-xl border px-3.5 text-base text-ink outline-none transition sm:text-[15px]',
          'focus:border-ink focus:ring-2 focus:ring-ink/10',
          error ? 'border-rose' : 'border-line-strong',
        )}
      />
      {error && <span className="text-[13px] font-normal text-rose">{error}</span>}
    </label>
  )
}

/**
 * Réservation en 2 temps sur un seul panneau : créneau, puis 3 champs.
 * Desktop : tiroir à droite. Mobile : feuille qui monte du bas.
 */
export default function BookingDrawer({ tutor, initialSlotId, subject, level, matchKey, onClose, onToast }) {
  const [slotId, setSlotId] = useState(initialSlotId)
  const [form, setForm] = useState({ student_first_name: '', parent_name: '', parent_email: '' })
  const [errors, setErrors] = useState({})
  const panelRef = useRef(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const desktop = isDesktop()

  const slots = tutor.matching_slots
  const slot = slots.find(s => s.id === slotId)

  // Clavier : Échap ferme, Tab reste dans le panneau ; la page derrière ne défile plus
  useEffect(() => {
    const previous = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector('[data-autofocus]')?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab') return
      const nodes = panelRef.current.querySelectorAll('button:not([disabled]), input, a[href]')
      const first = nodes[0], last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [onClose])

  const booking = useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['match'] })
      queryClient.setQueryData(['booking', data.reference], data)
      navigate(`/reservation/${data.reference}`)
    },
    onError: (error) => {
      onToast(errorMessage(error))
      if (error?.response?.status === 409) {
        // Créneau pris entre-temps : on retire ce créneau et on reste dans le panneau
        queryClient.setQueryData(matchKey, (list) => list?.map(t => t.id !== tutor.id ? t : {
          ...t, matching_slots: t.matching_slots.filter(s => s.id !== slotId),
        }))
        setSlotId(null)
        queryClient.invalidateQueries({ queryKey: ['match'] })
      }
      if (error?.response?.status === 422) {
        setErrors(Object.fromEntries(Object.entries(error.response.data.errors ?? {}).map(([k, v]) => [k, v[0]])))
      }
    },
  })

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    setErrors(er => ({ ...er, [key]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (!form.student_first_name.trim()) next.student_first_name = "Indiquez le prénom de l'enfant."
    if (!form.parent_name.trim()) next.parent_name = 'Indiquez votre nom.'
    if (!/^\S+@\S+\.\S+$/.test(form.parent_email.trim())) next.parent_email = 'Indiquez un email valide.'
    setErrors(next)
    if (Object.keys(next).length || !slot) return

    booking.mutate({
      slot_id: slot.id,
      subject_id: subject.id,
      level_id: level.id,
      student_first_name: form.student_first_name.trim(),
      parent_name: form.parent_name.trim(),
      parent_email: form.parent_email.trim(),
    })
  }

  const motionProps = desktop
    ? { initial: { x: '100%' }, animate: { x: 0 }, exit: { x: '100%' } }
    : { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }

  return (
    <div className="fixed inset-0 z-50">
      <m.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-ink/45"
        onClick={onClose}
        aria-hidden="true"
      />
      <m.form
        ref={panelRef}
        onSubmit={submit}
        noValidate
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        {...motionProps}
        transition={{ type: 'spring', damping: 32, stiffness: 320 }}
        className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-[26px] bg-white shadow-[0_-20px_50px_-20px_rgba(31,35,51,0.5)]
                   sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[500px] sm:rounded-none sm:shadow-[-30px_0_60px_-30px_rgba(31,35,51,0.5)]"
      >
        <div className="flex justify-center pt-2.5 sm:hidden" aria-hidden="true">
          <span className="h-[5px] w-11 rounded-full bg-line-strong" />
        </div>

        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 sm:gap-3.5 sm:px-8 sm:pb-5 sm:pt-7">
          <Avatar seed={tutor.id} name={tutor.first_name} className="size-12 rounded-[14px] sm:size-14 sm:rounded-2xl" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-[13px] text-muted sm:text-sm">Réserver un cours avec</span>
            <h2 id="booking-title" className="truncate text-[19px] font-semibold sm:text-[22px]">
              {tutor.first_name} <span className="text-sm font-normal text-muted">· {subject.name} · {level.name}</span>
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" data-autofocus={initialSlotId ? '' : undefined}
                  className="grid size-11 shrink-0 place-items-center rounded-full bg-mist text-ink transition hover:bg-line">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto overscroll-contain px-4 py-5 sm:gap-7 sm:px-8 sm:py-6">
          <section className="flex flex-col gap-3">
            <h3 className="text-[15px] font-semibold sm:text-base">
              1. Choisissez un créneau <span className="text-sm font-normal text-muted">· 1 heure</span>
            </h3>
            {slots.length === 0 ? (
              <p className="rounded-xl bg-mist p-4 text-sm text-muted">
                Plus aucun créneau compatible chez {tutor.first_name}. Fermez ce panneau pour voir les autres tuteurs.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Créneaux disponibles">
                {slots.map((s, i) => {
                  const on = s.id === slotId
                  return (
                    <button
                      key={s.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      data-autofocus={!initialSlotId && i === 0 ? '' : undefined}
                      onClick={() => setSlotId(s.id)}
                      className={clsx(
                        'min-h-14 rounded-xl border px-1.5 py-2 text-center transition',
                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
                        on ? 'border-ink bg-ink text-white' : 'border-line bg-mist text-ink hover:border-ink/40',
                      )}
                    >
                      <span className={clsx('block text-[11.5px] sm:text-xs', on ? 'opacity-85' : 'text-muted')}>{dayLabel(s.starts_at)}</span>
                      <span className="block text-[15px] font-semibold sm:text-base">{timeLabel(s.starts_at)}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-3 sm:gap-3.5">
            <h3 className="text-[15px] font-semibold sm:text-base">2. Vos coordonnées</h3>
            <Field label="Prénom de l'enfant" name="student_first_name" autoComplete="off" placeholder="Ex. Yanis"
                   maxLength={50} value={form.student_first_name} onChange={set('student_first_name')} error={errors.student_first_name} />
            <Field label="Votre nom" name="parent_name" autoComplete="name" placeholder="Ex. Mme Benali"
                   maxLength={80} value={form.parent_name} onChange={set('parent_name')} error={errors.parent_name} />
            <Field label="Votre email" name="parent_email" type="email" inputMode="email" autoComplete="email"
                   placeholder="vous@exemple.com" maxLength={120} value={form.parent_email} onChange={set('parent_email')} error={errors.parent_email} />
          </section>
        </div>

        <div className="flex flex-col gap-2 border-t border-line px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3.5 sm:gap-2.5 sm:px-8 sm:pb-7 sm:pt-5">
          <Button type="submit" loading={booking.isPending} disabled={!slot} className="w-full">
            {slot ? `Confirmer · ${dayLabel(slot.starts_at)} à ${timeLabel(slot.starts_at)}` : 'Choisissez un créneau'}
          </Button>
          <p className="text-center text-xs text-muted sm:text-[13px]">Confirmation immédiate, sans validation manuelle.</p>
        </div>
      </m.form>
    </div>
  )
}

/** Enveloppe animée : garde le panneau monté pendant l'animation de sortie. */
export function BookingLayer({ open, ...props }) {
  return <AnimatePresence>{open && <BookingDrawer key={props.tutor.id} {...props} />}</AnimatePresence>
}
