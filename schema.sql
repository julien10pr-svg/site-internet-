-- À exécuter dans Supabase > SQL Editor.
create table admin_emails(email text primary key);
-- Après exécution : insert into admin_emails values ('votre@email.fr');  (et créez cet utilisateur dans Authentication > Users)
create function is_admin() returns boolean language sql stable security definer set search_path=public as
$$ select exists(select 1 from admin_emails where lower(email)=lower(auth.jwt()->>'email')) $$;

create table site_content(key text primary key, value text not null default '');
create table offers(id uuid primary key default gen_random_uuid(), service text not null check(service in('physique','mentale','basket')),
 label text not null, detail text default '', price_cents int not null, sessions int default 1, participants int default 1,
 tbc boolean default false, active boolean default true, sort int default 0);
create table slots(id uuid primary key default gen_random_uuid(), service text not null check(service in('physique','mentale','basket')),
 starts_at timestamptz not null, duration_min int not null default 60, capacity int not null default 1 check(capacity between 1 and 4),
 status text not null default 'open' check(status in('open','closed')), created_at timestamptz default now());
create table bookings(id uuid primary key default gen_random_uuid(), slot_id uuid not null references slots(id), offer_id uuid references offers(id),
 service text not null, participants int not null default 1, first_name text not null, last_name text not null, email text not null, phone text,
 is_minor boolean default false, guardian_name text, guardian_email text, note text,
 status text not null default 'pending' check(status in('pending','confirmed','cancelled','done')),
 payment_status text not null default 'unpaid' check(payment_status in('unpaid','paid','refunded')),
 amount_cents int, created_at timestamptz default now());
create table media(id uuid primary key default gen_random_uuid(), kind text default 'photo', url text not null, path text, caption text, sort int default 0, created_at timestamptz default now());

alter table admin_emails enable row level security; alter table site_content enable row level security; alter table offers enable row level security;
alter table slots enable row level security; alter table bookings enable row level security; alter table media enable row level security;
create policy "lecture publique" on site_content for select using(true);
create policy "lecture publique" on media for select using(true);
create policy "offres actives" on offers for select using(active or is_admin());
create policy "créneaux ouverts" on slots for select using((status='open' and starts_at>now()) or is_admin());
create policy "admin" on site_content for all using(is_admin()) with check(is_admin());
create policy "admin" on media for all using(is_admin()) with check(is_admin());
create policy "admin" on offers for all using(is_admin()) with check(is_admin());
create policy "admin" on slots for all using(is_admin()) with check(is_admin());
create policy "admin" on bookings for all using(is_admin()) with check(is_admin());
-- Aucune politique publique sur bookings : les visiteurs ne voient jamais les données clients.

create function get_open_slots(p_service text) returns table(id uuid, starts_at timestamptz, duration_min int, remaining int)
language sql stable security definer set search_path=public as $$
 select s.id,s.starts_at,s.duration_min,(s.capacity-coalesce((select sum(b.participants) from bookings b where b.slot_id=s.id and b.status<>'cancelled'),0))::int
 from slots s where s.service=p_service and s.status='open' and s.starts_at>now() order by s.starts_at $$;

create function book_slot(p_slot uuid,p_offer uuid,p_first text,p_last text,p_email text,p_phone text,p_minor boolean,p_gname text,p_gemail text,p_note text)
returns uuid language plpgsql security definer set search_path=public as $$
declare s slots; o offers; used int; n uuid;
begin
 select * into s from slots where id=p_slot and status='open' and starts_at>now() for update;
 if not found then raise exception 'Créneau indisponible'; end if;
 select * into o from offers where id=p_offer and active and service=s.service;
 if not found then raise exception 'Offre invalide'; end if;
 select coalesce(sum(participants),0) into used from bookings where slot_id=s.id and status<>'cancelled';
 if used+o.participants>s.capacity then raise exception 'Plus assez de places sur ce créneau'; end if;
 if length(trim(p_first))=0 or length(trim(p_last))=0 or p_email !~ '^[^@\s]+@[^@\s]+$' then raise exception 'Informations incomplètes'; end if;
 if p_minor and (coalesce(p_gname,'')='' or coalesce(p_gemail,'')='') then raise exception 'Coordonnées du représentant légal requises'; end if;
 insert into bookings(slot_id,offer_id,service,participants,first_name,last_name,email,phone,is_minor,guardian_name,guardian_email,note,amount_cents)
 values(s.id,o.id,s.service,o.participants,left(p_first,80),left(p_last,80),left(p_email,160),left(p_phone,30),p_minor,left(p_gname,120),left(p_gemail,160),left(p_note,1000),o.price_cents) returning id into n;
 return n;
end $$;
grant execute on function get_open_slots(text), book_slot(uuid,uuid,text,text,text,text,boolean,text,text,text), is_admin() to anon, authenticated;

insert into offers(service,label,detail,price_cents,sessions,participants,sort) values
('physique','Séance à l’unité','',5000,1,1,1),('physique','Pack de 5 séances','soit 45 € par séance',22500,5,1,2),('physique','Pack de 10 séances','soit 40 € par séance',40000,10,1,3),
('mentale','Séance à l’unité','Individuel ou petit groupe (détails à préciser)',5000,1,1,1),('mentale','Pack de 5 séances','soit 40 € par séance',20000,5,1,2),
('basket','1 personne','30 € par personne',3000,1,1,1),('basket','2 personnes','25 € par personne',5000,1,2,2),('basket','3 personnes','20 € par personne',6000,1,3,3);
insert into offers(service,label,detail,price_cents,sessions,participants,tbc,sort) values('basket','4 personnes','17 € par personne — tarif à confirmer',6800,1,4,true,4);
-- Le tarif à 4 est marqué "à confirmer" : désactivez-le (active=false) depuis l'admin tant qu'il n'est pas validé.

-- Stockage des photos : bucket public en lecture, écriture réservée à l'admin.
insert into storage.buckets(id,name,public) values('media','media',true) on conflict do nothing;
create policy "media lecture" on storage.objects for select using(bucket_id='media');
create policy "media admin" on storage.objects for all using(bucket_id='media' and is_admin()) with check(bucket_id='media' and is_admin());
