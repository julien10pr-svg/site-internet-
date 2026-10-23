# Site de coaching — Vercel + GitHub + Supabase

Site statique (HTML/CSS/JS, sans build) : GitHub héberge le code, Vercel le publie, Supabase stocke les données.

## Mise en ligne
1. **Supabase** : créez un projet, ouvrez *SQL Editor*, collez `supabase/schema.sql` et exécutez-le.
2. *Authentication › Users* : créez votre compte administrateur, puis exécutez `insert into admin_emails values ('votre@email.fr');`.
   Dans *Authentication › Providers › Email*, désactivez les inscriptions publiques (sign-ups) : seul votre compte doit exister.
3. Copiez *Project URL* et la clé **anon** dans `config.js` (jamais la clé service_role).
4. **GitHub** : créez un dépôt, poussez ce dossier.
5. **Vercel** : *Add New › Project*, importez le dépôt, aucun réglage de build. Chaque `git push` redéploie.

## Utilisation
- `https://votre-site/#/admin` : réservations (statuts, paiement suivi manuellement), créneaux par type, offres/tarifs, textes, photos.
- Les passages `[entre crochets]` apparaissent en jaune : éléments à compléter. Le tarif à 4 personnes est marqué « à confirmer » (désactivez-le dans Offres tant qu'il n'est pas validé).
- Le nom, logo, coordonnées, mentions légales et règles d'annulation sont des emplacements à compléter.

## Limites actuelles
Pas de paiement en ligne, pas d'e-mails automatiques de confirmation, pas de page de logo. Le suivi des encaissements est interne et n'est pas une comptabilité officielle.
