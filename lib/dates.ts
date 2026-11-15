export const TZ = 'America/Vancouver';

/** Date et heure locales (Vancouver) d'un instant, au format AAAA-MM-JJ et HH:MM. */
export function localParts(d: Date) {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

export const todayLocal = (now = new Date()) => localParts(now).date;

/** Premier moment où une commande en ligne peut être récupérée (maintenant + min_hours). */
export function earliest(minHours: number, now = new Date()) {
  return localParts(new Date(now.getTime() + minHours * 3600 * 1000));
}

/** Vrai si la date (et l'heure, si donnée) respecte le délai minimum. */
export function isAllowed(date: string, time: string | null | undefined, minHours: number, now = new Date()) {
  const e = earliest(minHours, now);
  if (date > e.date) return true;
  if (date < e.date) return false;
  if (!time) return true;
  return time >= e.time;
}

export function addDays(iso: string, n: number) {
  const d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Lundi de la semaine contenant la date. */
export function mondayOf(iso: string) {
  const d = new Date(iso + 'T12:00:00Z');
  const dow = (d.getUTCDay() + 6) % 7;
  return addDays(iso, -dow);
}

export const isoDateRe = /^\d{4}-\d{2}-\d{2}$/;
export const timeRe = /^\d{2}:\d{2}$/;
