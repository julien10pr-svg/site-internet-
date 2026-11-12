257
258
259
260
261
262
263
264
265
266
267
268
269
270
271
272
273
274
275
276
277
278
279
280
281
282
283
284
285
286
287
288
289
290
291
292
293
294
295
296
297
298
299
300
301
302
303
304
305
306
307
308
309
310
311
312
313
314
315
316
317
318
319
320
321
322
323
324
325
326
327
328
329
330
331
332
333
334
335
336
337
338
339
340
341
342
343
344
345
346
347
348
349
350
351
352
353
354
355
356
357
358
359
360
361
362
363
async function tContent(el){const {data=[]}=await sb.from('site_content').select('*');const cur={...C};data.forEach(r=>cur[r.key]=r.value);
 const clubHeadings={'clubs.intro':'<h2 class="content-group-title">Clubs et Entreprises — introduction</h2>','clubs.players':'<h2 class="content-group-title">Club sportif</h2>','clubs.companies':'<h2 class="content-group-title">Entreprise</h2>','clubs.frequency':'<h2 class="content-group-title">Modalités et tarifs</h2>'};
 const contentLabels={'clubs.intro':'Introduction commune','clubs.players':'Joueurs et joueuses','clubs.staff':'Staffs et entraîneurs','clubs.companies':'Interventions en entreprise','clubs.frequency':'Fréquence des interventions','clubs.duration':'Durée d’une intervention','clubs.pricing':'Tarification'};
 el.innerHTML=`<form style="max-width:760px">${Object.keys(C).map(k=>`${clubHeadings[k]||''}<label>${contentLabels[k]||k}<textarea name="${k}" rows="${cur[k].length>120?4:1}">${esc(cur[k])}</textarea></label>`).join('')}<button class="btn">Enregistrer les contenus</button></form><p class="note">Les passages entre crochets [ ] s’affichent comme « à compléter » sur le site.</p>`;
 el.querySelector('form').onsubmit=async e=>{e.preventDefault();const rows=Object.keys(C).map(k=>({key:k,value:e.target[k].value}));const {error}=await sb.from('site_content').upsert(rows);toast(el,error?error.message:'Contenus enregistrés',!!error)}}
async function tReviews(el){
 const {data,error}=await sb.from('site_content').select('value').eq('key','reviews.data').maybeSingle();
 const items=parseReviews(data?.value);
 el.innerHTML=`<div class="admin-reviews"><h2>Ajouter un avis</h2><p class="note">Les avis enregistrés ici apparaissent publiquement sur la page d’accueil.</p><form id="review-form"><label>Commentaire<textarea name="text" rows="4" maxlength="1500" required placeholder="Saisir le commentaire"></textarea></label><label>Prénom ou nom affiché (facultatif)<input name="name" maxlength="80" placeholder="Ex. Camille"></label><button class="btn" type="submit">Ajouter l’avis</button></form><h2>Avis publiés (${items.length})</h2><div class="admin-review-list">${items.map((r,i)=>`<article class="box"><p>« ${esc(r.text)} »</p>${r.name?`<p><strong>${esc(r.name)}</strong></p>`:''}<button type="button" class="btn alt" data-delete-review="${i}">Supprimer</button></article>`).join('')||'<p>Aucun avis publié pour le moment.</p>'}</div></div>`;
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

// Le fond accompagne doucement le défilement, sans animation lourde ni effet de curseur.
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

function openReservationChooser(){
 const old=$('[data-reservation-chooser]');old?.remove();
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
 overlay.querySelector('.reservation-chooser-close').focus();
}

history.scrollRestoration='manual';
// Ordre uniforme des rubriques dans le menu téléphone et ordinateur.
const navOrder=['mentale','basket','physique','clubs'];
const navPrimary=$('.nav-primary');
if(navPrimary){
 const navLinks=new Map([...navPrimary.querySelectorAll('a')].map(link=>[link.getAttribute('href').replace(/^#\//,''),link]));
 navOrder.forEach(key=>{const link=navLinks.get(key);if(link)navPrimary.append(link)});
}
async function route(preserveScroll=false){
 const currentScroll=scrollY;
 const [p,anchor]=location.hash.replace(/^#\/?/,'').split('#');const key=p||'home';
 document.body.dataset.t=key==='admin'?'admin':SV[key]?key:(key==='clubs'?'clubs':'home');$('#nav').classList.remove('open');$('.burger')?.setAttribute('aria-expanded','false');
 if(key==='admin')await admin();
 else{$('#app').innerHTML=SV[key]?pages.service(key):(pages[{'a-propos':'about'}[key]||key]||pages.home)();if(SV[key])booking(key);if(key==='home')setupReviews();if(key==='clubs')setupClubTabs();if(key==='a-propos')setupTimeline()}
 if(key==='home'){const hero=$('#app .hero');if(hero)requestAnimationFrame(()=>requestAnimationFrame(()=>hero.classList.add('home-enter')))}
 foot();rv();if(anchor)document.getElementById(anchor)?.scrollIntoView();else{const behavior=document.documentElement.style.scrollBehavior;document.documentElement.style.scrollBehavior='auto';scrollTo(0,preserveScroll===true?currentScroll:0);document.documentElement.style.scrollBehavior=behavior}syncScrollMood();
}
// Les onglets de navigation doivent toujours ramener en haut de leur page,
// y compris si l’on reclique sur l’onglet de la page déjà ouverte.
$('#nav').addEventListener('click',e=>{
 const link=e.target.closest('a[href^="#/"]:not([data-resa])');
 if(!link)return;
 e.preventDefault();
 const target=link.getAttribute('href');
 if(location.hash===target){
  const behavior=document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior='auto';
  scrollTo(0,0);
  document.documentElement.style.scrollBehavior=behavior;
 }else location.hash=target;
});
document.addEventListener('click',e=>{
 const a=e.target.closest('[data-resa]');
 if(!a)return;
 const current=location.hash.match(/^#\/(physique|mentale|basket)(?:#|$)/)?.[1];
 if(current){
  e.preventDefault();
  document.getElementById('resa')?.scrollIntoView({behavior:'smooth',block:'start'});
  return;
 }
 e.preventDefault();
 openReservationChooser();
});
$('.burger').onclick=e=>{const n=$('#nav'),open=n.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open))};
if(!live)$('#banner').innerHTML='<div class="warn">Mode aperçu : Supabase n’est pas connecté. Les contenus affichés sont ceux par défaut et les réservations sont désactivées.</div>';
let visitorHasScrolled=false;
addEventListener('scroll',()=>{visitorHasScrolled=true},{passive:true,once:true});
addEventListener('hashchange',()=>route(false));
// Affiche le site tout de suite. Ne le re-rend après le chargement des données que si le visiteur n’a pas commencé à défiler.
route();
loadData().then(()=>{if(!visitorHasScrolled)route(true)});
