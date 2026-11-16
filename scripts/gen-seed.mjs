// Génère supabase/seed.sql à partir de data/menu.json : npm run seed:sql
import { readFileSync } from 'node:fs';

const menu = JSON.parse(readFileSync(new URL('../data/menu.json', import.meta.url), 'utf8'));
const q = (v) => (v === undefined || v === null ? 'null' : typeof v === 'number' || typeof v === 'boolean' ? String(v) : `'${String(v).replace(/'/g, "''")}'`);
const j = (v) => (v ? `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb` : 'null');

const out = ['-- Carte et prix Chez Sifa (généré par scripts/gen-seed.mjs). Réexécutable : met à jour sans dupliquer.', 'begin;'];
for (const c of menu.categories) {
  out.push(`insert into categories (id, fr, en, dfr, den, composable, sort) values (${[c.id, c.fr, c.en, c.dfr, c.den, c.composable, c.sort].map(q).join(', ')})
  on conflict (id) do update set fr = excluded.fr, en = excluded.en, dfr = excluded.dfr, den = excluded.den, composable = excluded.composable, sort = excluded.sort;`);
}
menu.products.forEach((p, i) => {
  out.push(`insert into products (id, cat, fr, en, dfr, den, sizes, r, l, lfr, len, side, opts, featured, sort) values (${[p.id, p.cat, p.fr, p.en, p.dfr, p.den, p.sizes, p.r, p.l ?? null, p.lfr, p.len, !!p.side].map(q).join(', ')}, ${j(p.opts)}, ${q(!!p.featured)}, ${i})
  on conflict (id) do nothing;`);
});
out.push(`insert into promos (code, type, value, scope, min_total) values ('MASEMAINE', 'percent', 10, 'weekly', null) on conflict (code) do nothing;`);
out.push(`insert into promos (code, type, value, scope, min_total) values ('BIENVENUE', 'fixed', 5, 'first', 40) on conflict (code) do nothing;`);
out.push("insert into settings (id) values (1) on conflict (id) do nothing;");
out.push('commit;');
console.log(out.join('\n'));
