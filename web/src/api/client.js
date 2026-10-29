import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Accept: 'application/json' },
})

export const getMeta = () => api.get('/meta').then(r => r.data)
export const getTutors = () => api.get('/tutors').then(r => r.data.data)
export const matchTutors = (payload) => api.post('/match', payload).then(r => r.data.data)
export const getTutorSlots = (id) => api.get(`/tutors/${id}/slots`).then(r => r.data)
export const createBooking = (payload) => api.post('/bookings', payload).then(r => r.data.data)
export const getBooking = (ref) => api.get(`/bookings/${ref}`).then(r => r.data.data)

/** Message lisible pour le parent à partir d'une erreur axios. */
export function errorMessage(error) {
  const status = error?.response?.status
  if (status === 409) return 'Ce créneau vient d’être réservé. Choisissez-en un autre.'
  if (status === 422) return Object.values(error.response.data.errors ?? {})[0]?.[0] ?? 'Vérifiez les informations saisies.'
  if (status === 429) return 'Trop de tentatives. Patientez une minute puis réessayez.'
  if (!error?.response) return 'Connexion impossible. Vérifiez votre réseau.'
  return 'Une erreur est survenue. Réessayez.'
}
