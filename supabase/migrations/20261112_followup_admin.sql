-- Suivi des accompagnements BET ON YOU
-- À exécuter une seule fois dans Supabase > SQL Editor.
-- Tables privées : lecture et écriture réservées aux comptes autorisés par is_admin().

create table if not exists public.followup_clients (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  sport text,
  team text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.followup_tracks (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.followup_clients(id) on delete cascade,
  domain text not null check (domain in ('mentale','physique','clubs_entreprises','basket_individuel')),
  title text not null default '',
  status text not null default 'actif' check (status in ('actif','en_pause','termine')),
  started_at date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.followup_entries (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.followup_tracks(id) on delete cascade,
  entry_type text not null check (entry_type in ('entretien','seance','test','note')),
  title text not null,
  entry_date date not null default current_date,
  session_number integer,
  objective text not null default '',
  notes text not null default '',
  tools jsonb not null default '[]'::jsonb,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.followup_tools (
  id uuid primary key default gen_random_uuid(),
  domain text not null default 'mentale' check (domain in ('mentale','physique','clubs_entreprises','basket_individuel')),
  name text not null,
  theme text not null default '',
  objective text not null default '',
  protocol text not null default '',
  source_note text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(domain, name)
);

create index if not exists followup_tracks_client_idx on public.followup_tracks(client_id, created_at desc);
create index if not exists followup_entries_track_date_idx on public.followup_entries(track_id, entry_date desc, created_at desc);
create index if not exists followup_tools_domain_active_idx on public.followup_tools(domain, active);

alter table public.followup_clients enable row level security;
alter table public.followup_tracks enable row level security;
alter table public.followup_entries enable row level security;
alter table public.followup_tools enable row level security;

drop policy if exists "followup admin clients" on public.followup_clients;
create policy "followup admin clients" on public.followup_clients for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "followup admin tracks" on public.followup_tracks;
create policy "followup admin tracks" on public.followup_tracks for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "followup admin entries" on public.followup_entries;
create policy "followup admin entries" on public.followup_entries for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "followup admin tools" on public.followup_tools;
create policy "followup admin tools" on public.followup_tools for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.followup_tools(domain,name,theme,objective,protocol,source_note) values
('mentale','Fixation d’objectifs','Objectifs','Transformer une intention en repères concrets et progressifs.','Définir un objectif de résultat si pertinent, puis des objectifs de performance et de processus observables. Vérifier qu’ils sont réalistes, datés et réévalués avec le sportif.','Support utilisateur « Fixation d’objectifs » ; adapter au contexte et au sportif.'),
('mentale','Dialogue interne','Confiance · attention','Repérer les pensées utiles ou gênantes et construire des consignes personnelles.','Partir d’une situation vécue, relever pensée, émotion et effet sur l’action, puis tester une formulation courte, crédible et orientée vers l’action.','Support utilisateur « Discours interne » et fiche d’entretien fournie.'),
('mentale','Imagerie de réussite','Imagerie · confiance','Répéter mentalement une action ou une situation de performance.','Construire une scène précise et réaliste en choisissant la perspective, les sensations et le rythme. Évaluer la vivacité, le contrôle et l’utilité perçue.','Supports utilisateur sur l’imagerie mentale ; préciser le protocole utilisé.'),
('mentale','Imagerie d’adaptation','Imagerie · coping','Préparer mentalement une réponse à une difficulté anticipée.','Choisir une difficulté réaliste, imaginer les indices de la situation puis répéter une réponse adaptée et le retour à la tâche.','Supports utilisateur sur l’imagerie mentale et la gestion du stress.'),
('mentale','Respiration ventrale','Respiration · activation','Développer une respiration basse confortable et observer ses effets.','Guider quelques cycles sans forcer, en laissant l’expiration se faire naturellement. Vérifier le confort et l’effet subjectif avant/après.','Support utilisateur « Techniques de relaxation » ; exercice à adapter, sans promesse thérapeutique.'),
('mentale','Respiration calmante','Respiration · régulation','S’entraîner à utiliser une respiration confortable pour revenir au calme.','Tester un rythme respiratoire lent et confortable, sans apnée ni contrainte. Arrêter ou revenir à la respiration naturelle en cas d’inconfort.','Supports utilisateur sur relaxation et contrôle respiratoire ; réponse individuelle à vérifier.'),
('mentale','Respiration thoracique','Respiration · conscience','Identifier les sensations et habitudes respiratoires dans une situation donnée.','Observer la respiration au repos puis dans une situation de pratique, sans chercher à imposer un rythme. Mettre en mots les sensations.','Support utilisateur « Contrôle respiratoire et biofeedback ».'),
('mentale','Routine de recentrage','Concentration · switch mental','Revenir à un repère utile après une erreur ou une distraction.','Choisir un signal bref, une action ou un mot-clé puis une consigne orientée vers la prochaine action. Tester en entraînement.','Support utilisateur « Switch » et « Attention / Concentration ».'),
('mentale','Concentration et contrôle des distractions','Attention','Identifier les distractions et entraîner un retour vers les indices pertinents.','Préciser les indices utiles de la tâche, repérer les distractions habituelles et tester une routine de retour à l’attention.','Support utilisateur « Attention Concentration ».'),
('mentale','Relaxation musculaire','Relaxation · somatique','Repérer et relâcher des tensions corporelles lorsque cela est utile.','Faire un balayage corporel ou un relâchement progressif à faible intensité ; demander un retour sur le confort.','Support utilisateur « Techniques de Relaxation ».'),
('mentale','Méditation / attention au présent','Attention · régulation','Entraîner l’observation de l’expérience présente sans jugement.','Proposer une pratique brève et adaptée ; observer pensées, sensations et retours attentionnels, sans objectif de performance imposé.','Supports utilisateur de cours ; durée et modalité à documenter.'),
('mentale','Confiance en soi','Confiance','Identifier des preuves de compétence et des repères de confiance personnels.','Revenir sur des expériences précises, les actions maîtrisées et les ressources mobilisées ; définir un repère transférable à la pratique.','Support utilisateur « Motivation et Confiance ».'),
('mentale','Activation et niveau d’énergie','Activation','Repérer le niveau d’activation adapté à la tâche.','Décrire les sensations d’activation avant la tâche puis tester une action de régulation adaptée au besoin du sportif.','Support utilisateur « Motivation et Confiance » ; aucune zone universelle n’est présumée.'),
('mentale','Préparation à la compétition','Routine · objectifs','Structurer les repères avant une compétition.','Construire une routine souple comprenant préparation pratique, consignes, objectifs de processus et options en cas d’imprévu.','Support utilisateur OMSAT et cours sur préparation mentale.')
on conflict(domain,name) do nothing;
