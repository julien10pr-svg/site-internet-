import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
const cfg=window.SITE_CONFIG||{}, live=!!(cfg.supabaseUrl&&cfg.supabaseAnonKey);
const sb=live?createClient(cfg.supabaseUrl,cfg.supabaseAnonKey):null;
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tbd=s=>esc(s).replace(/\[[^\]]+\]/g,m=>`<mark class="tbd">${m}</mark>`);
const rich=s=>String(s??'').split(/\n\n+/).map(p=>`<p style="margin:0 auto 1.35em;line-height:1.75">${tbd(p).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')}</p>`).join('');
const eur=c=>(c/100).toLocaleString('fr-FR',{style:'currency',currency:'EUR',minimumFractionDigits:c%100?2:0});
const fmt=d=>new Date(d).toLocaleString('fr-FR',{weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Paris'});
const DUR='SÃ©ance de rÃ©fÃ©rence : 1 h 15 de sÃ©ance effective, suivie dâ€™un dÃ©briefing et de conseils.';
const TBC='[Ã€ complÃ©ter]';

const C={ // textes par dÃ©faut, modifiables dans l'espace admin (onglet Contenus)
'brand':'[Nom de lâ€™activitÃ© Ã  dÃ©finir]',
'home.title':'PrÃ©parer le corps, lâ€™esprit et le geste.',
'home.lead':'PrÃ©paration physique, prÃ©paration mentale et coaching de basket, en individuel ou en petit groupe. Un accompagnement construit autour de votre niveau et de vos objectifs.',
'home.about':'Je termine un Master EOPS Ã  lâ€™UniversitÃ© de Lille, en alternance au sein du club de la Patriote de Templeuve. Jâ€™y entraÃ®ne les U18F RÃ©gion et jâ€™assiste les U18 France. Jâ€™interviens aussi Ã  lâ€™Ã©cole de basket.\n\n[Phrase personnelle sur ma faÃ§on dâ€™accompagner Ã  rÃ©diger]',
'phys.intro':'Un travail physique structurÃ©, pensÃ© pour le sport pratiquÃ© et le profil de chaque athlÃ¨te.',
'phys.vision':'[Vision et mÃ©thodologie Ã  dÃ©tailler]',
'phys.needs':'[Besoins et objectifs concernÃ©s Ã  dÃ©tailler]',
'phys.testing':'[Moyens dâ€™Ã©valuation et de testing Ã  prÃ©ciser]',
'phys.nutrition':'Lâ€™accompagnement nutritionnel peut complÃ©ter le travail physique.\n\n[Place et contenu de lâ€™accompagnement nutritionnel Ã  prÃ©ciser]',
'ment.intro':'Un accompagnement individuel pour travailler la confiance, la concentration et la gestion de la pression.',
'ment.vision':'[Vision et mÃ©thodologie Ã  dÃ©tailler]',
'ment.goals':'[Objectifs possibles et dÃ©roulement gÃ©nÃ©ral Ã  prÃ©ciser]',
'ment.format':'Les sÃ©ances sont individuelles.\n\n[DÃ©tails des formats Ã  prÃ©ciser]',
'bask.intro':'Du joueur dÃ©butant Ã  celle ou celui qui vise une progression importante, par exemple une entrÃ©e au CREPS : un coaching adaptÃ© au niveau, aux objectifs et au profil.',
'bask.fund':'Travail des fondamentaux individuels : maniement, appuis, finitions, lecture de jeu.\n\n[Contenu Ã  dÃ©tailler]',
'bask.shoot':'DÃ©veloppement technique et gestuelle de tir, avec un suivi progressif.\n\n[Contenu Ã  dÃ©tailler]',
'bask.levels':'Chaque sÃ©ance sâ€™adapte au niveau, aux objectifs et au profil du joueur ou de la joueuse.',
'bask.groups':'Les petits groupes sont limitÃ©s Ã  4 personnes. Le tarif par personne diminue avec la taille du groupe, et le groupe se rÃ©serve ensemble.',
'clubs.intro':'Des interventions adaptÃ©es aux clubs sportifs, quel que soit le sport, et aux entreprises : prÃ©paration physique et mentale, formation des staffs, cohÃ©sion dâ€™Ã©quipe et bien-Ãªtre.',
'clubs.players':'Un accompagnement en prÃ©paration physique et mentale, construit selon les besoins des joueurs et joueuses, leur discipline et les objectifs du club.',
'clubs.staff':'Des formations et temps dâ€™Ã©change pour les entraÃ®neurs et les staffs : mieux comprendre les principes de prÃ©paration physique et mentale, puis les intÃ©grer dans leur pratique.',
'clubs.companies':'Des ateliers autour de la cohÃ©sion dâ€™Ã©quipe, du bien-Ãªtre et de lâ€™activitÃ© physique, adaptÃ©s aux besoins de votre entreprise.',
'clubs.frequency':'Les interventions peuvent Ãªtre ponctuelles ou sâ€™inscrire dans un accompagnement mensuel, sur un semestre ou sur une annÃ©e.',
'clubs.duration':'La durÃ©e de chaque intervention sâ€™adapte Ã  votre besoin : dâ€™une heure Ã  une demi-journÃ©e.',
'clubs.pricing':'Le tarif varie selon le contenu, la durÃ©e et le public concernÃ©. Une proposition personnalisÃ©e est Ã©tablie aprÃ¨s Ã©change sur votre mission.',
'loyalty':'Des avantages fidÃ©litÃ© peuvent Ãªtre proposÃ©s aux clients rÃ©guliers. Ils ne se cumulent pas automatiquement avec les tarifs de groupe ou les packs.',
'about.text':'Je suis en deuxiÃ¨me annÃ©e de Master EOPS Ã  lâ€™UniversitÃ© de Lille, en alternance Ã  la Patriote de Templeuve : coach principal des U18F RÃ©gion, assistant auprÃ¨s des U18 France, et intervenant Ã  lâ€™Ã©cole de basket.\n\nFormations : Brevet fÃ©dÃ©ral jeune en basket ; DETB en cours (trois Ã©valuations sur quatre validÃ©es, diplÃ´me non encore obtenu) ; AUEC en rÃ©athlÃ©tisation du sportif.\n\n[Texte de prÃ©sentation personnelle Ã  complÃ©ter]',
'about.vision':'[Ma vision de lâ€™accompagnement Ã  rÃ©diger]',
'contact.email':'[E-mail Ã  complÃ©ter]','contact.phone':'[TÃ©lÃ©phone Ã  complÃ©ter]','contact.zone':'[Adresse et zones dâ€™intervention Ã  complÃ©ter]','contact.social':'[Liens rÃ©seaux sociaux Ã  complÃ©ter]',
'pay.text':'[ModalitÃ©s de paiement, dâ€™annulation et de remboursement Ã  dÃ©finir]',
'legal.text':'[Ã‰diteur : nom, statut, SIRET, adresse, contact Ã  complÃ©ter]\n\nHÃ©bergeur : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, Ã‰tats-Unis.\n\n[Autres mentions lÃ©gales Ã  complÃ©ter]',
'privacy.text':'Les donnÃ©es saisies lors dâ€™une rÃ©servation (identitÃ©, e-mail, tÃ©lÃ©phone, message) servent uniquement Ã  traiter la rÃ©servation et Ã  vous contacter. Pour un participant mineur, les coordonnÃ©es du reprÃ©sentant lÃ©gal sont demandÃ©es. Les donnÃ©es sont stockÃ©es chez Supabase.\n\n[Responsable du traitement, durÃ©e de conservation, droits dâ€™accÃ¨s et de suppression, contact Ã  complÃ©ter]',
'faq.1.q':'Comment rÃ©server ?','faq.1.a':'Choisissez un crÃ©neau ouvert sur la page de lâ€™accompagnement, puis renseignez vos informations. [Processus de confirmation Ã  prÃ©ciser]',
'faq.2.q':'Quelle est la durÃ©e dâ€™une sÃ©ance ?','faq.2.a':DUR,
'faq.3.q':'Quelles sont les modalitÃ©s dâ€™annulation et de paiement ?','faq.3.a':'[Ã€ complÃ©ter]',
'faq.4.q':'Les mineurs peuvent-ils rÃ©server ?','faq.4.a':'Oui, avec les coordonnÃ©es du reprÃ©sentant lÃ©gal, demandÃ©es lors de la rÃ©servation.',
'video.url':''};
const DEF_OFFERS=[
['physique','SÃ©ance Ã  lâ€™unitÃ©','',5000],['physique','Pack de 5 sÃ©ances','soit 45 â‚¬ par sÃ©ance',22500],['physique','Pack de 10 sÃ©ances','soit 40 â‚¬ par sÃ©ance',40000],
['mentale','SÃ©ance Ã  lâ€™unitÃ©','SÃ©ance individuelle',5000],['mentale','Pack de 5 sÃ©ances','soit 40 â‚¬ par sÃ©ance',20000],
['basket','1 personne','30 â‚¬ par personne',3000],['basket','2 personnes','25 â‚¬ par personne',5000],['basket','3 personnes','20 â‚¬ par personne',6000],['basket','4 personnes','17 â‚¬ par personne',6800,true]
].map(([service,label,detail,price_cents,tbc])=>({service,label,detail,price_cents,tbc}));

const SV={
physique:{name:'PrÃ©paration physique',k:'phys',h:'PrÃ©paration <span>physique</span>',secs:[['Vision et mÃ©thodologie','vision'],['Besoins et objectifs','needs'],['Ã‰valuation et testing','testing'],['Nutrition','nutrition']]},
mentale:{name:'PrÃ©paration mentale',k:'ment',h:'PrÃ©paration mentale',secs:[['Vision et mÃ©thodologie','vision'],['Objectifs et dÃ©roulement','goals'],['Individuel','format']]},
basket:{name:'Coaching individuel basket',k:'bask',h:'Coaching individuel <span>basket</span>',secs:[['Les fondamentaux','fund'],['Technique et gestuelle de tir','shoot'],['Un suivi adaptÃ©','levels'],['Petits groupes (4 max.)','groups']]}};

const TIMELINE=[
 {year:'2020',tone:'physique',chapter:'Les premiers repÃ¨res',events:[
  {label:'FORMATION',title:'BAFA',detail:'Perfectionnement assistant sanitaire'},
  {label:'SECOURISME',title:'PSC1',detail:'Premiers gestes de secours'}
 ]},
 {year:'Juin 2021',tone:'mentale',chapter:'Un premier diplÃ´me',events:[
  {label:'DIPLÃ”ME',title:'BaccalaurÃ©at scientifique',detail:'Obtention du bac scientifique'}
 ]},
 {year:'2022â€“2023',tone:'basket',chapter:'Les dÃ©buts sur le terrain',events:[
  {label:'COACHING',title:'PremiÃ¨re saison Ã  Roncq',detail:'Coaching de lâ€™Ã©quipe U13 garÃ§ons'},
  {label:'FORMATION',title:'Brevet fÃ©dÃ©ral adulte',detail:'Validation du brevet fÃ©dÃ©ral de basket adulte'}
 ]},
 {year:'2023â€“2024',tone:'clubs',chapter:'PremiÃ¨res expÃ©riences rÃ©gionales',events:[
  {label:'ENCADREMENT',title:'U15 filles RÃ©gion',detail:'EntraÃ®neur Ã  Roncq'},
  {label:'SÃ‰LECTION',title:'U11 garÃ§ons Â· Terrien Sud',detail:'Participation Ã  la sÃ©lection'}
 ]},
 {year:'2024â€“2025',tone:'physique',chapter:'Une saison qui sâ€™intensifie',events:[
  {label:'ENCADREMENT',title:'U15F et U18F RÃ©gion',detail:'EntraÃ®neur Ã  Roncq'},
  {label:'SÃ‰LECTION',title:'U11 garÃ§ons Â· Terrien Sud',detail:'Encadrement de la sÃ©lection'},
  {label:'UNIVERSITAIRE',title:'Championnat de France universitaire',detail:'Coach de lâ€™Ã©quipe de basket de lâ€™UniversitÃ© de Lille'},
  {label:'FORMATION',title:'DETB Â· 3 modules sur 4',detail:'Modules validÃ©s en mai 2025'},
  {label:'DIPLÃ”ME',title:'Licence STAPS Â· mention Bien',detail:'DiplÃ´me obtenu en juin 2025'}
 ]},
 {year:'2025â€“2026',tone:'basket',chapter:'De nouvelles responsabilitÃ©s',events:[
  {label:'ENCADREMENT',title:'U18 France et U18 RÃ©gion R1',detail:'Assistant U18 France et entraÃ®neur Ã  la Patriote de Templeuve'},
  {label:'SPÃ‰CIALISATION',title:'RÃ©athlÃ©tisation du sportif',detail:'Formation AUEC en juin 2026'}
 ]},
 {year:'2026â€“2027',tone:'clubs',chapter:'La suite Ã  Templeuve',events:[
  {label:'ENCADREMENT',title:'U18 France Â· U18 RÃ©gion R1',detail:'Assistant U18 France et entraÃ®neur U18 RÃ©gion R1'},
  {label:'TRANSMISSION',title:'Ã‰cole de basket',detail:'Intervenant Ã  la Patriote de Templeuve'}
 ]}
];

let content={...C}, offers=DEF_OFFERS, reviews=[], user=null;
const t=k=>content[k]??C[k]??'';
function parseReviews(value){
 try{
  const parsed=Array.isArray(value)?value:JSON.parse(value||'[]');
  return Array.isArray(parsed)?parsed.filter(r=>r&&typeof r.text==='string'&&r.text.trim()).map(r=>({text:r.text.trim(),name:typeof r.name==='string'?r.name.trim():''})):[];
 }catch{return []}
}
async function loadData(){
 if(!live)return;
 try{const [c,o]=await Promise.all([sb.from('site_content').select('*'),sb.from('offers').select('*').eq('active',true).order('sort')]);
 (c.data||[]).forEach(r=>{if(r.key==='reviews.data')reviews=parseReviews(r.value);else content[r.key]=r.value}); if(o.data?.length)offers=o.data;}catch(e){console.error(e)}
}
const foot=()=>{$('#foot').innerHTML=`<p><strong>${tbd(t('brand'))}</strong></p><p><a href="#/faq">FAQ</a><a href="#/mentions">Mentions lÃ©gales</a><a href="#/confidentialite">ConfidentialitÃ©</a><a href="#/admin">Espace admin</a></p>`;$('#brand').innerHTML=tbd(t('brand'))};
const video=()=>{const u=t('video.url');let inner='<mark class="tbd">[VidÃ©o de prÃ©sentation Ã  ajouter]</mark>';
 const y=u.match(/(?:youtu\.be\/|v=)([\w-]{11})/);if(y)inner=`<iframe src="https://www.youtube-nocookie.com/embed/${y[1]}" allowfullscreen title="VidÃ©o de prÃ©sentation"></iframe>`;else if(/^https:\/\/.+\.(mp4|webm)/.test(u))inner=`<video controls src="${esc(u)}"></video>`;
 return `<section class="wrap rv" style="padding-top:clamp(2rem,4vw,3rem)"><h2>VidÃ©o de prÃ©sentation</h2><div class="vid">${inner}</div></section>`};
const contactBlock=()=>`<div class="box"><p>${tbd(t('contact.email'))}</p><p>${tbd(t('contact.phone'))}</p><p>${tbd(t('contact.zone'))}</p><p>${tbd(t('contact.social'))}</p></div>`;
const reviewsSection=()=>`<section class="wrap rv reviews-section" aria-labelledby="reviews-title"><div class="reviews-heading"><h2 id="reviews-title">Vos avis</h2><p>Les retours dâ€™expÃ©rience des personnes accompagnÃ©es.</p></div>${reviews.length?`<div class="reviews-carousel" data-reviews-carousel><article class="review-bubble" aria-live="polite"><blockquote><p data-review-text></p><cite data-review-name></cite></blockquote></article><div class="review-controls"><button type="button" data-review-prev aria-label="Avis prÃ©cÃ©dent">â†</button><span data-review-count aria-live="polite"></span><button type="button" data-review-next aria-label="Avis suivant">â†’</button></div></div>`:`<p class="reviews-empty">Les premiers avis seront affichÃ©s ici.</p>`}</section>`;
function setupClubTabs(){
 const tabs=[...document.querySelectorAll('[data-club-tab]')];
 const panels=[...document.querySelectorAll('[data-club-panel]')];
 if(!tabs.length||!panels.length)return;
 const activate=name=>{
  tabs.forEach(tab=>{
   const selected=tab.dataset.clubTab===name;
   tab.setAttribute('aria-selected',String(selected));
   tab.tabIndex=selected?0:-1
  });
  panels.forEach(panel=>{
   const selected=panel.dataset.clubPanel===name;
   panel.hidden=!selected;
   panel.classList.toggle('is-active',selected)
  })
 };
 tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>activate(tab.dataset.clubTab));
  tab.addEventListener('keydown',event=>{
   if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
   event.preventDefault();
   const next=tabs[(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length];
   next.focus();
   activate(next.dataset.clubTab)
  })
 });
 activate(tabs.find(tab=>tab.getAttribute('aria-selected')==='true')?.dataset.clubTab||tabs[0].dataset.clubTab)
}

function setupReviews(){
 const carousel=$('[data-reviews-carousel]');if(!carousel||!reviews.length)return;
 let index=0;const quote=carousel.querySelector('[data-review-text]'),name=carousel.querySelector('[data-review-name]'),count=carousel.querySelector('[data-review-count]');
 const show=()=>{const review=reviews[index];quote.textContent=`Â« ${review.text} Â»`;name.textContent=review.name;name.hidden=!review.name;count.textContent=`${index+1} / ${reviews.length}`};
 carousel.querySelector('[data-review-prev]').onclick=()=>{index=(index-1+reviews.length)%reviews.length;show()};
 carousel.querySelector('[data-review-next]').onclick=()=>{index=(index+1)%reviews.length;show()};show();
}

let timelineFrame=0;
function updateTimelineProgress(){
 if(timelineFrame)return;
 timelineFrame=requestAnimationFrame(()=>{
  const timeline=$('[data-timeline]');
  if(timeline){
   const rect=timeline.getBoundingClientRect();
   const trigger=innerHeight*.66;
   const progress=Math.min(1,Math.max(0,(trigger-rect.top)/Math.max(1,rect.height)));
   timeline.style.setProperty('--timeline-progress',String(progress));
  }
  timelineFrame=0;
 });
}
function setupTimeline(){updateTimelineProgress()}
addEventListener('scroll',updateTimelineProgress,{passive:true});
addEventListener('resize',updateTimelineProgress);

const pages={
home(){const homeTitle=esc(t('home.title')).replace(/(Investir sur soi-mÃªme)/i,'<span class="home-title-break">$1</span>');return `<section class="hero wrap"><h1>${homeTitle}</h1><p>${esc(t('home.lead'))}</p><div class="row"><a class="btn alt" style="color:var(--ink)" href="#/physique#resa" data-resa>RÃ©server un crÃ©neau</a></div></section>
<div class="panels">${Object.entries(SV).map(([id,s])=>`<a class="panel p-${id} rv" href="#/${id}"><h2>${s.name}</h2></a>`).join('')}<a class="panel p-clubs rv" href="#/clubs"><h2>Clubs et Entreprises</h2></a></div>
<section class="wrap rv" style="padding-bottom:clamp(3rem,5vw,4rem)"><h2>Au fait, câ€™est qui Julien ?</h2>${rich(t('home.about'))}<a class="btn" href="#/a-propos">Mon parcours</a></section>${reviewsSection()}${video()}
<section class="wrap rv"><h2>Contact</h2>${contactBlock()}</section>`},
service(id){const s=SV[id],o=offers.filter(x=>x.service===id);
 return `<div class="shero rv"><div class="wrap"><h1>${s.h}</h1><p>${esc(t(s.k+'.intro'))}</p><a class="btn" style="background:var(--a)" href="#/${id}#resa" data-resa>RÃ©server un crÃ©neau</a></div></div>
<div class="wrap">${s.secs.map(([h,k])=>`<div class="sec2 rv"><h2>${h}</h2><div>${rich(t(s.k+'.'+k))}</div></div>`).join('')}
<section class="rv"><h2>Offres et tarifs</h2><div class="grid">${o.map(x=>`<div class="box"><h3>${esc(x.label)}</h3><div class="price">${eur(x.price_cents)}</div><p>${tbd(x.detail||'')}${x.tbc?' <mark class="tbd">[tarif Ã  confirmer]</mark>':''}</p></div>`).join('')}</div>
<p class="note" style="margin-top:1rem">${DUR}</p><p>${esc(t('loyalty'))}</p><p>${tbd(t('pay.text'))}</p></section>
<section id="resa" class="rv"><h2>RÃ©server un crÃ©neau</h2><div id="booking"></div></section></div>`},
 about(){return `<div class="shero about-hero rv"><div class="wrap"><p class="timeline-kicker">MON PARCOURS</p><h1>Du premier terrain<br>aux nouveaux projets.</h1><p>Une frise vivante, au fil des expÃ©riences qui mâ€™ont fait avancer.</p></div></div><section class="timeline-section wrap" aria-label="Frise chronologique de mon parcours"><div class="timeline-intro rv"><span class="timeline-eyebrow">FAIS DÃ‰FILER POUR DÃ‰COUVRIR</span><h2>Chaque Ã©tape compte.</h2><p>Formations, Ã©quipes et nouvelles expÃ©riences : les jalons de mon parcours apparaissent au fil du dÃ©filement.</p></div><div class="timeline" data-timeline><div class="timeline-rail" aria-hidden="true"></div>${TIMELINE.map((item,index)=>`<article class="timeline-item rv tone-${item.tone} ${index%2?'timeline-left':'timeline-right'}" style="--step:${index}" aria-label="${esc(item.year)} â€” ${esc(item.chapter)}"><div class="timeline-node" aria-hidden="true"><span>${String(index+1).padStart(2,'0')}</span></div><div class="timeline-card"><div class="timeline-card-top"><p class="timeline-year">${esc(item.year)}</p><span class="timeline-chapter">${esc(item.chapter)}</span></div><div class="timeline-events">${item.events.map((event,eventIndex)=>`<div class="timeline-event" style="--event-step:${eventIndex}"><span class="timeline-event-index">${String(eventIndex+1).padStart(2,'0')}</span><div class="timeline-event-copy"><span class="timeline-label">${esc(event.label)}</span><h3>${esc(event.title)}</h3><p>${esc(event.detail)}</p></div></div>`).join('')}</div></div></article>`).join('')}</div><div class="timeline-end rv"><span class="timeline-end-mark" aria-hidden="true">âœ¦</span><p>La suite sâ€™Ã©crit sur le terrain.</p></div></section>`},
clubs(){return `<div class="shero rv"><div class="wrap"><h1>Clubs et Entreprises</h1><p>${esc(t('clubs.intro'))}</p><a class="btn" href="#/contact">Ã‰changer sur votre projet</a></div></div>
<section class="wrap rv clubs-choices"><h2>Choisissez votre accompagnement</h2><div class="clubs-switch" role="tablist" aria-label="Type dâ€™intervention"><button type="button" role="tab" id="clubs-tab-sport" aria-controls="clubs-panel-sport" aria-selected="true" data-club-tab="sport">Club sportif</button><button type="button" role="tab" id="clubs-tab-company" aria-controls="clubs-panel-company" aria-selected="false" data-club-tab="company" tabindex="-1">Entreprise</button></div>
<div class="clubs-panel is-active" role="tabpanel" id="clubs-panel-sport" aria-labelledby="clubs-tab-sport" data-club-panel="sport"><h2>Interventions pour les clubs sportifs</h2><div class="grid"><article class="box"><h3>Joueurs et joueuses</h3>${rich(t('clubs.players'))}</article><article class="box"><h3>Staffs et entraÃ®neurs</h3>${rich(t('clubs.staff'))}</article></div></div>
<div class="clubs-panel" role="tabpanel" id="clubs-panel-company" aria-labelledby="clubs-tab-company" data-club-panel="company" hidden><h2>Interventions en entreprise</h2><div class="grid"><article class="box"><h3>Ã‰quipes et collaborateurs</h3>${rich(t('clubs.companies'))}</article></div></div></section>
<section class="wrap rv clubs-offers"><h2>ModalitÃ©s et tarifs</h2><div class="grid"><article class="box"><h3>FrÃ©quence des interventions</h3>${rich(t('clubs.frequency'))}</article><article class="box"><h3>DurÃ©e dâ€™une intervention</h3>${rich(t('clubs.duration'))}</article><article class="box"><h3>Tarification</h3>${rich(t('clubs.pricing'))}</article></div></section>`},
contact(){return `<div class="shero rv"><div class="wrap"><h1>Contact</h1></div></div><div class="wrap"><section class="rv">${contactBlock()}</section></div>`},
faq(){return `<div class="shero rv"><div class="wrap"><h1>FAQ</h1></div></div><div class="wrap"><section class="rv">${[1,2,3,4].map(i=>`<details class="box" style="margin-bottom:.6rem"><summary><strong>${esc(t(`faq.${i}.q`))}</strong></summary>${rich(t(`faq.${i}.a`))}</details>`).join('')}</section></div>`},
mentions(){return `<div class="wrap"><section class="rv"><h1>Mentions lÃ©gales</h1>${rich(t('legal.text'))}</section></div>`},
confidentialite(){return `<div class="wrap"><section class="rv"><h1>ConfidentialitÃ©</h1>${rich(t('privacy.text'))}</section></div>`}};

function booking(id){
 const box=$('#booking');if(!box)return;
 if(!live){box.innerHTML='<p class="msg err">RÃ©servation en ligne non connectÃ©e : Supabase nâ€™est pas encore configurÃ© (voir README). Aucune rÃ©servation ne peut Ãªtre enregistrÃ©e pour le moment.</p>';return}
 const o=offers.filter(x=>x.service===id&&x.id&&(x.sessions||1)>=1);let slot=null;
 box.innerHTML='<p>Chargement des crÃ©neauxâ€¦</p>';
 sb.rpc('get_open_slots',{p_service:id}).then(({data,error})=>{
  const list=(data||[]).filter(s=>s.remaining>0);
  if(error||!list.length){box.innerHTML=`<p>${error?'CrÃ©neaux indisponibles pour le moment.':'Aucun crÃ©neau ouvert actuellement. Revenez bientÃ´t ou utilisez la page Contact.'}</p>`;return}
  box.innerHTML=`<div class="slots">${list.map(s=>`<button class="slot" aria-pressed="false" data-id="${s.id}" data-r="${s.remaining}">${fmt(s.starts_at)}<br><small>${s.duration_min} min Â· ${s.remaining} place${s.remaining>1?'s':''}</small></button>`).join('')}</div>
  <form id="bf" hidden><label>Offre<select name="offer" required>${o.map(x=>`<option value="${x.id}" data-p="${x.participants}">${esc(x.label)} â€” ${eur(x.price_cents)}</option>`).join('')}</select></label>
  <label>PrÃ©nom<input name="first" required maxlength="80" autocomplete="given-name"></label><label>Nom<input name="last" required maxlength="80" autocomplete="family-name"></label>
  <label>E-mail<input name="email" type="email" required autocomplete="email"></label><label>TÃ©lÃ©phone (facultatif)<input name="phone" type="tel" autocomplete="tel"></label>
  <label class="chk"><input type="checkbox" name="minor"> <span>Le participant est mineur</span></label>
  <div id="g" hidden><label>ReprÃ©sentant lÃ©gal : nom<input name="gname"></label><label>ReprÃ©sentant lÃ©gal : e-mail<input name="gemail" type="email"></label></div>
  <label>Message (facultatif)<textarea name="note" rows="3" maxlength="1000"></textarea></label>
  <p class="note">La demande est enregistrÃ©e avec le statut Â« en attente Â». Aucun paiement en ligne nâ€™est proposÃ© pour lâ€™instant. ${DUR}</p>
  <button class="btn" style="background:var(--a)">Envoyer la demande</button><div id="res" role="status"></div></form>`;
  const f=$('#bf');
  box.querySelectorAll('.slot').forEach(b=>b.onclick=()=>{box.querySelectorAll('.slot').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');slot=b;f.hidden=false;
   [...f.offer.options].forEach(op=>op.disabled=+op.dataset.p>+b.dataset.r);f.offer.selectedIndex=[...f.offer.options].findIndex(op=>!op.disabled)});
  f.minor.onchange=()=>$('#g').hidden=!f.minor.checked;
  f.onsubmit=async e=>{e.preventDefault();const r=$('#res');
   const {error}=await sb.rpc('book_slot',{p_slot:slot.dataset.id,p_offer:f.offer.value,p_first:f.first.value,p_last:f.last.value,p_email:f.email.value,p_phone:f.phone.value||null,p_minor:f.minor.checked,p_gname:f.gname.value||null,p_gemail:f.gemail.value||null,p_note:f.note.value||null});
   r.className='msg'+(error?' err':'');r.textContent=error?error.message:'Demande enregistrÃ©e (en attente de confirmation). Vous serez recontactÃ©.';if(!error){f.reset();setTimeout(()=>booking(id),1500)}};
 });
}

// ---------- Admin ----------
const ST=['pending','confirmed','cancelled','done'],STL={pending:'En attente',confirmed:'ConfirmÃ©e',cancelled:'AnnulÃ©e',done:'RÃ©alisÃ©e'},PS=['unpaid','paid','refunded'],PSL={unpaid:'Non payÃ©',paid:'PayÃ©',refunded:'RemboursÃ©'};
const opts=(a,l,v)=>a.map(x=>`<option value="${x}"${x===v?' selected':''}>${l[x]||x}</option>`).join('');
async function admin(){
 const app=$('#app');
 if(!live){app.innerHTML='<div class="wrap admin"><section><h1>Espace administrateur</h1><p class="msg err">Supabase nâ€™est pas configurÃ© (config.js).</p></section></div>';return}
 const {data:{session}}=await sb.auth.getSession();
 const ok=session?(await sb.rpc('is_admin')).data:false;
 if(!ok){app.innerHTML=`<div class="wrap admin"><section><h1>Espace administrateur</h1><form id="lf"><label>E-mail<input name="e" type="email" required></label><label>Mot de passe<input name="p" type="password" required></label><button class="btn">Se connecter</button><div id="lm"></div></form>${session?'<p class="msg err">Ce compte nâ€™est pas autorisÃ©.</p>':''}</section></div>`;
  $('#lf').onsubmit=async e=>{e.preventDefault();const {error}=await sb.auth.signInWithPassword({email:e.target.e.value,password:e.target.p.value});if(error)$('#lm').innerHTML='<p class="msg err">'+error.message+'.</p>';else admin()};return}
 const tabs={RÃ©servations:tBook,CrÃ©neaux:tSlots,'Offres et tarifs':tOffers,Contenus:tContent,Avis:tReviews};
 app.innerHTML=`<div class="wrap admin"><section><h1>Administration</h1><div class="tabs" role="tablist">${Object.keys(tabs).map((k,i)=>`<button role="tab" aria-selected="${i==0}">${k}</button>`).join('')}<button id="out">DÃ©connexion</button></div><div id="tab"></div></section></div>`;
 const show=n=>{app.querySelectorAll('[role=tab]').forEach(b=>b.setAttribute('aria-selected',b.textContent===n));tabs[n]($('#tab'))};
 app.querySelectorAll('[role=tab]').forEach(b=>b.onclick=()=>show(b.textContent));$('#out').onclick=async()=>{await sb.auth.signOut();admin()};show('RÃ©servations');
}
const toast=(el,m,e)=>{el.insertAdjacentHTML('afterbegin',`<p class="msg${e?' err':''}">${esc(m)}</p>`);setTimeout(()=>el.firstElementChild?.remove(),3000)};
async function tBook(el){const {data=[]}=await sb.from('bookings').select('*,slots(starts_at,duration_min)').order('created_at',{ascending:false});
 el.innerHTML=`<div class="tw"><table><tr><th>CrÃ©neau</th><th>Client</th><th>Prestation</th><th>Statut</th><th>Paiement</th></tr>${data.map(b=>`<tr><td>${b.slots?fmt(b.slots.starts_at):'-'}</td><td>${esc(b.first_name)} ${esc(b.last_name)}<br>${esc(b.email)} ${esc(b.phone||'')}${b.is_minor?`<br><em>Mineur Â· resp. : ${esc(b.guardian_name)} ${esc(b.guardian_email)}</em>`:''}${b.note?`<br>â€œ${esc(b.note)}â€`:''}</td><td>${SV[b.service]?.name} Â· ${b.participants} pers. Â· ${eur(b.amount_cents||0)}</td><td><select data-id="${b.id}" data-f="status">${opts(ST,STL,b.status)}</select></td><td><select data-id="${b.id}" data-f="payment_status">${opts(PS,PSL,b.payment_status)}</select></td></tr>`).join('')||'<tr><td colspan=5>Aucune rÃ©servation.</td></tr>'}</table></div><p class="note">Suivi interne uniquement : ce nâ€™est pas une comptabilitÃ© officielle.</p>`;
 el.querySelectorAll('select').forEach(s=>s.onchange=async()=>{const {error}=await sb.from('bookings').update({[s.dataset.f]:s.value}).eq('id',s.dataset.id);toast(el,error?error.message:'EnregistrÃ©',!!error)})}
async function tSlots(el){const {data=[]}=await sb.from('slots').select('*').order('starts_at');
 el.innerHTML=`<form id="sf"><label>Type<select name="service">${Object.entries(SV).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join('')}</select></label><label>DÃ©but<input name="at" type="datetime-local" required></label><label>DurÃ©e (min)<input name="d" type="number" value="60" min="15" step="5"></label><label>Places (max 4)<input name="c" type="number" value="1" min="1" max="4"></label><button class="btn">CrÃ©er le crÃ©neau</button></form>
 <div class="tw"><table>${data.map(s=>`<tr><td>${fmt(s.starts_at)}</td><td>${SV[s.service].name}</td><td>${s.duration_min} min Â· ${s.capacity} pl.</td><td>${s.status==='open'?'Ouvert':'FermÃ©'}</td><td><button data-t="${s.id}" data-s="${s.status}">${s.status==='open'?'Fermer':'Ouvrir'}</button> <button data-x="${s.id}">Supprimer</button></td></tr>`).join('')}</table></div>`;
 $('#sf').onsubmit=async e=>{e.preventDefault();const f=e.target;const {error}=await sb.from('slots').insert({service:f.service.value,starts_at:new Date(f.at.value).toISOString(),duration_min:+f.d.value,capacity:+f.c.value});error?toast(el,error.message,1):tSlots(el)};
 el.querySelectorAll('[data-t]').forEach(b=>b.onclick=async()=>{await sb.from('slots').update({status:b.dataset.s==='open'?'closed':'open'}).eq('id',b.dataset.t);tSlots(el)});
 el.querySelectorAll('[data-x]').forEach(b=>b.onclick=async()=>{const {error}=await sb.from('slots').delete().eq('id',b.dataset.x);error?toast(el,'Suppression impossible (rÃ©servations liÃ©es) : fermez le crÃ©neau.',1):tSlots(el)})}
async function tOffers(el){const {data=[]}=await sb.from('offers').select('*').order('service').order('sort');
 el.innerHTML=`<div class="tw"><table><tr><th>Type</th><th>LibellÃ©</th><th>DÃ©tail</th><th>Prix total (â‚¬)</th><th>Participants</th><th>Actif</th><th></th></tr>${data.map(o=>`<tr data-id="${o.id}"><td>${SV[o.service].name}</td><td><input value="${esc(o.label)}" data-f="label"></td><td><input value="${esc(o.detail||'')}" data-f="detail"></td><td><input type="number" step="0.5" value="${o.price_cents/100}" data-f="price"></td><td><input type="number" min="1" max="4" value="${o.participants}" data-f="participants"></td><td><input type="checkbox" ${o.active?'checked':''} data-f="active"></td><td><button>Enregistrer</button></td></tr>`).join('')}</table></div>
 <button class="btn" id="add">Ajouter une offre</button>`;
 el.querySelectorAll('tr[data-id] button').forEach(b=>b.onclick=async()=>{const r=b.closest('tr'),g=f=>r.querySelector(`[data-f=${f}]`);const {error}=await sb.from('offers').update({label:g('label').value,detail:g('detail').value,price_cents:Math.round(g('price').value*100),participants:+g('participants').value,active:g('active').checked}).eq('id',r.dataset.id);toast(el,error?error.message:'EnregistrÃ©',!!error)});
 $('#add').onclick=async()=>{const s=prompt('Type : physique, mentale ou basket ?');if(!SV[s])return;await sb.from('offers').insert({service:s,label:'Nouvelle offre',price_cents:0});tOffers(el)}}
async function tContent(el){const {data=[]}=await sb.from('site_content').select('*');const cur={...C};data.forEach(r=>cur[r.key]=r.value);
 const clubHeadings={'clubs.intro':'<h2 class="content-group-title">Clubs et Entreprises â€” introduction</h2>','clubs.players':'<h2 class="content-group-title">Club sportif</h2>','clubs.companies':'<h2 class="content-group-title">Entreprise</h2>','clubs.frequency':'<h2 class="content-group-title">ModalitÃ©s et tarifs</h2>'};
 const contentLabels={'clubs.intro':'Introduction commune','clubs.players':'Joueurs et joueuses','clubs.staff':'Staffs et entraÃ®neurs','clubs.companies':'Interventions en entreprise','clubs.frequency':'FrÃ©quence des interventions','clubs.duration':'DurÃ©e dâ€™une intervention','clubs.pricing':'Tarification'};
 el.innerHTML=`<form style="max-width:760px">${Object.keys(C).map(k=>`${clubHeadings[k]||''}<label>${contentLabels[k]||k}<textarea name="${k}" rows="${cur[k].length>120?4:1}">${esc(cur[k])}</textarea></label>`).join('')}<button class="btn">Enregistrer les contenus</button></form><p class="note">Les passages entre crochets [ ] sâ€™affichent comme Â« Ã  complÃ©ter Â» sur le site.</p>`;
 el.querySelector('form').onsubmit=async e=>{e.preventDefault();const rows=Object.keys(C).map(k=>({key:k,value:e.target[k].value}));const {error}=await sb.from('site_content').upsert(rows);toast(el,error?error.message:'Contenus enregistrÃ©s',!!error)}}
async function tReviews(el){
 const {data,error}=await sb.from('site_content').select('value').eq('key','reviews.data').maybeSingle();
 const items=parseReviews(data?.value);
 el.innerHTML=`<div class="admin-reviews"><h2>Ajouter un avis</h2><p class="note">Les avis enregistrÃ©s ici apparaissent publiquement sur la page dâ€™accueil.</p><form id="review-form"><label>Commentaire<textarea name="text" rows="4" maxlength="1500" required placeholder="Saisir le commentaire"></textarea></label><label>PrÃ©nom ou nom affichÃ© (facultatif)<input name="name" maxlength="80" placeholder="Ex. Camille"></label><button class="btn" type="submit">Ajouter lâ€™avis</button></form><h2>Avis publiÃ©s (${items.length})</h2><div class="admin-review-list">${items.map((r,i)=>`<article class="box"><p>Â« ${esc(r.text)} Â»</p>${r.name?`<p><strong>${esc(r.name)}</strong></p>`:''}<button type="button" class="btn alt" data-delete-review="${i}">Supprimer</button></article>`).join('')||'<p>Aucun avis publiÃ© pour le moment.</p>'}</div></div>`;
 if(error)toast(el,`Chargement des avis impossible : ${error.message}`,true);
 const save=async next=>{const {error:saveError}=await sb.from('site_content').upsert({key:'reviews.data',value:JSON.stringify(next)});if(saveError){toast(el,saveError.message,true);return false}reviews=next;return true};
 el.querySelector('#review-form').onsubmit=async e=>{e.preventDefault();const form=e.currentTarget,submit=form.querySelector('button[type="submit"]'),text=form.elements.namedItem('text').value.trim(),name=form.elements.namedItem('name').value.trim();if(!text)return;const next=[...items,{text,name}];submit.disabled=true;if(await save(next))tReviews(el);else submit.disabled=false};
 el.querySelectorAll('[data-delete-review]').forEach(button=>button.onclick=async()=>{const next=items.filter((_,i)=>i!==Number(button.dataset.deleteReview));if(await save(next))tReviews(el)});
}
// ---------- Routeur ----------
let revealObserver;
const rv=()=>{
 if(revealObserver)revealObserver.disconnect();
 const items=document.querySelectorAll('#app .rv');
 if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches){items.forEach(x=>x.classList.add('on'));return}
 revealObserver=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');revealObserver.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -30px 0px'});
 items.forEach(x=>revealObserver.observe(x))
};

// Le fond accompagne doucement le dÃ©filement, sans animation lourde ni effet de curseur.
let moodFrame=0;
const syncScrollMood=()=>{
 if(moodFrame)return;
 moodFrame=requestAnimationFrame(()=>{
  const maxScroll=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  const progress=Math.min(1,Math.max(0,scrollY/maxScroll));
  const drift=progress*8;
  document.documentElement.style.setProperty('--scroll-x',`${46+drift}%`);
  document.documentElement.style.setProperty('--scroll-y',`${46+drift}%`);
  moodFrame=0;
 });
};
addEventListener('scroll',syncScrollMood,{passive:true});
addEventListener('resize',syncScrollMood);

async function route(preserveScroll=false){
 const currentScroll=scrollY;
 const [p,anchor]=location.hash.replace(/^#\/?/,'').split('#');const key=p||'home';
 document.body.dataset.t=key==='admin'?'admin':SV[key]?key:(key==='clubs'?'clubs':'home');$('#nav').classList.remove('open');
 if(key==='admin')await admin();
 else{$('#app').innerHTML=SV[key]?pages.service(key):(pages[{'a-propos':'about'}[key]||key]||pages.home)();if(SV[key])booking(key);if(key==='home')setupReviews();if(key==='clubs')setupClubTabs();if(key==='a-propos')setupTimeline()}
 if(key==='home'){const hero=$('#app .hero');if(hero)requestAnimationFrame(()=>requestAnimationFrame(()=>hero.classList.add('home-enter')))}
 foot();rv();if(anchor)document.getElementById(anchor)?.scrollIntoView();else scrollTo(0,preserveScroll?currentScroll:0);syncScrollMood();
}
document.addEventListener('click',e=>{const a=e.target.closest('[data-resa]');if(a){const key=location.hash.match(/#\/(physique|mentale|basket)/)?.[1];if(key){e.preventDefault();document.getElementById('resa')?.scrollIntoView()}}});
$('.burger').onclick=e=>{const n=$('#nav');n.classList.toggle('open');e.target.setAttribute('aria-expanded',n.classList.contains('open'))};
if(!live)$('#banner').innerHTML='<div class="warn">Mode aperÃ§u : Supabase nâ€™est pas connectÃ©. Les contenus affichÃ©s sont ceux par dÃ©faut et les rÃ©servations sont dÃ©sactivÃ©es.</div>';
addEventListener('hashchange',route);
// Affiche le site tout de suite, mÃªme si Supabase rÃ©pond lentement.
route();
loadData().then(()=>route(true));
