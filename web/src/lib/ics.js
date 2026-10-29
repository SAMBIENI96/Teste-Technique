// Fichier agenda (.ics) généré côté navigateur. Dates en UTC : chaque agenda les convertit.
const utc = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const escape = (s) => String(s).replace(/[\;,]/g, m => `\\${m}`).replace(/\n/g, '\\n')

export function downloadIcs(booking) {
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//TutorMatch//FR', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${booking.reference}@tutormatch`,
    `DTSTAMP:${utc(new Date().toISOString())}`,
    `DTSTART:${utc(booking.starts_at)}`,
    `DTEND:${utc(booking.ends_at)}`,
    `SUMMARY:${escape(`Cours de ${booking.subject} avec ${booking.tutor.first_name}`)}`,
    `DESCRIPTION:${escape(`Cours en visioconférence pour ${booking.student_first_name} (${booking.level}). Référence ${booking.reference}.`)}`,
    'BEGIN:VALARM', 'TRIGGER:-PT30M', 'ACTION:DISPLAY', 'DESCRIPTION:Cours dans 30 minutes', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ]
  const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: `cours-${booking.reference}.ics` })
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
