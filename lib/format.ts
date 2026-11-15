import type { Lang } from './types';

export const tx = (lang: Lang, fr: string, en: string) => (lang === 'en' ? en : fr);
export const L = (lang: Lang, o: { fr: string; en: string } | undefined | null) => (o ? (lang === 'en' ? o.en : o.fr) : '');
export const LD = (lang: Lang, o: { dfr?: string; den?: string } | undefined | null) => (o ? (lang === 'en' ? o.den || '' : o.dfr || '') : '');

export function money(n: number, lang: Lang = 'fr') {
  const frac = Math.round(n * 100) % 100 !== 0;
  return new Intl.NumberFormat(lang === 'en' ? 'en-CA' : 'fr-CA', {
    style: 'currency', currency: 'CAD', currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: frac ? 2 : 0, maximumFractionDigits: 2
  }).format(n);
}

export const round2 = (n: number) => Math.round(n * 100) / 100;

export function longDate(iso: string, lang: Lang) {
  const d = new Date(iso + 'T12:00:00Z');
  return d.toLocaleDateString(lang === 'en' ? 'en-CA' : 'fr-CA', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
}
export function shortDate(iso: string, lang: Lang) {
  const d = new Date(iso + 'T12:00:00Z');
  return d.toLocaleDateString(lang === 'en' ? 'en-CA' : 'fr-CA', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
}
