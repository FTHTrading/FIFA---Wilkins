/**
 * Date/time helpers for multilingual event platform.
 * Wraps Intl.DateTimeFormat for locale-aware formatting.
 */

export function formatEventDate(
  isoDate: string,
  locale: string,
  timeZone: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone,
    ...options,
  }).format(date);
}

export function formatEventTime(
  isoDate: string,
  locale: string,
  timeZone: string,
): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(date);
}

export function formatRelativeTime(isoDate: string, locale: string): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const diffMs = new Date(isoDate).getTime() - Date.now();
  const diffMins = Math.round(diffMs / 60_000);
  const diffHours = Math.round(diffMs / 3_600_000);
  const diffDays = Math.round(diffMs / 86_400_000);

  if (Math.abs(diffMins) < 60) return rtf.format(diffMins, 'minute');
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour');
  return rtf.format(diffDays, 'day');
}

export function isWithinDateRange(
  isoDate: string,
  startDate: string,
  endDate: string,
): boolean {
  const d = new Date(isoDate).getTime();
  return d >= new Date(startDate).getTime() && d <= new Date(endDate).getTime();
}
