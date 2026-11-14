import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
import {renderFollowupAdmin} from './followup.js?v=20261113-followup-v5';

document.body.classList.remove('is-ready');

const watermark=document.createElement('div');
watermark.className='site-watermark';
watermark.setAttribute('aria-hidden','true');
watermark.innerHTML='<svg viewBox="0 0 1000 1000" focusable="false"><circle cx="500" cy="500" r="410" fill="none" stroke="currentColor" stroke-width="14"/><text class="watermark-monogram" x="500" y="545" text-anchor="middle">BY</text><text class="watermark-name" x="500" y="690" text-anchor="middle">BET ON YOU</text></svg>';
document.body.prepend(watermark);

const cfg=window.SITE_CONFIG||{}, live=!!(cfg.supabaseUrl&&cfg.supabaseAnonKey);
const sb=live?createClient(cfg.supabaseUrl,cfg.supabaseAnonKey):null;
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tbd=s=>esc(s).replace(/\[[^\]]+\]/g,m=>`<mark class="tbd">${m}</mark>`);
const rich=s=>String(s??'').split(/\n\n+/).map(p=>`<p style="margin:0 auto 1.35em;line-height:1.75">${tbd(p).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')}</p>`).join('');
const eur=c=>(c/100).toLocaleString('fr-FR',{style:'currency',currency:'EUR',minimumFractionDigits:c%100?2:0});
const fmt=d=>new Date(d).toLocaleString('fr-FR',{weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Paris'});
const DUR='Séance de référence : 1 h 15 de séance effective, suivie d’un débriefing et de conseils.';
const TBC='[À compléter]';

const C={
'brand':'[Nom de l’activité à définir]',
'home.title':'Préparer le corps, l’esprit et le geste.',
'home.lead':'Tu veux miser sur toi ? Je t’accompagne en préparation physique, mentale, en nutrition et en coaching basket. Clubs et entreprises : des formations et interventions sur mesure autour de la performance, de la cohésion et du bien-être.',
'home.about':'Je termine un Master EOPS à l’Université de Lille, en alternance au sein du club de la Patriote de Templeuve. J’y entraîne les U18F Région et j’assiste les U18 France. J’interviens aussi à l’école de basket.\n\n[Phrase personnelle sur ma façon d’accompagner à rédiger]',
'phys.intro':'Un travail physique structuré, pensé pour le sport pratiqué et le profil de chaque athlète.',
'phys.vision':'Le contenu est construit selon le niveau, le sport pratiqué, les objectifs et les contraintes de chacun. La progression vise des qualités utiles et transférables à la pratique.',
'phys.needs':'Force, puissance, vitesse, mobilité, condition physique, prévention et reprise progressive peuvent être travaillées selon les priorités définies ensemble.',
'phys.testing':'Des observations et des tests simples permettent de faire le point sur la mobilité, les appuis, la force fonctionnelle ou les capacités d’effort. Les résultats servent à orienter le travail, pas à poser un diagnostic médical.',
'phys.nutrition':'Des repères simples autour de l’alimentation et de l’hydratation peuvent compléter l’accompagnement physique, dans le respect du cadre de compétence et des besoins de la personne.',
'ment.intro':'Un accompagnement individuel pour travailler la confiance, la concentration et la gestion de la pression.',
'ment.vision':'Le travail part du vécu et des situations concrètes. On choisit des objectifs observables, puis on teste des outils adaptés à la personne et à sa pratique.',
'ment.goals':'Les objectifs peuvent concerner la confiance, la concentration, la motivation, la gestion des émotions ou la préparation à une échéance. Le contenu évolue avec les retours de séance et les essais sur le terrain.',
'ment.format':'Les séances sont individuelles et s’adaptent au rythme, aux objectifs et aux contraintes de la personne. Chaque séance se termine par des repères à réinvestir dans la pratique.',
'bask.intro':'Du joueur débutant à celle ou celui qui vise une progression importante, par exemple une entrée au CREPS : un coaching adapté au niveau, aux objectifs et au profil.',
'bask.fund':'Travail des fondamentaux individuels : appuis, maniement, passe, finition, tir et lecture du jeu. Les contenus sont adaptés au poste, au niveau et aux situations rencontrées.',
'bask.shoot':'Le travail du tir associe repères techniques, répétitions de qualité et prises d’information. Les exercices évoluent progressivement vers des situations proches du jeu.',
'bask.levels':'Chaque séance s’adapte au niveau, aux objectifs et au profil du joueur ou de la joueuse.',
'bask.groups':'Les petits groupes sont limités à 4 personnes. Le tarif par personne diminue avec la taille du groupe, et le groupe se réserve ensemble.',
'clubs.intro':'Des interventions adaptées aux clubs sportifs, quel que soit le sport, et aux entreprises : préparation physique et mentale, formation des staffs, cohésion d’équipe et bien-être.',
'clubs.players':'Un accompagnement en préparation physique et mentale, construit selon les besoins des joueurs et joueuses, leur discipline et les objectifs du club.',
'clubs.staff':'Des formations et temps d’échange pour les entraîneurs et les staffs : mieux comprendre les principes de préparation physique et mentale, puis les intégrer dans leur pratique.',
'clubs.companies':'Des ateliers autour de la cohésion d’équipe, du bien-être et de l’activité physique, adaptés aux besoins de votre entreprise.',
'clubs.frequency':'Les interventions peuvent être ponctuelles ou s’inscrire dans un accompagnement mensuel, sur un semestre ou sur une année.',
'clubs.duration':'La durée de chaque intervention s’adapte à votre besoin : d’une heure à une demi-journée.',
'clubs.pricing':'Le tarif varie selon le contenu, la durée et le public concerné. Une proposition personnalisée est établie après échange sur votre mission.',
'loyalty':'Des avantages fidélité peuvent être proposés aux clients réguliers. Ils ne se cumulent pas automatiquement avec les tarifs de groupe ou les packs.',
'about.text':'Je suis en deuxième année de Master EOPS à l’Université de Lille, en alternance à la Patriote de Templeuve : coach principal des U18F Région, assistant auprès des U18 France, et intervenant à l’école de basket.\n\nFormations : Brevet fédéral jeune en basket ; DETB en cours (trois évaluations sur quatre validées, diplôme non encore obtenu) ; AUEC en réathlétisation du sportif.\n\n[Texte de présentation personnelle à compléter]',
'contact.email':'[E-mail à compléter]',
'contact.phone':'[Téléphone à compléter]',
'contact.zone':'[Adresse et zones d’intervention à compléter]',
'contact.social':'[Liens réseaux sociaux à compléter]',
'pay.text':'[Modalités de paiement, d’annulation et de remboursement à définir]',
'legal.text':'[Éditeur : nom, statut, SIRET, adresse, contact à compléter]\n\nHébergeur : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.\n\n[Autres mentions légales à compléter]',
'privacy.text':'Les données saisies lors d’une réservation (identité, e-mail, téléphone, message) servent uniquement à traiter la réservation et à vous contacter. Pour un participant mineur, les coordonnées du représentant légal sont demandées. Les données sont stockées chez Supabase.\n\n[Responsable du traitement, durée de conservation, droits d’accès et de suppression, contact à compléter]',
'faq.1.q':'Comment réserver ?',
'faq.1.a':'Choisissez un créneau ouvert sur la page de l’accompagnement, puis renseignez vos informations. [Processus de confirmation à préciser]',
'faq.2.q':'Quelle est la durée d’une séance ?',
'faq.2.a':DUR,
'faq.3.q':'Quelles sont les modalités d’annulation et de paiement ?',
'faq.3.a':'[À compléter]',
'faq.4.q':'Les mineurs peuvent-ils réserver ?',
'faq.4.a':'Oui, avec les coordonnées du représentant légal, demandées lors de la réservation.',
'video.url':''
};

const DEF_OFFERS=[
['physique','Séance à l’unité','',5000],
['physique','Pack de 5 séances','soit 45 € par séance',22500],
['physique','Pack de 10 séances','soit 40 € par séance',40000],
['mentale','Séance à l’unité','Séance individuelle',5000],
['mentale','Pack de 5 séances','soit 40 € par séance',20000],
['basket','1 personne','30 € par personne',3000],
['basket','2 personnes','25 € par personne',5000],
['basket','3 personnes','20 € par personne',6000],
['basket','4 personnes','17 € par personne',6800,true]
].map(([service,label,detail,price_cents,tbc])=>({service,label,detail,price_cents,tbc}));

const SV={
mentale:{name:'Préparation mentale',k:'ment',h:'Préparation mentale',secs:[['Vision et méthodologie','vision'],['Objectifs et déroulement','goals'],['Individuel','format']]},
basket:{name:'Coaching individuel basket',k:'bask',h:'Coaching individuel <span>basket</span>',secs:[['Les fondamentaux','fund'],['Technique et gestuelle de tir','shoot'],['Un suivi adapté','levels'],['Petits groupes (4 max.)','groups']]},
physique:{name:'Préparation physique',k:'phys',h:'Préparation <span>physique</span>',secs:[['Vision et méthodologie','vision'],['Besoins et objectifs','needs'],['Évaluation et testing','testing'],['Nutrition','nutrition']]}};

const TIMELINE=[
 {year:'2026–2027',tone:'clubs',chapter:'Master 2 et nouvelles missions',events:[
  {label:'FORMATION',title:'Master 2 EOPS',detail:'Optimisation de la performance sportive — en cours'},
  {label:'ENCADREMENT',title:'U18 France et U18 Région R1',detail:'Assistant U18 France et entraîneur U18 Région R1 à la Patriote de Templeuve'},
  {label:'COACHING EN CLUB',title:'École de basket',detail:'Coaching au sein de mon club, la Patriote de Templeuve'},
  {label:'COACHING INDIVIDUEL',title:'Basket individuel',detail:'Accompagnement individuel des joueuses et joueurs'},
  {label:'PRÉPARATION PHYSIQUE',title:'Préparation physique',detail:'Accompagnement adapté aux besoins et aux objectifs'},
  {label:'PRÉPARATION MENTALE',title:'Préparation mentale',detail:'Accompagnement adapté aux besoins et aux objectifs'},
  {label:'NUTRITION',title:'Nutrition et hydratation',detail:'Conseils en nutrition du sportif et hydratation de l’effort'}
 ]},
 {year:'2025–2026',tone:'basket',chapter:'Master 1 et nouvelles responsabilités',events:[
  {label:'FORMATION',title:'Master 1 EOPS obtenu',detail:'Optimisation de la performance sportive — Université de Lille'},
  {label:'ENCADREMENT',title:'U18 France et U18 Région R1',detail:'Assistant U18 France et entraîneur U18 Région R1 à la Patriote de Templeuve'},
  {label:'COACHING INDIVIDUEL',title:'Basket individuel',detail:'Accompagnement individuel des joueuses et joueurs'},
  {label:'PRÉPARATION PHYSIQUE',title:'Préparation physique',detail:'Accompagnement adapté aux besoins et aux objectifs'},
  {label:'PRÉPARATION MENTALE',title:'Préparation mentale',detail:'Accompagnement adapté aux besoins et aux objectifs'},
  {label:'SPÉCIALISATION',title:'Réathlétisation du sportif',detail:'Formation AUEC en juin 2026'}
 ]},
 {year:'2024–2025',tone:'physique',chapter:'Une saison qui s’intensifie',events:[
  {label:'ENCADREMENT',title:'U15F et U18F Région',detail:'Entraîneur à Roncq'},
  {label:'SÉLECTION',title:'U11 garçons · Terrien Sud',detail:'Encadrement de la sélection'},
  {label:'UNIVERSITAIRE',title:'Championnat de France universitaire',detail:'Coach de l’équipe de basket de l’Université de Lille'},
  {label:'FORMATION',title:'DETB · 3 modules sur 4',detail:'Modules validés en mai 2025'},
  {label:'DIPLÔME',title:'Licence STAPS · mention Bien',detail:'Diplôme obtenu en juin 2025'},
  {label:'COACHING INDIVIDUEL',title:'Basket individuel',detail:'Accompagnement individuel des joueuses et joueurs'}
 ]},
 {year:'2023–2024',tone:'clubs',chapter:'Premières expériences régionales',events:[
  {label:'ENCADREMENT',title:'U15 filles Région',detail:'Entraîneur à Roncq'},
  {label:'SÉLECTION',title:'U11 garçons · Terrien Sud',detail:'Participation à la sélection'}
 ]},
 {year:'2022–2023',tone:'basket',chapter:'Les débuts sur le terrain',events:[
  {label:'COACHING',title:'Première saison à Roncq',detail:'Coaching de l’équipe U13 garçons'},
  {label:'FORMATION',title:'Brevet fédéral adulte',detail:'Validation du brevet fédéral de basket adulte'}
 ]},
 {year:'Juin 2021',tone:'mentale',chapter:'Un premier diplôme',events:[
  {label:'DIPLÔME',title:'Baccalauréat scientifique',detail:'Obtention du bac scientifique'}
 ]},
 {year:'2020',tone:'physique',chapter:'Les premiers repères',events:[
  {label:'FORMATION',title:'BAFA',detail:'Perfectionnement assistant sanitaire'},
  {label:'SECOURISME',title:'PSC1',detail:'Premiers gestes de secours'}
 ]}
];

let content={...C}, offers=DEF_OFFERS, reviews=[], photos={}, user=null;
const unfinishedKeys=new Set(['phys.vision','phys.needs','phys.testing','phys.nutrition','ment.vision','ment.goals','ment.format','bask.fund','bask.shoot']);
const t=k=>{const value=content[k]??C[k]??'';return unfinishedKeys.has(k)&&/^\s*\[[^\]]+\]\s*$/.test(value)?(C[k]??''):value};

const CONTENT_BLOCKS={
 'ment.benefits':[
  {title:'Mieux gérer la pression',text:'Repérer ce qui déclenche la pression et préparer des réponses utiles avant, pendant et après l’épreuve.'},
  {title:'Renforcer la confiance',text:'S’appuyer sur ses réussites, ses ressources et des repères concrets pour agir avec plus d’assurance.'},
  {title:'Rester concentré',text:'Identifier les informations importantes et revenir à la tâche après une distraction ou une erreur.'},
  {title:'Réguler ses émotions',text:'Mieux comprendre ses réactions et choisir des stratégies adaptées à la situation vécue.'},
  {title:'Se fixer des objectifs',text:'Transformer une intention en objectifs de résultat, de performance et surtout de processus.'},
  {title:'Gagner en autonomie',text:'Tester des outils, comprendre leur intérêt et apprendre à les réutiliser dans sa pratique.'}
 ],
 'ment.steps':[
  {title:'Échanger',text:'Faire le point sur le vécu, les attentes, les objectifs et les situations rencontrées.'},
  {title:'Évaluer',text:'Repérer les ressources, les besoins et les habitudes déjà mobilisées.'},
  {title:'S’entraîner',text:'Choisir des outils adaptés et les travailler progressivement en séance puis dans la pratique.'},
  {title:'Ajuster',text:'Faire le bilan des essais, observer ce qui aide et adapter la suite du suivi.'}
 ],
 'ment.tools':[
  {title:'Respiration et relaxation',text:'Explorer des repères respiratoires confortables et des exercices de relâchement adaptés.'},
  {title:'Imagerie mentale',text:'Répéter mentalement une action ou une situation en mobilisant les sensations pertinentes.'},
  {title:'Dialogue interne',text:'Repérer les pensées utiles ou limitantes et construire des mots-clés personnels.'},
  {title:'Objectifs et routines',text:'Définir des actions maîtrisables et organiser des repères avant ou pendant la performance.'},
  {title:'Attention et concentration',text:'Choisir un point d’attention, gérer les distractions et entraîner le retour à la tâche.'},
  {title:'Méditation de pleine conscience',text:'Observer pensées et sensations sans jugement, puis replacer volontairement son attention.'}
 ],
 'bask.fundamentals':[
  {title:'Appuis et équilibre',text:'Gagner en stabilité, démarrer efficacement et changer de direction avec maîtrise.'},
  {title:'Maniement de balle',text:'Développer la dextérité et garder le contrôle du ballon sous différentes contraintes.'},
  {title:'Passe et réception',text:'Améliorer la précision, le timing et l’enchaînement avec le déplacement.'},
  {title:'Finition',text:'Varier les finitions près du cercle et choisir une réponse adaptée à la défense.'},
  {title:'Tir',text:'Construire une gestuelle régulière et travailler la prise d’information avant le tir.'},
  {title:'Lecture du jeu',text:'Lire les espaces, les partenaires et les défenseurs pour décider plus vite.'}
 ],
 'bask.steps':[
  {title:'Observer',text:'Faire le point sur le niveau, les habitudes et les objectifs du joueur ou de la joueuse.'},
  {title:'Choisir un axe',text:'Définir une priorité technique ou décisionnelle adaptée à la séance.'},
  {title:'Répéter et varier',text:'Travailler le geste puis le replacer dans des situations qui évoluent.'},
  {title:'Transférer',text:'Relier le travail individuel aux situations rencontrées en entraînement et en match.'}
 ],
 'phys.axes':[
  {title:'Force',text:'Développer la capacité à produire et contrôler de la force selon le niveau et la pratique.'},
  {title:'Puissance',text:'Travailler la production rapide de force avec des exercices adaptés et une progression maîtrisée.'},
  {title:'Vitesse et changements de direction',text:'Améliorer les premiers appuis, les accélérations, les freinages et les relances.'},
  {title:'Mobilité',text:'Entretenir les amplitudes utiles à la pratique et à la qualité des mouvements.'},
  {title:'Condition physique',text:'Construire des capacités d’effort cohérentes avec les exigences du sport ou du quotidien.'},
  {title:'Prévention et reprise',text:'Renforcer progressivement les capacités nécessaires à une pratique durable et à une reprise adaptée.'}
 ],
 'phys.steps':[
  {title:'Échanger',text:'Préciser la pratique, les objectifs, les contraintes et l’expérience de la personne.'},
  {title:'Faire le point',text:'Observer les mouvements et utiliser des tests simples, choisis selon le besoin.'},
  {title:'Construire',text:'Organiser un programme progressif avec des consignes et des repères compréhensibles.'},
  {title:'Suivre',text:'Faire évoluer le travail selon les sensations, les progrès et les contraintes de la pratique.'}
 ]
};
const SERVICE_BLOCK_SECTIONS={
 mentale:[['Ce que la préparation mentale peut vous apporter','ment.benefits','cards'],['Un accompagnement en quatre étapes','ment.steps','steps'],['Des outils concrets, choisis avec vous','ment.tools','cards']],
 basket:[['Les fondamentaux individuels','bask.fundamentals','cards'],['Une progression en quatre temps','bask.steps','steps']],
 physique:[['Les qualités physiques travaillées','phys.axes','cards'],['Une démarche adaptée à votre profil','phys.steps','steps']]
};
const PHOTO_SLOTS=[
 {id:'home.profile',label:'Portrait de présentation',alt:'Portrait de Julien'},
 {id:'home.mentale',label:'Préparation mentale',alt:'Préparation mentale'},
 {id:'home.basket',label:'Coaching individuel basket',alt:'Coaching individuel de basket'},
 {id:'home.physique',label:'Préparation physique',alt:'Préparation physique'},
 {id:'home.clubs',label:'Clubs et entreprises',alt:'Intervention auprès d’un club ou d’une entreprise'}
];
function contentBlocks(key){try{const parsed=JSON.parse(content[key]||'');return Array.isArray(parsed)?parsed:CONTENT_BLOCKS[key]}catch{return CONTENT_BLOCKS[key]||[]}}
function photoSettings(slot){const read=(name,fallback)=>{const n=Number(content[`photo.${slot}.${name}`]);return Number.isFinite(n)?n:fallback};return{x:read('x',50),y:read('y',50),zoom:read('zoom',100),alt:content[`photo.${slot}.alt`]||PHOTO_SLOTS.find(p=>p.id===slot)?.alt||''}}
function photoMarkup(slot,label){const item=photos[slot],cfg=photoSettings(slot);return item?.url?`<img src="${esc(item.url)}" alt="${esc(cfg.alt||label)}" loading="lazy" style="object-position:${cfg.x}% ${cfg.y}%;transform:scale(${cfg.zoom/100})">`:`<div class="photo-placeholder" aria-label="Emplacement photo"><span>${esc(label)}</span></div>`}
function blockCards(key,kind='cards'){const list=contentBlocks(key);return `<div class="service-cards ${kind==='steps'?'service-steps':''}">${list.map((item,i)=>`<article class="service-card"><span class="service-card-index">${String(i+1).padStart(2,'0')}</span><h3>${esc(item.title||'')}</h3><p>${esc(item.text||'')}</p></article>`).join('')}</div>`}

function parseReviews(value){
 try{
  const parsed=Array.isArray(value)?value:JSON.parse(value||'[]');
  return Array.isArray(parsed)?parsed.filter(r=>r&&typeof r.text==='string'&&r.text.trim()).map(r=>({text:r.text.trim(),name:typeof r.name==='string'?r.name.trim():''})):[];
 }catch{return []}
}

async function loadData(){
 if(!live)return;
 try{
  const [c,o,m]=await Promise.all([
   sb.from('site_content').select('*'),
   sb.from('offers').select('*').eq('active',true).order('sort'),
   sb.from('media').select('*').order('sort')
  ]);
  (c.data||[]).forEach(r=>{
   if(r.key==='reviews.data')reviews=parseReviews(r.value);
   else content[r.key]=r.value
  });
  if(o.data?.length)offers=o.data;
  photos={};(m.data||[]).forEach(item=>{if(item.caption?.startsWith('photo.home.'))photos[item.caption.slice(6)]=item});
 }catch(e){
  console.error(e)
 }
}

const foot=()=>{
 $('#foot').innerHTML=`<p><strong>${tbd(t('brand'))}</strong></p><p><a href="#/faq">FAQ</a><a href="#/mentions">Mentions légales</a><a href="#/confidentialite">Confidentialité</a></p>`;
 $('#brand').innerHTML=tbd(t('brand'))
};

const video=()=>{
 const u=t('video.url');
 let inner='<mark class="tbd">[Vidéo de présentation à ajouter]</mark>';
 const y=u.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
 if(y)inner=`<iframe src="https://www.youtube-nocookie.com/embed/${y[1]}" allowfullscreen title="Vidéo de présentation"></iframe>`;
 else if(/^https:\/\/.+\.(mp4|webm)/.test(u))inner=`<video controls src="${esc(u)}"></video>`;
 return `<section class="wrap rv" style="padding-top:clamp(2rem,4vw,3rem)"><h2>Vidéo de présentation</h2><div class="vid">${inner}</div></section>`
};

const contactBlock=()=>`<div class="box"><p>${tbd(t('contact.email'))}</p><p>${tbd(t('contact.phone'))}</p><p>${tbd(t('contact.zone'))}</p><p>${tbd(t('contact.social'))}</p></div>`;

const reviewsSection=()=>`<section class="wrap rv reviews-section" aria-labelledby="reviews-title"><div class="reviews-heading"><h2 id="reviews-title">Vos avis</h2><p>Les retours d’expérience des personnes accompagnées.</p></div>${reviews.length?`<div class="reviews-carousel" data-reviews-carousel><article class="review-bubble" aria-live="polite"><blockquote><p data-review-text></p><cite data-review-name></cite></blockquote></article><div class="review-controls"><button type="button" data-review-prev aria-label="Avis précédent">←</button><span data-review-count aria-live="polite"></span><button type="button" data-review-next aria-label="Avis suivant">→</button></div></div>`:`<p class="reviews-empty">Les premiers avis seront affichés ici.</p>`}</section>`;

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
 const carousel=$('[data-reviews-carousel]');
 if(!carousel||!reviews.length)return;
 let index=0;
 const quote=carousel.querySelector('[data-review-text]');
 const name=carousel.querySelector('[data-review-name]');
 const count=carousel.querySelector('[data-review-count]');
 const show=()=>{
  const review=reviews[index];
  quote.textContent=`« ${review.text} »`;
  name.textContent=review.name;
  name.hidden=!review.name;
  count.textContent=`${index+1} / ${reviews.length}`
 };
 carousel.querySelector('[data-review-prev]').onclick=()=>{
  index=(index-1+reviews.length)%reviews.length;
  show()
 };
 carousel.querySelector('[data-review-next]').onclick=()=>{
  index=(index+1)%reviews.length;
  show()
 };
 show()
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
   timeline.style.setProperty('--timeline-progress',String(progress))
  }
  timelineFrame=0
 })
}
function setupTimeline(){updateTimelineProgress()}
addEventListener('scroll',updateTimelineProgress,{passive:true});
addEventListener('resize',updateTimelineProgress);

const pages={
home(){
 const homeTitle=esc(t('home.title')).replace(/(Investir sur soi-même)/i,'<span class="home-title-break">$1</span>');
 const homeLead=esc(t('home.lead').replace(/\s+(Clubs et entreprises\s*:)/i,'\n\n$1'));
 const tiles=[
  {id:'mentale',title:'Préparation mentale',desc:t('ment.intro'),tone:'mentale'},
  {id:'basket',title:'Coaching individuel basket',desc:t('bask.intro'),tone:'basket'},
  {id:'physique',title:'Préparation physique',desc:t('phys.intro'),tone:'physique'},
  {id:'clubs',title:'Clubs et Entreprises',desc:t('clubs.intro'),tone:'clubs'}
 ];
 return `<section class="hero home-hero wrap"><div class="home-hero-copy"><h1>${homeTitle}</h1><p>${homeLead}</p><div class="row"><a class="btn alt" style="color:var(--ink)" href="#/physique#resa" data-resa>Réserver un créneau</a></div></div><figure class="home-portrait">${photoMarkup('home.profile','Portrait à ajouter')}</figure></section>
<section class="home-services wrap" aria-labelledby="home-services-title"><header class="home-services-heading"><span class="eyebrow">BET ON YOU</span><h2 id="home-services-title">Un accompagnement construit autour de votre pratique</h2></header>${tiles.map((item,index)=>`<article class="home-service-row ${index%2?'is-reversed':''} tone-${item.tone} rv"><a class="home-service-copy" href="#/${item.id}"><span class="home-service-kicker">0${index+1} · ${esc(item.title)}</span><h3>${esc(item.title)}</h3><p>${esc(item.desc)}</p><span class="home-service-link">Découvrir <b aria-hidden="true">↗</b></span></a><a class="home-service-photo" href="#/${item.id}" aria-label="Découvrir : ${esc(item.title)}">${photoMarkup(`home.${item.id}`,`Photo à ajouter — ${item.title}`)}</a></article>`).join('')}</section>
<section class="wrap rv" style="padding-bottom:clamp(3rem,5vw,4rem)"><h2>Au fait, c’est qui Julien ?</h2>${rich(t('home.about'))}<a class="btn" href="#/a-propos">Mon parcours</a></section>${reviewsSection()}
<section class="wrap rv"><h2>Contact</h2>${contactBlock()}</section>`
},
service(id){
 const s=SV[id],o=offers.filter(x=>x.service===id);
 const blocks=SERVICE_BLOCK_SECTIONS[id]||[];
 const leadKey=id==='mentale'?'ment.vision':id==='physique'?'phys.vision':'bask.fund';
 const supporting=id==='mentale'?[['Un accompagnement individuel','ment.format']]:id==='physique'?[['Évaluation et testing','phys.testing'],['Nutrition et récupération','phys.nutrition']]:[['Travail du tir','bask.shoot'],['Un suivi adapté','bask.levels'],['Séances en petit groupe','bask.groups']];
 return `<div class="shero rv"><div class="wrap"><h1>${s.h}</h1><p>${esc(t(s.k+'.intro'))}</p><a class="btn" style="background:var(--a)" href="#/${id}#resa" data-resa>Réserver un créneau</a></div></div>
<div class="wrap service-page"><section class="service-intro rv"><span class="eyebrow">${esc(s.name)}</span><h2>${id==='mentale'?'Une préparation qui part de votre réalité':id==='basket'?'Un travail individuel, au service du jeu':'Un travail progressif et adapté'}</h2>${rich(t(leadKey))}</section>
${blocks.map(([heading,key,kind])=>`<section class="service-content-section rv"><header><span class="eyebrow">${kind==='steps'?'LA DÉMARCHE':'LES AXES DE TRAVAIL'}</span><h2>${esc(heading)}</h2></header>${blockCards(key,kind)}</section>`).join('')}
${supporting.map(([h,k])=>`<section class="service-note-section rv"><h2>${esc(h)}</h2><div>${rich(t(k))}</div></section>`).join('')}
<section class="rv"><h2>Offres et tarifs</h2><div class="grid">${o.map(x=>`<div class="box"><h3>${esc(x.label)}</h3><div class="price">${eur(x.price_cents)}</div><p>${tbd(x.detail||'')}</p></div>`).join('')}</div>
<p class="note" style="margin-top:1rem">${DUR}</p><p>${esc(t('loyalty'))}</p><p>${tbd(t('pay.text'))}</p></section>
<section id="resa" class="rv"><h2>Réserver un créneau</h2><div id="booking"></div></section></div>`
},
about(){
 return `<div class="shero about-hero rv"><div class="wrap"><h1>Mon parcours</h1></div></div><section class="timeline-section wrap" aria-label="Frise chronologique de mon parcours"><div class="timeline" data-timeline><div class="timeline-rail" aria-hidden="true"></div>${TIMELINE.map((item,index)=>`<article class="timeline-item rv tone-${item.tone} ${index%2?'timeline-left':'timeline-right'}" style="--step:${index}" aria-label="${esc(item.year)} — ${esc(item.chapter)}"><div class="timeline-node" aria-hidden="true"></div><div class="timeline-card"><div class="timeline-card-top"><p class="timeline-year">${esc(item.year)}</p></div><div class="timeline-events">${item.events.map((event,eventIndex)=>`<div class="timeline-event" style="--event-step:${eventIndex}"><div class="timeline-event-copy"><span class="timeline-label">${esc(event.label)}</span><h3>${esc(event.title)}</h3><p>${esc(event.detail)}</p></div></div>`).join('')}</div></div></article>`).join('')}</div></section>`
},
clubs(){
 return `<div class="shero rv"><div class="wrap"><h1>Clubs et Entreprises</h1><p>${esc(t('clubs.intro'))}</p><a class="btn" href="#/contact">Échanger sur votre projet</a></div></div>
<section class="wrap rv clubs-choices"><h2>Choisissez votre accompagnement</h2><div class="clubs-switch" role="tablist" aria-label="Type d’intervention"><button type="button" role="tab" id="clubs-tab-sport" aria-controls="clubs-panel-sport" aria-selected="true" data-club-tab="sport">Club sportif</button><button type="button" role="tab" id="clubs-tab-company" aria-controls="clubs-panel-company" aria-selected="false" data-club-tab="company" tabindex="-1">Entreprise</button></div>
<div class="clubs-panel is-active" role="tabpanel" id="clubs-panel-sport" aria-labelledby="clubs-tab-sport" data-club-panel="sport"><h2>Interventions pour les clubs sportifs</h2><div class="grid"><article class="box"><h3>Joueurs et joueuses</h3>${rich(t('clubs.players'))}</article><article class="box"><h3>Staffs et entraîneurs</h3>${rich(t('clubs.staff'))}</article></div></div>
<div class="clubs-panel" role="tabpanel" id="clubs-panel-company" aria-labelledby="clubs-tab-company" data-club-panel="company" hidden><h2>Interventions en entreprise</h2><div class="grid"><article class="box"><h3>Équipes et collaborateurs</h3>${rich(t('clubs.companies'))}</article></div></div></section>
<section class="wrap rv clubs-offers"><h2>Modalités et tarifs</h2><div class="grid"><article class="box"><h3>Fréquence des interventions</h3>${rich(t('clubs.frequency'))}</article><article class="box"><h3>Durée d’une intervention</h3>${rich(t('clubs.duration'))}</article><article class="box"><h3>Tarification</h3>${rich(t('clubs.pricing'))}</article></div></section>`
},
contact(){
 return `<div class="shero rv"><div class="wrap"><h1>Contact</h1></div></div><div class="wrap"><section class="rv">${contactBlock()}</section></div>`
},
faq(){
 return `<div class="shero rv"><div class="wrap"><h1>FAQ</h1></div></div><div class="wrap"><section class="rv">${[1,2,3,4].map(i=>`<details class="box" style="margin-bottom:.6rem"><summary><strong>${esc(t(`faq.${i}.q`))}</strong></summary>${rich(t(`faq.${i}.a`))}</details>`).join('')}</section></div>`
},
mentions(){
 return `<div class="wrap"><section class="rv"><h1>Mentions légales</h1>${rich(t('legal.text'))}</section></div>`
},
confidentialite(){
 return `<div class="wrap"><section class="rv"><h1>Confidentialité</h1>${rich(t('privacy.text'))}</section></div>`
}
};

function booking(id){
 const box=$('#booking');
 if(!box)return;
 if(!live){
  box.innerHTML='<p class="msg err">Réservation en ligne non connectée : Supabase n’est pas encore configuré (voir README). Aucune réservation ne peut être enregistrée pour le moment.</p>';
  return
 }
 const o=offers.filter(x=>x.service===id&&x.id&&(x.sessions||1)>=1);
 let slot=null;
 box.innerHTML='<p>Chargement des créneaux…</p>';
 sb.rpc('get_open_slots',{p_service:id}).then(({data,error})=>{
  const list=(data||[]).filter(s=>s.remaining>0);
  if(error||!list.length){
   box.innerHTML=`<p>${error?'Créneaux indisponibles pour le moment.':'Aucun créneau ouvert actuellement. Revenez bientôt ou utilisez la page Contact.'}</p>`;
   return
  }
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
  box.querySelectorAll('.slot').forEach(b=>b.onclick=()=>{
   box.querySelectorAll('.slot').forEach(x=>x.setAttribute('aria-pressed','false'));
   b.setAttribute('aria-pressed','true');
   slot=b;
   f.hidden=false;
   [...f.offer.options].forEach(op=>op.disabled=+op.dataset.p>+b.dataset.r);
   f.offer.selectedIndex=[...f.offer.options].findIndex(op=>!op.disabled)
  });
  f.minor.onchange=()=>$('#g').hidden=!f.minor.checked;
  f.onsubmit=async e=>{
   e.preventDefault();
   const r=$('#res');
   const {error}=await sb.rpc('book_slot',{p_slot:slot.dataset.id,p_offer:f.offer.value,p_first:f.first.value,p_last:f.last.value,p_email:f.email.value,p_phone:f.phone.value||null,p_minor:f.minor.checked,p_gname:f.gname.value||null,p_gemail:f.gemail.value||null,p_note:f.note.value||null});
   r.className='msg'+(error?' err':'');
   r.textContent=error?error.message:'Demande enregistrée (en attente de confirmation). Vous serez recontacté.';
   if(!error){f.reset();setTimeout(()=>booking(id),1500)}
  }
 })
}

// ---------- Admin ----------
const ST=['pending','confirmed','cancelled','done'];
const STL={pending:'En attente',confirmed:'Confirmée',cancelled:'Annulée',done:'Réalisée'};
const PS=['unpaid','paid','refunded'];
const PSL={unpaid:'Non payé',paid:'Payé',refunded:'Remboursé'};
const opts=(a,l,v)=>a.map(x=>`<option value="${x}"${x===v?' selected':''}>${l[x]||x}</option>`).join('');

async function admin(){
 const app=$('#app');
 if(!live){
  app.innerHTML='<div class="wrap admin"><section><h1>Espace administrateur</h1><p class="msg err">Supabase n’est pas configuré (config.js).</p></section></div>';
  return
 }
 const {data:{session}}=await sb.auth.getSession();
 const ok=session?(await sb.rpc('is_admin')).data:false;
 if(!ok){
  app.innerHTML=`<div class="wrap admin"><section><h1>Espace administrateur</h1><form id="lf"><label>E-mail<input name="e" type="email" required></label><label>Mot de passe<input name="p" type="password" required></label><button class="btn">Se connecter</button><div id="lm"></div></form>${session?'<p class="msg err">Ce compte n’est pas autorisé.</p>':''}</section></div>`;
  $('#lf').onsubmit=async e=>{
   e.preventDefault();
   const {error}=await sb.auth.signInWithPassword({email:e.target.e.value,password:e.target.p.value});
   if(error)$('#lm').innerHTML='<p class="msg err">'+error.message+'.</p>';
   else admin()
  };
  return
 }
 const tabs={Réservations:tBook,Créneaux:tSlots,'Offres et tarifs':tOffers,Contenus:tContent,'Blocs visuels':tSections,Photos:tPhotos,Avis:tReviews,'Suivi des accompagnements':el=>renderFollowupAdmin(el,{sb,esc,fmt})};
 app.innerHTML=`<div class="wrap admin"><section><h1>Administration</h1><div class="tabs" role="tablist">${Object.keys(tabs).map((k,i)=>`<button role="tab" aria-selected="${i==0}">${k}</button>`).join('')}<button id="out">Déconnexion</button></div><div id="tab"></div></section></div>`;
 const show=n=>{
  app.querySelectorAll('[role=tab]').forEach(b=>b.setAttribute('aria-selected',b.textContent===n));
  tabs[n]($('#tab'))
 };
 app.querySelectorAll('[role=tab]').forEach(b=>b.onclick=()=>show(b.textContent));
 $('#out').onclick=async()=>{await sb.auth.signOut();admin()};
 show('Réservations')
}

const toast=(el,m,e)=>{
 el.insertAdjacentHTML('afterbegin',`<p class="msg${e?' err':''}">${esc(m)}</p>`);
 setTimeout(()=>el.firstElementChild?.remove(),3000)
};

async function tBook(el){
 const {data=[]}=await sb.from('bookings').select('*,slots(starts_at,duration_min)').order('created_at',{ascending:false});
 el.innerHTML=`<div class="tw"><table><tr><th>Créneau</th><th>Client</th><th>Prestation</th><th>Statut</th><th>Paiement</th></tr>${data.map(b=>`<tr><td>${b.slots?fmt(b.slots.starts_at):'-'}</td><td>${esc(b.first_name)} ${esc(b.last_name)}<br>${esc(b.email)} ${esc(b.phone||'')}${b.is_minor?`<br><em>Mineur · resp. : ${esc(b.guardian_name)} ${esc(b.guardian_email)}</em>`:''}${b.note?`<br>“${esc(b.note)}”`:''}</td><td>${SV[b.service]?.name} · ${b.participants} pers. · ${eur(b.amount_cents||0)}</td><td><select data-id="${b.id}" data-f="status">${opts(ST,STL,b.status)}</select></td><td><select data-id="${b.id}" data-f="payment_status">${opts(PS,PSL,b.payment_status)}</select></td></tr>`).join('')||'<tr><td colspan=5>Aucune réservation.</td></tr>'}</table></div><p class="note">Suivi interne uniquement : ce n’est pas une comptabilité officielle.</p>`;
 el.querySelectorAll('select').forEach(s=>s.onchange=async()=>{
  const {error}=await sb.from('bookings').update({[s.dataset.f]:s.value}).eq('id',s.dataset.id);
  toast(el,error?error.message:'Enregistré',!!error)
 })
}

async function tSlots(el){
 const {data=[]}=await sb.from('slots').select('*').order('starts_at');
 el.innerHTML=`<form id="sf"><label>Type<select name="service">${Object.entries(SV).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join('')}</select></label><label>Début<input name="at" type="datetime-local" required></label><label>Durée (min)<input name="d" type="number" value="60" min="15" step="5"></label><label>Places (max 4)<input name="c" type="number" value="1" min="1" max="4"></label><button class="btn">Créer le créneau</button></form>
 <div class="tw"><table>${data.map(s=>`<tr><td>${fmt(s.starts_at)}</td><td>${SV[s.service].name}</td><td>${s.duration_min} min · ${s.capacity} pl.</td><td>${s.status==='open'?'Ouvert':'Fermé'}</td><td><button data-t="${s.id}" data-s="${s.status}">${s.status==='open'?'Fermer':'Ouvrir'}</button> <button data-x="${s.id}">Supprimer</button></td></tr>`).join('')}</table></div>`;
 $('#sf').onsubmit=async e=>{
  e.preventDefault();
  const f=e.target;
  const {error}=await sb.from('slots').insert({service:f.service.value,starts_at:new Date(f.at.value).toISOString(),duration_min:+f.d.value,capacity:+f.c.value});
  error?toast(el,error.message,1):tSlots(el)
 };
 el.querySelectorAll('[data-t]').forEach(b=>b.onclick=async()=>{
  await sb.from('slots').update({status:b.dataset.s==='open'?'closed':'open'}).eq('id',b.dataset.t);
  tSlots(el)
 });
 el.querySelectorAll('[data-x]').forEach(b=>b.onclick=async()=>{
  const {error}=await sb.from('slots').delete().eq('id',b.dataset.x);
  error?toast(el,'Suppression impossible (réservations liées) : fermez le créneau.',1):tSlots(el)
 })
}

async function tOffers(el){
 const {data=[]}=await sb.from('offers').select('*').order('service').order('sort');
 el.innerHTML=`<div class="tw"><table><tr><th>Type</th><th>Libellé</th><th>Détail</th><th>Prix total (€)</th><th>Participants</th><th>Actif</th><th></th></tr>${data.map(o=>`<tr data-id="${o.id}"><td>${SV[o.service].name}</td><td><input value="${esc(o.label)}" data-f="label"></td><td><input value="${esc(o.detail||'')}" data-f="detail"></td><td><input type="number" step="0.5" value="${o.price_cents/100}" data-f="price"></td><td><input type="number" min="1" max="4" value="${o.participants}" data-f="participants"></td><td><input type="checkbox" ${o.active?'checked':''} data-f="active"></td><td><button>Enregistrer</button></td></tr>`).join('')}</table></div>
 <button class="btn" id="add">Ajouter une offre</button>`;
 el.querySelectorAll('tr[data-id] button').forEach(b=>b.onclick=async()=>{
  const r=b.closest('tr'),g=f=>r.querySelector(`[data-f=${f}]`);
  const {error}=await sb.from('offers').update({label:g('label').value,detail:g('detail').value,price_cents:Math.round(g('price').value*100),participants:+g('participants').value,active:g('active').checked}).eq('id',r.dataset.id);
  toast(el,error?error.message:'Enregistré',!!error)
 });
 $('#add').onclick=async()=>{
  const s=prompt('Type : physique, mentale ou basket ?');
  if(!SV[s])return;
  await sb.from('offers').insert({service:s,label:'Nouvelle offre',price_cents:0});
  tOffers(el)
 }
}

async function tContent(el){
 const {data=[]}=await sb.from('site_content').select('*');
 const cur={...C};
 data.forEach(r=>cur[r.key]=r.value);
 const clubHeadings={
  'clubs.intro':'<h2 class="content-group-title">Clubs et Entreprises — introduction</h2>',
  'clubs.players':'<h2 class="content-group-title">Club sportif</h2>',
  'clubs.companies':'<h2 class="content-group-title">Entreprise</h2>',
  'clubs.frequency':'<h2 class="content-group-title">Modalités et tarifs</h2>'
 };
 const contentLabels={
  'clubs.intro':'Introduction commune',
  'clubs.players':'Joueurs et joueuses',
  'clubs.staff':'Staffs et entraîneurs',
  'clubs.companies':'Interventions en entreprise',
  'clubs.frequency':'Fréquence des interventions',
  'clubs.duration':'Durée d’une intervention',
  'clubs.pricing':'Tarification'
 };
 el.innerHTML=`<form style="max-width:760px">${Object.keys(C).map(k=>`${clubHeadings[k]||''}<label>${contentLabels[k]||k}<textarea name="${k}" rows="${cur[k].length>120?4:1}">${esc(cur[k])}</textarea></label>`).join('')}<button class="btn">Enregistrer les contenus</button></form>`;
 el.querySelector('form').onsubmit=async e=>{
  e.preventDefault();
  const rows=Object.keys(C).map(k=>({key:k,value:e.target[k].value}));
  const {error}=await sb.from('site_content').upsert(rows);
  toast(el,error?error.message:'Contenus enregistrés',!!error)
 }
}

async function tSections(el){
 const entries=Object.entries(CONTENT_BLOCKS);
 const names={'ment.benefits':'Mental · apports','ment.steps':'Mental · étapes','ment.tools':'Mental · outils','bask.fundamentals':'Basket · fondamentaux','bask.steps':'Basket · progression','phys.axes':'Physique · qualités travaillées','phys.steps':'Physique · étapes'};
 const item=(key,row={title:'',text:''})=>`<article class="admin-block-item"><label>Titre<input data-block-title maxlength="90" value="${esc(row.title||'')}"></label><label>Texte<textarea data-block-text rows="2" maxlength="360">${esc(row.text||'')}</textarea></label><button class="btn alt" type="button" data-remove-block>Supprimer ce bloc</button></article>`;
 el.innerHTML=`<div class="admin-section-editors">${entries.map(([key,defaults])=>`<section class="admin-section-editor" data-block-group="${esc(key)}"><h2>${esc(names[key]||key)}</h2><div class="admin-block-list">${contentBlocks(key).map(row=>item(key,row)).join('')}</div><button class="btn alt" type="button" data-add-block>+ Ajouter un bloc</button></section>`).join('')}<button class="btn" type="button" data-save-blocks>Enregistrer les blocs</button></div>`;
 el.querySelectorAll('[data-add-block]').forEach(button=>button.onclick=()=>button.closest('[data-block-group]').querySelector('.admin-block-list').insertAdjacentHTML('beforeend',item(button.closest('[data-block-group]').dataset.blockGroup)));
 el.querySelectorAll('[data-remove-block]').forEach(button=>button.onclick=()=>button.closest('.admin-block-item').remove());
 el.querySelector('[data-save-blocks]').onclick=async()=>{
  const rows=[...el.querySelectorAll('[data-block-group]')].map(group=>({key:group.dataset.blockGroup,value:JSON.stringify([...group.querySelectorAll('.admin-block-item')].map(row=>({title:row.querySelector('[data-block-title]').value.trim(),text:row.querySelector('[data-block-text]').value.trim()})).filter(row=>row.title||row.text))}));
  const {error}=await sb.from('site_content').upsert(rows);if(!error)rows.forEach(row=>content[row.key]=row.value);toast(el,error?error.message:'Blocs enregistrés',!!error)
 }
}

async function tPhotos(el){
 const {data:rows=[],error:readError}=await sb.from('media').select('*').order('sort');
 if(readError){el.innerHTML=`<p class="msg err">${esc(readError.message)}</p>`;return}
 photos={};rows.forEach(row=>{if(row.caption?.startsWith('photo.home.'))photos[row.caption.slice(6)]=row});
 const settings=await sb.from('site_content').select('*').like('key','photo.%');(settings.data||[]).forEach(row=>content[row.key]=row.value);
 const editor=slot=>{const photo=photos[slot.id],cfg=photoSettings(slot.id);return `<article class="admin-photo-card" data-photo-slot="${esc(slot.id)}"><div><h3>${esc(slot.label)}</h3><div class="admin-photo-preview">${photo?.url?`<img data-preview-image src="${esc(photo.url)}" alt="${esc(cfg.alt)}" style="object-position:${cfg.x}% ${cfg.y}%;transform:scale(${cfg.zoom/100})">`:'<div class="photo-placeholder"><span>Emplacement photo</span></div>'}</div></div><div class="admin-photo-controls"><label>Choisir une photo<input type="file" accept="image/jpeg,image/png,image/webp" data-photo-file></label><label>Description de la photo<input type="text" maxlength="140" data-photo-alt value="${esc(cfg.alt)}"></label><label>Position horizontale<input type="range" min="0" max="100" value="${cfg.x}" data-photo-x></label><label>Position verticale<input type="range" min="0" max="100" value="${cfg.y}" data-photo-y></label><label>Zoom<input type="range" min="100" max="150" value="${cfg.zoom}" data-photo-zoom></label><div class="row admin-photo-actions"><button class="btn" type="button" data-save-photo>Enregistrer la photo</button>${photo?'<button class="btn alt" type="button" data-delete-photo>Retirer</button>':''}</div></div></article>`};
 el.innerHTML=`<div class="admin-photo-grid">${PHOTO_SLOTS.map(editor).join('')}</div>`;
 el.querySelectorAll('[data-photo-slot]').forEach(card=>{
  const preview=card.querySelector('[data-preview-image]'),file=card.querySelector('[data-photo-file]');
  const updatePreview=()=>{if(!preview)return;preview.style.objectPosition=`${card.querySelector('[data-photo-x]').value}% ${card.querySelector('[data-photo-y]').value}%`;preview.style.transform=`scale(${card.querySelector('[data-photo-zoom]').value/100})`};
  card.querySelectorAll('[data-photo-x],[data-photo-y],[data-photo-zoom]').forEach(input=>input.oninput=updatePreview);
  file.onchange=()=>{const selected=file.files?.[0];if(!selected)return;const url=URL.createObjectURL(selected);let image=card.querySelector('[data-preview-image]');if(!image){card.querySelector('.admin-photo-preview').innerHTML='<img data-preview-image alt="Aperçu de la photo">';image=card.querySelector('[data-preview-image]')}image.src=url;image.style.objectPosition=`${card.querySelector('[data-photo-x]').value}% ${card.querySelector('[data-photo-y]').value}%`;image.style.transform=`scale(${card.querySelector('[data-photo-zoom]').value/100})`};
  card.querySelector('[data-save-photo]').onclick=async()=>{
   const slot=card.dataset.photoSlot,selected=file.files?.[0],caption=`photo.${slot}`;let current=photos[slot],url=current?.url||'',path=current?.path||'';
   if(selected){if(selected.size>8*1024*1024){toast(el,'La photo doit faire 8 Mo maximum.',true);return}const safe=selected.name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g,'-').slice(-90),nextPath=`site/${slot}/${Date.now()}-${safe}`;const upload=await sb.storage.from('media').upload(nextPath,selected,{upsert:true,contentType:selected.type});if(upload.error){toast(el,upload.error.message,true);return}const publicData=sb.storage.from('media').getPublicUrl(nextPath).data;url=publicData.publicUrl;path=nextPath}
   if(!url){toast(el,'Choisis une photo avant de l’enregistrer.',true);return}
   const existing=await sb.from('media').select('id').eq('caption',caption).limit(1).maybeSingle();let write=existing.data?.id?await sb.from('media').update({url,path,kind:'photo',caption,sort:PHOTO_SLOTS.findIndex(item=>item.id===slot)}).eq('id',existing.data.id):await sb.from('media').insert({url,path,kind:'photo',caption,sort:PHOTO_SLOTS.findIndex(item=>item.id===slot)});
   const values={x:card.querySelector('[data-photo-x]').value,y:card.querySelector('[data-photo-y]').value,zoom:card.querySelector('[data-photo-zoom]').value,alt:card.querySelector('[data-photo-alt]').value.trim()};
   const saved=write.error?write:await sb.from('site_content').upsert(Object.entries(values).map(([name,value])=>({key:`photo.${slot}.${name}`,value:String(value)})));
   if(saved.error){toast(el,saved.error.message,true);return}
   if(selected&&current?.path&&current.path!==path)await sb.storage.from('media').remove([current.path]);
   photos[slot]={...(current||{}),url,path,caption};Object.entries(values).forEach(([name,value])=>content[`photo.${slot}.${name}`]=String(value));await tPhotos(el);toast(el,'Photo enregistrée. Recharge la page du site pour la voir.',false)
  };
  card.querySelector('[data-delete-photo]')?.addEventListener('click',async()=>{const slot=card.dataset.photoSlot,current=photos[slot];if(!current)return;const removed=await sb.from('media').delete().eq('caption',`photo.${slot}`);if(removed.error){toast(el,removed.error.message,true);return}if(current.path)await sb.storage.from('media').remove([current.path]);delete photos[slot];await tPhotos(el);toast(el,'Photo retirée',false)})
 });
}

async function tReviews(el){
 const {data,error}=await sb.from('site_content').select('value').eq('key','reviews.data').maybeSingle();
 const items=parseReviews(data?.value);
 el.innerHTML=`<div class="admin-reviews"><h2>Ajouter un avis</h2><p class="note">Les avis enregistrés ici apparaissent publiquement sur la page d’accueil.</p><form id="review-form"><label>Commentaire<textarea name="text" rows="4" maxlength="1500" required placeholder="Saisir le commentaire"></textarea></label><label>Prénom ou nom affiché (facultatif)<input name="name" maxlength="80" placeholder="Ex. Camille"></label><button class="btn" type="submit">Ajouter l’avis</button></form><h2>Avis publiés (${items.length})</h2><div class="admin-review-list">${items.map((r,i)=>`<article class="box"><p>« ${esc(r.text)} »</p>${r.name?`<p><strong>${esc(r.name)}</strong></p>`:''}<button type="button" class="btn alt" data-delete-review="${i}">Supprimer</button></article>`).join('')||'<p>Aucun avis publié pour le moment.</p>'}</div></div>`;
 if(error)toast(el,`Chargement des avis impossible : ${error.message}`,true);
 const save=async next=>{
  const {error:saveError}=await sb.from('site_content').upsert({key:'reviews.data',value:JSON.stringify(next)});
  if(saveError){toast(el,saveError.message,true);return false}
  reviews=next;
  return true
 };
 el.querySelector('#review-form').onsubmit=async e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const submit=form.querySelector('button[type="submit"]');
  const text=form.elements.namedItem('text').value.trim();
  const name=form.elements.namedItem('name').value.trim();
  if(!text)return;
  const next=[...items,{text,name}];
  submit.disabled=true;
  if(await save(next))tReviews(el);
  else submit.disabled=false
 };
 el.querySelectorAll('[data-delete-review]').forEach(button=>button.onclick=async()=>{
  const next=items.filter((_,i)=>i!==Number(button.dataset.deleteReview));
  if(await save(next))tReviews(el)
 })
}

let revealObserver;
const rv=()=>{
 if(revealObserver)revealObserver.disconnect();
 const items=document.querySelectorAll('#app .rv');
 if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  items.forEach(x=>x.classList.add('on'));
  return
 }
 revealObserver=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('on');revealObserver.unobserve(e.target)}
 }),{threshold:.12,rootMargin:'0px 0px -30px 0px'});
 items.forEach(x=>revealObserver.observe(x))
};

let moodFrame=0;
const syncScrollMood=()=>{
 if(moodFrame)return;
 moodFrame=requestAnimationFrame(()=>{
  const maxScroll=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  const progress=Math.min(1,Math.max(0,scrollY/maxScroll));
  const drift=progress*8;
  document.documentElement.style.setProperty('--scroll-x',`${46+drift}%`);
  document.documentElement.style.setProperty('--scroll-y',`${46+drift}%`);
  moodFrame=0
 })
};
addEventListener('scroll',syncScrollMood,{passive:true});
addEventListener('resize',syncScrollMood);

function openReservationChooser(){
 const old=$('[data-reservation-chooser]');
 old?.remove();
 const overlay=document.createElement('div');
 overlay.className='reservation-chooser-backdrop';
 overlay.dataset.reservationChooser='';
 overlay.innerHTML=`<section class="reservation-chooser" role="dialog" aria-modal="true" aria-labelledby="reservation-chooser-title"><button type="button" class="reservation-chooser-close" aria-label="Fermer">×</button><p class="reservation-chooser-kicker">CHOISIR UN ACCOMPAGNEMENT</p><h2 id="reservation-chooser-title">Que souhaitez-vous réserver ?</h2><div class="reservation-chooser-options"><a href="#/mentale#resa"><span>Préparation mentale</span><b>Réserver un créneau <span aria-hidden="true">→</span></b></a><a href="#/basket#resa"><span>Coaching individuel basket</span><b>Réserver un créneau <span aria-hidden="true">→</span></b></a><a href="#/physique#resa"><span>Préparation physique</span><b>Réserver un créneau <span aria-hidden="true">→</span></b></a><a href="#/clubs"><span>Clubs et Entreprises</span><b>Échanger sur un projet <span aria-hidden="true">→</span></b></a></div></section>`;
 document.body.append(overlay);
 const close=()=>overlay.remove();
 overlay.querySelector('.reservation-chooser-close').addEventListener('click',close);
 overlay.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
 overlay.addEventListener('click',event=>{if(event.target===overlay)close()});
 overlay.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
 overlay.querySelector('.reservation-chooser-close').focus()
}

history.scrollRestoration='manual';

const navOrder=['mentale','basket','physique','clubs'];
const navPrimary=$('.nav-primary');
if(navPrimary){
 const navLinks=new Map([...navPrimary.querySelectorAll('a')].map(link=>[link.getAttribute('href').replace(/^#\//,''),link]));
 navOrder.forEach(key=>{const link=navLinks.get(key);if(link)navPrimary.append(link)})
}

async function route(preserveScroll=false){
 const currentScroll=scrollY;
 const [p,anchor]=location.hash.replace(/^#\/?/,'').split('#');
 const path=location.pathname.replace(/\/+$/,'').toLowerCase();
 const isAdminPath=path==='/admin'||path==='/admin.html';
 const key=isAdminPath?'admin':(p==='admin'?'home':(p||'home'));
 document.body.dataset.t=key==='admin'?'admin':SV[key]?key:(key==='clubs'?'clubs':'home');
 $('#nav').classList.remove('open');
 $('.burger')?.setAttribute('aria-expanded','false');
 if(key==='admin')await admin();
 else{
  $('#app').innerHTML=SV[key]?pages.service(key):(pages[{'a-propos':'about'}[key]||key]||pages.home)();
  if(SV[key])booking(key);
  if(key==='home')setupReviews();
  if(key==='clubs')setupClubTabs();
  if(key==='a-propos')setupTimeline()
 }
 if(key==='home'){
  const hero=$('#app .hero');
  if(hero)requestAnimationFrame(()=>requestAnimationFrame(()=>hero.classList.add('home-enter')))
 }
 foot();
 rv();
 if(anchor)document.getElementById(anchor)?.scrollIntoView();
 else{
  const behavior=document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior='auto';
  scrollTo(0,preserveScroll===true?currentScroll:0);
  document.documentElement.style.scrollBehavior=behavior
 }
 syncScrollMood()
}

$('#nav').addEventListener('click',e=>{
 const link=e.target.closest('a[href^="#/"]:not([data-resa])');
 if(!link)return;
 e.preventDefault();
 const target=link.getAttribute('href');
 if(location.hash===target){
  const behavior=document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior='auto';
  scrollTo(0,0);
  document.documentElement.style.scrollBehavior=behavior
 }else location.hash=target
});

document.addEventListener('click',e=>{
 const a=e.target.closest('[data-resa]');
 if(!a)return;
 const current=location.hash.match(/^#\/(physique|mentale|basket)(?:#|$)/)?.[1];
 if(current){
  e.preventDefault();
  document.getElementById('resa')?.scrollIntoView({behavior:'smooth',block:'start'});
  return
 }
 e.preventDefault();
 openReservationChooser()
});

$('.burger').onclick=e=>{
 const n=$('#nav'),open=n.classList.toggle('open');
 e.currentTarget.setAttribute('aria-expanded',String(open))
};

if(!live)$('#banner').innerHTML='<div class="warn">Mode aperçu : Supabase n’est pas connecté. Les contenus affichés sont ceux par défaut et les réservations sont désactivées.</div>';
addEventListener('hashchange',()=>route(false));

async function boot(){
 await loadData();
 await route();
 document.body.classList.add('is-ready')
}
boot();
