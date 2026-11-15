# Chez Sifa — site de commande et traiteur

Site Next.js + Supabase de Chez Sifa (Surrey, C.-B.) :

- **Particuliers** : la carte, « Composer une assiette », « Ma semaine » (commande à la semaine), panier avec calendrier (48 h minimum), code promo, confirmation et paiement Interac. Ramassage uniquement.
- **Traiteur** (`/traiteur`) : le contenu de l'ancien site, avec un formulaire de devis enregistré dans le back office.
- **Back office** (`/admin`) : commandes et statuts, feuille de production du jour, carte, prix et photos, codes promo, demandes traiteur, réglages.

L'ancien site (une seule page HTML) est conservé dans `legacy/index.html`.

## Mise en ligne (une seule fois)

### 1. Supabase

1. Créez un projet sur [supabase.com](https://supabase.com) (région : Canada ou US West).
2. Dans **SQL Editor**, exécutez `supabase/schema.sql`, puis `supabase/seed.sql` (la carte, les prix, et les codes `MASEMAINE` et `BIENVENUE`).
3. Dans **Authentication > Users**, créez l'utilisateur du back office (par exemple `chezsifa@gmail.com` avec un mot de passe solide).
4. Dans **Authentication > Sign In / Providers**, désactivez « Allow new users to sign up ».
5. Dans **Project Settings > API**, copiez l'URL du projet, la clé `anon` et la clé `service_role`.

### 2. Vercel

Dans le projet Vercel relié à ce dépôt, ajoutez ces variables (**Settings > Environment Variables**) :

| Variable | Valeur |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé `anon` |
| `SUPABASE_SERVICE_ROLE_KEY` | clé `service_role` (secrète) |
| `ADMIN_EMAILS` | `chezsifa@gmail.com` (courriels autorisés, séparés par des virgules) |

Facultatif, pour recevoir un courriel à chaque commande ou demande traiteur ([resend.com](https://resend.com)) : `RESEND_API_KEY`, `NOTIFY_EMAIL`, `NOTIFY_FROM`.

Dans **Settings > General > Framework Preset**, choisissez **Next.js** (l'ancien site était en HTML simple). Puis redéployez.

### 3. Vérifier

- Passez une commande test sur le site, puis retrouvez-la dans `/admin`.
- Ajoutez les photos des plats dans **Back office > Carte, prix & photos**.

## Fonctionnement

- **Prix** : la carte vient de la base. Toute modification dans le back office est visible tout de suite. `data/menu.json` ne sert qu'à la première installation (`npm run seed:sql` régénère `supabase/seed.sql`).
- **Sécurité** : le navigateur n'accède jamais directement à la base. Tout passe par le serveur, qui recalcule les prix, vérifie le délai de 48 h et valide les codes promo. RLS est activé sans règle publique.
- **Délai** : le délai minimum (48 h par défaut) se change dans **Réglages**. Les commandes urgentes prises au téléphone s'enregistrent dans le back office (« Commande téléphone »).
- **Codes promo** : pourcentage ou montant fixe ; applicables à toute la commande, aux commandes à la semaine, à la première commande (reconnue par le numéro de téléphone) ou à une catégorie ; minimum, dates et nombre d'utilisations facultatifs.
- **Fufu Large** : le prix est « 7–8 $ » ; le panier compte 8 $ et indique que le prix est confirmé par Chez Sifa.

## Développement local

```bash
npm install
npm run dev
```

Sans variables Supabase, le site tourne en **mode démo** avec des données en mémoire (perdues au redémarrage). Back office : `/admin`, mot de passe `demo` (ou la valeur de `ADMIN_DEMO_PASSWORD`). Le mode démo est désactivé sur Vercel.
