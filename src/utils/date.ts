const MONTHS_PT = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

/**
 * Parses a "yyyy-mm-dd" string as a local-midnight Date, avoiding the
 * `new Date("yyyy-mm-dd")` pitfall (spec parses those as UTC, which shifts
 * the date by a day in negative-UTC-offset timezones).
 */
function parseLocal(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Formats a Date or "yyyy-mm-dd" string as "15 de agosto" (local time). */
export function formatDateBr(date: Date | string): string {
  const d = typeof date === 'string' ? parseLocal(date) : date;
  return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]}`;
}

/** Local yyyy-mm-dd string for a Date, e.g. for <input type="date"> values. */
function toLocalIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addWeeks(date: Date, weeks: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

export function subDays(date: Date | string, days: number): Date {
  const d = typeof date === 'string' ? parseLocal(date) : new Date(date);
  d.setDate(d.getDate() - days);
  return d;
}

/** "yyyy-mm-dd" (local) for "today + 4 weeks" — default when the user has no event, consistent with the "Meta realista: melhorar seu equilíbrio em 4 semanas" InfoCard. */
export function defaultFechaObjetivo(): string {
  return toLocalIso(addWeeks(new Date(), 4));
}

/** "yyyy-mm-dd" (local) for today, used as the min value of the date input. */
export function todayIso(): string {
  return toLocalIso(new Date());
}
