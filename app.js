import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
const cfg=window.SITE_CONFIG||{}, live=!!(cfg.supabaseUrl&&cfg.supabaseAnonKey);
const sb=live?createClient(cfg.supabaseUrl,cfg.supabaseAnonKey):null;
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tbd=s=>esc(s).replace(/\[[^\]]+\]/g,m=>`<mark class="tbd">${m}</mark>`);
const rich=s=>String(s??'').split(/\n\n+/).map(p=>`<p>${tbd(p)}</p>`).join('');
const eur=c=>(c/100).toLocaleString('fr-FR',{style:'currency',currency:'EUR',minimumFractionDigits:c%100?2:0});
const fmt=d=>new Date(d).toLocaleString('fr-FR',{weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Paris'});
const DUR='Séance de référence : une heure. Le format s’adapte au travail engagé.';
const TBC='[À compléter]';

const C={ // textes par défaut, modifiables dans l'espace admin (onglet Contenus)
'brand':'[Nom de l’activité à définir]',
'home.title':'Préparer le corps, l’esprit et le geste.',
'home.lead':'Préparation physique, préparation mentale et coaching de basket, en individuel ou en petit groupe. Un accompagnement construit autour de votre niveau et de vos objectifs.',
'home.about':'Je termine un Master EOPS à l’Université de Lille, en alternance au sein du club de la Patriote de Templeuve. J’y entraîne les U18F Région et j’assiste les U18 France. J’interviens aussi à l’école de basket.\n\n[Phrase personnelle sur ma façon d’accompagner à rédiger]',
'phys.intro':'Un travail physique structuré, pensé pour le sport pratiqué et le profil de chaque athlète.',
'phys.vision':'[Vision et méthodologie à détailler]',
'phys.needs':'[Besoins et objectifs concernés à détailler]',
'phys.testing':'[Moyens d’évaluation et de testing à préciser]',
'phys.nutrition':'L’accompagnement nutritionnel peut compléter le travail physique.\n\n[Place et contenu de l’accompagnement nutritionnel à préciser]',
'ment.intro':'Un accompagnement pour travailler la confiance, la concentration et la gestion de la pression, seul ou en petit groupe.',
'ment.vision':'[Vision et méthodologie à détailler]',
'ment.goals':'[Objectifs possibles et déroulement général à préciser]',
'ment.format':'Les séances peuvent être individuelles ou en petit groupe.\n\n[Détails des formats à préciser]',
'bask.intro':'Du joueur débutant à celle ou celui qui vise une progression importante, par exemple une entrée au CREPS : un coaching adapté au niveau, aux objectifs et au profil.',
'bask.fund':'Travail des fondamentaux individuels : maniement, appuis, finitions, lecture de jeu.\n\n[Contenu à détailler]',
'bask.shoot':'Développement technique et gestuelle de tir, avec un suivi progressif.\n\n[Contenu à détailler]',
'bask.levels':'Chaque séance s’adapte au niveau, aux objectifs et au profil du joueur ou de la joueuse.',
'bask.groups':'Les petits groupes sont limités à 4 personnes. Le tarif par personne diminue avec la taille du groupe, et le groupe se réserve ensemble.',
'loyalty':'Des avantages fidélité peuvent être proposés aux clients réguliers. Ils ne se cumulent pas automatiquement avec les tarifs de groupe ou les packs.',
'about.text':'Je suis en deuxième année de Master EOPS à l’Université de Lille, en alternance à la Patriote de Templeuve : coach principal des U18F Région, assistant auprès des U18 France, et intervenant à l’école de basket.\n\nFormations : Brevet fédéral jeune en basket ; DETB en cours (trois évaluations sur quatre validées, diplôme non encore obtenu) ; AUEC en réathlétisation du sportif.\n\n[Texte de présentation personnelle à compléter]',
'about.vision':'[Ma vision de l’accompagnement à rédiger]',
'contact.email':'[E-mail à compléter]','contact.phone':'[Téléphone à compléter]','contact.zone':'[Adresse et zones d’intervention à compléter]','contact.social':'[Liens réseaux sociaux à compléter]',
'pay.text':'[Modalités de paiement, d’annulation et de remboursement à définir]',
'legal.text':'[Éditeur : nom, statut, SIRET, adresse, contact à compléter]\n\nHébergeur : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.\n\n[Autres mentions légales à compléter]',
'privacy.text':'Les données saisies lors d’une réservation (identité, e-mail, téléphone, message) servent uniquement à traiter la réservation et à vous contacter. Pour un participant mineur, les coordonnées du représentant légal sont demandées. Les données sont stockées chez Supabase.\n\n[Responsable du traitement, durée de conservation, droits d’accès et de suppression, contact à compléter]',
'faq.1.q':'Comment réserver ?','faq.1.a':'Choisissez un créneau ouvert sur la page de l’accompagnement, puis renseignez vos informations. [Processus de confirmation à préciser]',
'faq.2.q':'Quelle est la durée d’une séance ?','faq.2.a':DUR,
'faq.3.q':'Quelles sont les modalités d’annulation et de paiement ?','faq.3.a':'[À compléter]',
'faq.4.q':'Les mineurs peuvent-ils réserver ?','faq.4.a':'Oui, avec les coordonnées du représentant légal, demandées lors de la réservation.',
'video.url':''};
const DEF_OFFERS=[
['physique','Séance à l’unité','',5000],['physique','Pack de 5 séances','soit 45 € par séance',22500],['physique','Pack de 10 séances','soit 40 € par séance',40000],
['mentale','Séance à l’unité','Individuel ou petit groupe (détails à préciser)',5000],['mentale','Pack de 5 séances','soit 40 € par séance',20000],
['basket','1 personne','30 € par personne',3000],['basket','2 personnes','25 € par personne',5000],['basket','3 personnes','20 € par personne',6000],['basket','4 personnes','17 € par personne',6800,true]
].map(([service,label,detail,price_cents,tbc])=>({service,label,detail,price_cents,tbc}));

const SV={
physique:{name:'Préparation physique',k:'phys',h:'Préparation <span>physique</span>',secs:[['Vision et méthodologie','vision'],['Besoins et objectifs','needs'],['Évaluation et testing','testing'],['Nutrition','nutrition']]},
mentale:{name:'Préparation mentale',k:'ment',h:'Préparation mentale',secs:[['Vision et méthodologie','vision'],['Objectifs et déroulement','goals'],['Individuel ou petit groupe','format']]},
basket:{name:'Coaching individuel basket',k:'bask',h:'Coaching individuel <span>basket</span>',secs:[['Les fondamentaux','fund'],['Technique et gestuelle de tir','shoot'],['Un suivi adapté','levels'],['Petits groupes (4 max.)','groups']]}};

let content={...C}, offers=DEF_OFFERS, photos=[], user=null;
const t=k=>content[k]??C[k]??'';
async function loadData(){
 if(!live)return;
 try{const [c,o,m]=await Promise.all([sb.from('site_content').select('*'),sb.from('offers').select('*').eq('active',true).order('sort'),sb.from('media').select('*').eq('kind','photo').order('sort')]);
 (c.data||[]).forEach(r=>content[r.key]=r.value); if(o.data?.length)offers=o.data; photos=m.data||[];}catch(e){console.error(e)}
}
const foot=()=>{$('#foot').innerHTML=`<p><strong>${tbd(t('brand'))}</strong></p><p><a href="#/faq">FAQ</a><a href="#/mentions">Mentions légales</a><a href="#/confidentialite">Confidentialité</a><a href="#/admin">Espace admin</a></p>`;$('#brand').innerHTML=tbd(t('brand'))};
const gallery=()=>`<section class="wrap rv"><h2>Galerie</h2>${photos.length?`<div class="gal">${photos.map(p=>`<img loading="lazy" src="${esc(p.url)}" alt="${esc(p.caption||'Photo')}">`).join('')}</div>`:`<p><mark class="tbd">[Galerie à alimenter depuis l’espace administrateur]</mark></p>`}</section>`;
const video=()=>{const u=t('video.url');let inner='<mark class="tbd">[Vidéo de présentation à ajouter]</mark>';
 const y=u.match(/(?:youtu\.be\/|v=)([\w-]{11})/);if(y)inner=`<iframe src="https://www.youtube-nocookie.com/embed/${y[1]}" allowfullscreen title="Vidéo de présentation"></iframe>`;else if(/^https:\/\/.+\.(mp4|webm)/.test(u))inner=`<video controls src="${esc(u)}"></video>`;
 return `<section class="wrap rv"><h2>Vidéo de présentation</h2><div class="vid">${inner}</div></section>`};
const contactBlock=()=>`<div class="box"><p>${tbd(t('contact.email'))}</p><p>${tbd(t('contact.phone'))}</p><p>${tbd(t('contact.zone'))}</p><p>${tbd(t('contact.social'))}</p></div>`;

const pages={
home(){return `<section class="hero wrap"><h1>${esc(t('home.title'))}</h1><p>${esc(t('home.lead'))}</p><div class="row"><a class="btn" href="#/a-propos">Découvrir l’accompagnement</a><a class="btn alt" style="color:var(--ink)" href="#/physique#resa" data-resa>Réserver un créneau</a></div></section>
<div class="panels">${Object.entries(SV).map(([id,s])=>`<a class="panel p-${id}" href="#/${id}"><h2>${s.name}</h2><p>${esc(t(s.k+'.intro'))}</p><b>Découvrir l’accompagnement</b></a>`).join('')}</div>
<section class="wrap rv"><h2>Qui accompagne ?</h2>${rich(t('home.about'))}<a class="btn" href="#/a-propos">Mon parcours</a></section>${video()}${gallery()}
<section class="wrap rv"><h2>Contact</h2>${contactBlock()}</section>`},
service(id){const s=SV[id],o=offers.filter(x=>x.service===id);
 return `<div class="shero"><div class="wrap"><h1>${s.h}</h1><p>${esc(t(s.k+'.intro'))}</p><a class="btn" style="background:var(--a)" href="#/${id}#resa" data-resa>Réserver un créneau</a></div></div>
<div class="wrap">${s.secs.map(([h,k])=>`<div class="sec2 rv"><h2>${h}</h2><div>${rich(t(s.k+'.'+k))}</div></div>`).join('')}
<section class="rv"><h2>Offres et tarifs</h2><div class="grid">${o.map(x=>`<div class="box"><h3>${esc(x.label)}</h3><div class="price">${eur(x.price_cents)}</div><p>${tbd(x.detail||'')}${x.tbc?' <mark class="tbd">[tarif à confirmer]</mark>':''}</p></div>`).join('')}</div>
<p class="note" style="margin-top:1rem">${DUR}</p><p>${esc(t('loyalty'))}</p><p>${tbd(t('pay.text'))}</p></section>
<section id="resa" class="rv"><h2>Réserver un créneau</h2><div id="booking"></div></section></div>`},
about(){return `<div class="shero"><div class="wrap"><h1>À propos</h1></div></div><div class="wrap"><section>${rich(t('about.text'))}<h2>Ma vision</h2>${rich(t('about.vision'))}</section></div>${gallery()}`},
contact(){return `<div class="shero"><div class="wrap"><h1>Contact</h1></div></div><div class="wrap"><section>${contactBlock()}</section></div>`},
faq(){return `<div class="shero"><div class="wrap"><h1>FAQ</h1></div></div><div class="wrap"><section>${[1,2,3,4].map(i=>`<details class="box" style="margin-bottom:.6rem"><summary><strong>${esc(t(`faq.${i}.q`))}</strong></summary>${rich(t(`faq.${i}.a`))}</details>`).join('')}</section></div>`},
mentions(){return `<div class="wrap"><section><h1>Mentions légales</h1>${rich(t('legal.text'))}</section></div>`},
confidentialite(){return `<div class="wrap"><section><h1>Confidentialité</h1>${rich(t('privacy.text'))}</section></div>`}};

function booking(id){
 const box=$('#booking');if(!box)return;
 if(!live){box.innerHTML='<p class="msg err">Réservation en ligne non connectée : Supabase n’est pas encore configuré (voir README). Aucune réservation ne peut être enregistrée pour le moment.</p>';return}
 const o=offers.filter(x=>x.service===id&&x.id&&(x.sessions||1)>=1);let slot=null;
 box.innerHTML='<p>Chargement des créneaux…</p>';
 sb.rpc('get_open_slots',{p_service:id}).then(({data,error})=>{
  const list=(data||[]).filter(s=>s.remaining>0);
  if(error||!list.length){box.innerHTML=`<p>${error?'Créneaux indisponibles pour le moment.':'Aucun créneau ouvert actuellement. Revenez bientôt ou utilisez la page Contact.'}</p>`;return}
  box.innerHTML=`<div class="slots">${list.map(s=>`<button class="slot" aria-pressed="false" data-id="${s.id}" data-r="${s.remaining}">${fmt(s.starts_at)}<br><small>${s.duration_min} min · ${s.remaining} place${s.remaining>1?'s':''}</small></button>`).join('')}</div>
  <form id="bf" hidden><label>Offre<select name="offer" required>${o.map(x=>`<option value="${x.id}" data-p="${x.participants}">${esc(x.label)} — ${eur(x.price_cents)}</option>`).join('')}</select></label>
  <label>Prénom<input name="first" required maxlength="80" autocomplete="given-name"></label><label>Nom<input name="last" required maxlength="80" autocomplete="family-name"></label>
  <label>E-mail<input name="email" type="email" required autocomplete="email"></label><label>Téléphone (facultatif)<input name="phone" type="tel" autocomplete="tel"></label>
  <label class="chk"><input type="checkbox" name="minor"> <span>Le participant est mineur</span></label>
  <div id="g" hidden><label>Représentant légal : nom<input name="gname"></label><label>Représentant légal : e-mail<input name="gemail" type="email"></label></div>
  <label>Message (facultatif)<textarea name="note" rows="3" maxlength="1000"></textarea></label>
  <p class="note">La demande est enregistrée avec le statut « en attente ». Aucun paiement en ligne n’est proposé pour l’instant. ${DUR}</p>
  <button class="btn" style="background:var(--a)">Envoyer la demande</button><div id="res" role="status"></div></form>`;
  const f=$('#bf');
  box.querySelectorAll('.slot').forEach(b=>b.onclick=()=>{box.querySelectorAll('.slot').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');slot=b;f.hidden=false;
   [...f.offer.options].forEach(op=>op.disabled=+op.dataset.p>+b.dataset.r);f.offer.selectedIndex=[...f.offer.options].findIndex(op=>!op.disabled)});
  f.minor.onchange=()=>$('#g').hidden=!f.minor.checked;
  f.onsubmit=async e=>{e.preventDefault();const r=$('#res');
   const {error}=await sb.rpc('book_slot',{p_slot:slot.dataset.id,p_offer:f.offer.value,p_first:f.first.value,p_last:f.last.value,p_email:f.email.value,p_phone:f.phone.value||null,p_minor:f.minor.checked,p_gname:f.gname.value||null,p_gemail:f.gemail.value||null,p_note:f.note.value||null});
   r.className='msg'+(error?' err':'');r.textContent=error?error.message:'Demande enregistrée (en attente de confirmation). Vous serez recontacté.';if(!error){f.reset();setTimeout(()=>booking(id),1500)}};
 });
}

// ---------- Admin ----------
const ST=['pending','confirmed','cancelled','done'],STL={pending:'En attente',confirmed:'Confirmée',cancelled:'Annulée',done:'Réalisée'},PS=['unpaid','paid','refunded'],PSL={unpaid:'Non payé',paid:'Payé',refunded:'Remboursé'};
const opts=(a,l,v)=>a.map(x=>`<option value="${x}"${x===v?' selected':''}>${l[x]||x}</option>`).join('');
async function admin(){
 const app=$('#app');
 if(!live){app.innerHTML='<div class="wrap"><section><h1>Espace administrateur</h1><p class="msg err">Supabase n’est pas configuré (config.js).</p></section></div>';return}
 const {data:{session}}=await sb.auth.getSession();
 const ok=session?(await sb.rpc('is_admin')).data:false;
 if(!ok){app.innerHTML=`<div class="wrap"><section><h1>Espace administrateur</h1><form id="lf"><label>E-mail<input name="e" type="email" required></label><label>Mot de passe<input name="p" type="password" required></label><button class="btn">Se connecter</button><div id="lm"></div></form>${session?'<p class="msg err">Ce compte n’est pas autorisé.</p>':''}</section></div>`;
  $('#lf').onsubmit=async e=>{e.preventDefault();const {error}=await sb.auth.signInWithPassword({email:e.target.e.value,password:e.target.p.value});if(error)$('#lm').innerHTML='<p class="msg err">'+error.message+'.</p>';else admin()};return}
 const tabs={Réservations:tBook,Créneaux:tSlots,'Offres et tarifs':tOffers,Contenus:tContent,Médias:tMedia};
 app.innerHTML=`<div class="wrap"><section><h1>Administration</h1><div class="tabs" role="tablist">${Object.keys(tabs).map((k,i)=>`<button role="tab" aria-selected="${i==0}">${k}</button>`).join('')}<button id="out">Déconnexion</button></div><div id="tab"></div></section></div>`;
 const show=n=>{app.querySelectorAll('[role=tab]').forEach(b=>b.setAttribute('aria-selected',b.textContent===n));tabs[n]($('#tab'))};
 app.querySelectorAll('[role=tab]').forEach(b=>b.onclick=()=>show(b.textContent));$('#out').onclick=async()=>{await sb.auth.signOut();admin()};show('Réservations');
}
const toast=(el,m,e)=>{el.insertAdjacentHTML('afterbegin',`<p class="msg${e?' err':''}">${esc(m)}</p>`);setTimeout(()=>el.firstElementChild?.remove(),3000)};
async function tBook(el){const {data=[]}=await sb.from('bookings').select('*,slots(starts_at,duration_min)').order('created_at',{ascending:false});
 el.innerHTML=`<div class="tw"><table><tr><th>Créneau</th><th>Client</th><th>Prestation</th><th>Statut</th><th>Paiement</th></tr>${data.map(b=>`<tr><td>${b.slots?fmt(b.slots.starts_at):'-'}</td><td>${esc(b.first_name)} ${esc(b.last_name)}<br>${esc(b.email)} ${esc(b.phone||'')}${b.is_minor?`<br><em>Mineur · resp. : ${esc(b.guardian_name)} ${esc(b.guardian_email)}</em>`:''}${b.note?`<br>“${esc(b.note)}”`:''}</td><td>${SV[b.service]?.name} · ${b.participants} pers. · ${eur(b.amount_cents||0)}</td><td><select data-id="${b.id}" data-f="status">${opts(ST,STL,b.status)}</select></td><td><select data-id="${b.id}" data-f="payment_status">${opts(PS,PSL,b.payment_status)}</select></td></tr>`).join('')||'<tr><td colspan=5>Aucune réservation.</td></tr>'}</table></div><p class="note">Suivi interne uniquement : ce n’est pas une comptabilité officielle.</p>`;
 el.querySelectorAll('select').forEach(s=>s.onchange=async()=>{const {error}=await sb.from('bookings').update({[s.dataset.f]:s.value}).eq('id',s.dataset.id);toast(el,error?error.message:'Enregistré',!!error)})}
async function tSlots(el){const {data=[]}=await sb.from('slots').select('*').order('starts_at');
 el.innerHTML=`<form id="sf"><label>Type<select name="service">${Object.entries(SV).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join('')}</select></label><label>Début<input name="at" type="datetime-local" required></label><label>Durée (min)<input name="d" type="number" value="60" min="15" step="5"></label><label>Places (max 4)<input name="c" type="number" value="1" min="1" max="4"></label><button class="btn">Créer le créneau</button></form>
 <div class="tw"><table>${data.map(s=>`<tr><td>${fmt(s.starts_at)}</td><td>${SV[s.service].name}</td><td>${s.duration_min} min · ${s.capacity} pl.</td><td>${s.status==='open'?'Ouvert':'Fermé'}</td><td><button data-t="${s.id}" data-s="${s.status}">${s.status==='open'?'Fermer':'Ouvrir'}</button> <button data-x="${s.id}">Supprimer</button></td></tr>`).join('')}</table></div>`;
 $('#sf').onsubmit=async e=>{e.preventDefault();const f=e.target;const {error}=await sb.from('slots').insert({service:f.service.value,starts_at:new Date(f.at.value).toISOString(),duration_min:+f.d.value,capacity:+f.c.value});error?toast(el,error.message,1):tSlots(el)};
 el.querySelectorAll('[data-t]').forEach(b=>b.onclick=async()=>{await sb.from('slots').update({status:b.dataset.s==='open'?'closed':'open'}).eq('id',b.dataset.t);tSlots(el)});
 el.querySelectorAll('[data-x]').forEach(b=>b.onclick=async()=>{const {error}=await sb.from('slots').delete().eq('id',b.dataset.x);error?toast(el,'Suppression impossible (réservations liées) : fermez le créneau.',1):tSlots(el)})}
async function tOffers(el){const {data=[]}=await sb.from('offers').select('*').order('service').order('sort');
 el.innerHTML=`<div class="tw"><table><tr><th>Type</th><th>Libellé</th><th>Détail</th><th>Prix total (€)</th><th>Participants</th><th>Actif</th><th></th></tr>${data.map(o=>`<tr data-id="${o.id}"><td>${SV[o.service].name}</td><td><input value="${esc(o.label)}" data-f="label"></td><td><input value="${esc(o.detail||'')}" data-f="detail"></td><td><input type="number" step="0.5" value="${o.price_cents/100}" data-f="price"></td><td><input type="number" min="1" max="4" value="${o.participants}" data-f="participants"></td><td><input type="checkbox" ${o.active?'checked':''} data-f="active"></td><td><button>Enregistrer</button></td></tr>`).join('')}</table></div>
 <button class="btn" id="add">Ajouter une offre</button>`;
 el.querySelectorAll('tr[data-id] button').forEach(b=>b.onclick=async()=>{const r=b.closest('tr'),g=f=>r.querySelector(`[data-f=${f}]`);const {error}=await sb.from('offers').update({label:g('label').value,detail:g('detail').value,price_cents:Math.round(g('price').value*100),participants:+g('participants').value,active:g('active').checked}).eq('id',r.dataset.id);toast(el,error?error.message:'Enregistré',!!error)});
 $('#add').onclick=async()=>{const s=prompt('Type : physique, mentale ou basket ?');if(!SV[s])return;await sb.from('offers').insert({service:s,label:'Nouvelle offre',price_cents:0});tOffers(el)}}
async function tContent(el){const {data=[]}=await sb.from('site_content').select('*');const cur={...C};data.forEach(r=>cur[r.key]=r.value);
 el.innerHTML=`<form style="max-width:760px">${Object.keys(C).map(k=>`<label>${k}<textarea name="${k}" rows="${cur[k].length>120?4:1}">${esc(cur[k])}</textarea></label>`).join('')}<button class="btn">Enregistrer les contenus</button></form><p class="note">Les passages entre crochets [ ] s’affichent comme « à compléter » sur le site.</p>`;
 el.querySelector('form').onsubmit=async e=>{e.preventDefault();const rows=Object.keys(C).map(k=>({key:k,value:e.target[k].value}));const {error}=await sb.from('site_content').upsert(rows);toast(el,error?error.message:'Contenus enregistrés',!!error)}}
async function tMedia(el){const {data=[]}=await sb.from('media').select('*').order('created_at',{ascending:false});
 el.innerHTML=`<form id="mf"><label>Ajouter une photo<input type="file" name="f" accept="image/*" required></label><label>Légende<input name="cap"></label><button class="btn">Téléverser</button></form><p class="note">Vidéo : collez un lien YouTube ou un fichier .mp4 dans Contenus › video.url.</p>
 <div class="gal">${data.map(m=>`<div><img src="${esc(m.url)}" alt=""><button data-x="${m.id}" data-p="${esc(m.path||'')}">Supprimer</button></div>`).join('')}</div>`;
 $('#mf').onsubmit=async e=>{e.preventDefault();const f=e.target.f.files[0],path=`${Date.now()}-${f.name.replace(/[^\w.-]/g,'_')}`;const u=await sb.storage.from('media').upload(path,f);if(u.error)return toast(el,u.error.message,1);
  const url=sb.storage.from('media').getPublicUrl(path).data.publicUrl;await sb.from('media').insert({url,path,caption:e.target.cap.value});tMedia(el)};
 el.querySelectorAll('[data-x]').forEach(b=>b.onclick=async()=>{if(b.dataset.p)await sb.storage.from('media').remove([b.dataset.p]);await sb.from('media').delete().eq('id',b.dataset.x);tMedia(el)})}

// ---------- Routeur ----------
const rv=()=>{const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&(e.target.classList.add('on'),io.unobserve(e.target))),{threshold:.12});document.querySelectorAll('.rv').forEach(x=>io.observe(x))};
async function route(){
 const [p,anchor]=location.hash.replace(/^#\/?/,'').split('#');const key=p||'home';
 document.body.dataset.t=SV[key]?key:'home';$('#nav').classList.remove('open');
 if(key==='admin')await admin();
 else{$('#app').innerHTML=SV[key]?pages.service(key):(pages[{'a-propos':'about'}[key]||key]||pages.home)();if(SV[key])booking(key)}
 foot();rv();if(anchor)document.getElementById(anchor)?.scrollIntoView();else scrollTo(0,0);
}
document.addEventListener('click',e=>{const a=e.target.closest('[data-resa]');if(a){const key=location.hash.match(/#\/(physique|mentale|basket)/)?.[1];if(key){e.preventDefault();document.getElementById('resa')?.scrollIntoView()}}});
$('.burger').onclick=e=>{const n=$('#nav');n.classList.toggle('open');e.target.setAttribute('aria-expanded',n.classList.contains('open'))};
if(!live)$('#banner').innerHTML='<div class="warn">Mode aperçu : Supabase n’est pas connecté. Les contenus affichés sont ceux par défaut et les réservations sont désactivées.</div>';
addEventListener('hashchange',route);
loadData().then(route);
