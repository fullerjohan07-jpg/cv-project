import type { Education, Experience } from './cv-types'

export function dateRange(item: Experience | Education): string {
  const end =
    'current' in item && item.current
      ? "Aujourd'hui"
      : item.endDate?.trim() || ''
  const start = item.startDate?.trim() || ''
  if (start && end) return `${start} — ${end}`
  return start || end
}
