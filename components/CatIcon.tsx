/** Icônes au trait par catégorie, utilisées quand il n'y a pas de photo. */
const P: Record<string, React.ReactNode> = {
  grill: <><path d="M4 11h16" /><path d="M6 11l1.5 8h9L18 11" /><path d="M9 3c-1 1.5 1 2.5 0 4M12 3c-1 1.5 1 2.5 0 4M15 3c-1 1.5 1 2.5 0 4" /></>,
  trad: <><path d="M3 11h18" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M9 6c0-1 1-1.5 1-2.5M14 6c0-1 1-1.5 1-2.5" /><path d="M8 20h8" /></>,
  veg: <><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" /><path d="M5 19l8-8" /></>,
  sides: <><path d="M4 12h16a8 8 0 0 1-16 0z" /><path d="M8 8c1-1 3-1 4 0s3 1 4 0" /></>,
  starters: <><circle cx="8" cy="14" r="3.5" /><circle cx="16" cy="14" r="3.5" /><circle cx="12" cy="8" r="3.5" /></>,
  pasta: <><path d="M3 11h18" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M8 11c1-3 2-5 4-7M12 11c0-3 1-5 3-7" /></>,
  salads: <><path d="M4 12h16a8 8 0 0 1-16 0z" /><path d="M9 12c-1-3 1-6 3-7M12 12c1-3 3-5 6-5" /></>,
  kids: <><path d="M5 13h14l-1 6H6z" /><path d="M7 13c0-4 2.5-6 5-6s5 2 5 6" /></>,
  cakes: <><path d="M4 20h16" /><path d="M5 20v-7h14v7" /><path d="M5 16c2 1 3-1 4.7 0s3 1 4.6 0 3-1 4.7 0" /><path d="M12 13V9" /><path d="M12 6.5c-.8-.8-.8-2 0-3 .8 1 .8 2.2 0 3z" /></>,
  sauces: <><path d="M9 3h6v3H9z" /><path d="M8 6h8l1 3v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9z" /><path d="M7 12h10" /></>
};

export function CatIcon({ cat, size = 30 }: { cat: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[cat] || P.grill}
    </svg>
  );
}
