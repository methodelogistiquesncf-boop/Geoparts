/* ═══════════════════════════════════════════════════════════════
   app.js  ·  Logique applicative, Firebase, vues & interactions
   Connexion obligatoire. Aucun mode local, aucune inscription,
   aucun assistant visible. Comptes créés dans Firebase Console.
   ═══════════════════════════════════════════════════════════════ */
import { THEMES, DEFAULT_PREFS, themeList, getTheme, applyFontScale, applyAllPrefs } from './themes.js';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyC74VWRr6EQSkQN-DB6IOkvH7ezhllPwiE",
  authDomain: "geoparts-11556.firebaseapp.com",
  projectId: "geoparts-11556",
  storageBucket: "geoparts-11556.firebasestorage.app",
  messagingSenderId: "173072052005",
  appId: "1:173072052005:web:f9fde39b725fbe03b0b4cc"
};
const FB_BASE = 'https://www.gstatic.com/firebasejs/10.12.2/';
const GLPI = 'https://mikefri.github.io/Ticket_GLPI/ticket-detail.html?id=dReeI9UA5p6FffQvJVtX';
const K = { V5:'reunionPrestataireV5', V4:'reunionPrestataireV4', NEWS:'reunionNewsSeen' };
const PROTECTED = new Set(['rfx','dpx','geoparts','mag2','petcop','glpi','qrqc','codir','mahe','luc','st eloi','saint eloi','caristes','cariste','manut','embarques','embarquer','essieux','essieu','douchettes','douchette']);

const STATUS = [
  { label:'À faire', key:'todo', badge:'st-todo-badge', card:'' },
  { label:'En cours', key:'wip', badge:'st-wip-badge', card:'st-wip' },
  { label:'Terminé', key:'done', badge:'st-done-badge', card:'st-done' }
];
const PRIO = [{key:'haute',label:'Haute'},{key:'moyenne',label:'Moyenne'},{key:'basse',label:'Basse'}];
const PRIO_ORD = { haute:0, moyenne:1, basse:2 };
const PRIO_VAR = { haute:'--danger', moyenne:'--warn', basse:'--info' };
const ST_VAR = { todo:'--todo', wip:'--warn', done:'--ok' };

const SEED = [
 {id:1,title:"Point 1 : Info agent & mouvements supports",desc:"Comment retrouver qui a fait des prélèvements et quand ?\n⚠️ Prérequis : Avoir les droits suffisants dans RFX.",addedDate:"2026-11-10",status:"En cours",priority:"moyenne",notes:"Demande de droits RFX envoyée le 12/11 au support. Relance prévue à la prochaine réunion."},
 {id:2,title:"Point 2 : Dashboard pilotage caristes",desc:"• Mouvements à faire / faits par jour\n• Visuel nuit complète (présence agent oui/non)\n• Historique > 1 mois\n• Détail synthétisé par agent/support avec ratio",addedDate:"2026-11-10",status:"En cours",priority:"moyenne",notes:"Maquette validée côté exploitation. Reste à définir la source de données pour la présence de nuit."},
 {id:3,title:"Point 3 : Traitement anomalies (Luc)",desc:"Nettoyage des procédures d'embarquement (actuellement non traitées).\n⚠️ Problème : Si anomalie corrigée, la ligne reste rouge. Comment informer Geoparts pour la passer au vert ?",addedDate:"2026-11-10",status:"À faire",priority:"haute",notes:"Bloquant : personne ne traite les anomalies. Demander un mécanisme de rafraîchissement du statut côté Geoparts."},
 {id:4,title:"Point 4 : Manut RFX & DPX (Resp : Mahe)",desc:"Les DPX créent des manuts sans mettre les palettes au départ (mouvements indus).\n• Piste : correction auto + date de création du bon manut sur les embarques.\n• Action : rappeler le geste métier (déplacement physique d'abord, saisie ensuite).",addedDate:"2026-11-10",status:"À faire",priority:"haute",notes:"Mahe doit présenter la correction automatique. Message geste métier à passer en CODIR."},
 {id:5,title:"Point 5 : Fluidité MAG2 et St Eloi",desc:"Problème de rétention et envoi 'en masse' qui déstabilise GEOPARTS.\n• Action : QRQC à faire, suivi amélioration organisation.",addedDate:"2026-11-10",status:"En cours",priority:"moyenne",notes:"QRQC planifié. Amélioration constatée mais à confirmer sur deux semaines."},
 {id:6,title:"Point 6 : Commande matériel",desc:"Commande de 3 douchettes.",addedDate:"2026-11-10",status:"Terminé",priority:"basse",notes:"Commande passée le 14/11 — livraison annoncée sous 10 jours."},
 {id:7,title:"Point 7 : Réception essieux",desc:"Manque indication expéditeur sur réception essieux.\n🔗 Voir le ticket GLPI\nAction : boucler le ticket si lot défaut ou numéro d'essieu.",addedDate:"2026-11-10",status:"À faire",priority:"moyenne",notes:"Ticket GLPI ouvert. Arbitrage à rendre : lot par défaut ou numéro d'essieu."},
 {id:8,title:"Point 8 : Matériels PETCOP (Mahe)",desc:"Créer les matériels PETCOP 1, 2, 3, 4.",addedDate:"2026-11-10",status:"Terminé",priority:"basse",notes:"Les 4 matériels ont été créés dans la base. Vérification faite avec Mahe."}
];
const SEED_VIEWS = [
  { id:'v1', name:'Urgences', view:'list', status:'all', prio:'haute', q:'', sort:'priority' },
  { id:'v2', name:'À traiter', view:'board', status:'todo', prio:'all', q:'', sort:'manual' },
  { id:'v3', name:'Soldés', view:'compact', status:'done', prio:'all', q:'', sort:'date-desc' }
];
const NEWS_DONE = [
  ['Connexion obligatoire','aucun mode local, aucune inscription, aucun assistant : seuls les comptes créés par l’administrateur accèdent à l’application.'],
  ['Mise en page large écran','jusqu’à 1800 px : deux colonnes de cartes au-delà de 1560 px, rail de synthèse collant à droite.'],
  ['Trois vues réelles','Liste (détail + notes), Tableau kanban par statut, Compacte (tableau dense).'],
  ['Glisser-déposer','réordonnez à la poignée, ou déposez dans une colonne du Tableau pour changer le statut.'],
  ['Tiroir de détail','le crayon ou le titre ouvre un panneau latéral complet, avec navigation précédent / suivant.'],
  ['Sélection multiple','statut, priorité ou suppression en une fois, avec annulation.'],
  ['Vues enregistrées','mémorisez un filtre + tri + vue sous un nom, rappelable en un clic.'],
  ['Synthèse vivante','anneau d’avancement, répartition des priorités, journal d’activité horodaté.'],
  ['Thèmes externalisés','themes.js : 6 palettes, accent personnalisé, densité, taille du texte, contraste.'],
  ['Export & import','JSON complet, CSV pour Excel, réimport avec confirmation.'],
  ['Raccourcis clavier','N nouveau point, / recherche, 1·2·3 vues, Échap fermer.']
];
const NEWS_NEXT = [
  ['Rappels avant réunion','email automatique la veille avec les points ouverts (Firebase Functions).'],
  ['Pièces jointes','photo de palette ou capture d’anomalie sur le point (Firebase Storage).'],
  ['Mode Réunion','plein écran point par point, piloté au clavier, pour dérouler l’ordre du jour.'],
  ['Récurrence','point hebdomadaire qui revient à chaque réunion.'],
  ['Tags libres','étiqueter par site ou thème (RFX, MAG2, quai…) et filtrer.'],
  ['Historique versionné','revenir à l’état d’une réunion précédente.'],
  ['Partage lecture seule','lien public en lecture pour le prestataire, sans accès en écriture.'],
  ['Commentaires datés','fil de discussion par point pour tracer les échanges.'],
  ['Vélocité','comparer les points soldés d’une réunion à l’autre.'],
  ['Liste blanche d’emails','restreindre la connexion à des adresses précises côté règles Firestore.']
];

let S = { points:[], meetingDate:'', prefs:{...DEFAULT_PREFS}, savedViews:[], activity:[], updatedAt:0 };
const ui = { q:'', status:'all', prio:'all', sort:'manual', activeView:null, sel:new Set(), drawerId:null, dragId:null, pendingDelete:null, cancelConfirm:null, printMode:false, firstRender:true };
let fb=null, user=null, unsub=null, firstSnap=true, cloudTimer=null, pendingRemote=null, pendingTimer=null, syncState='local', lastApi=0;
const acTimers = new WeakMap();

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => { const d=document.createElement('div'); d.textContent=s??''; return d.innerHTML; };
const escA = s => esc(s).replace(/"/g,'&quot;');
const todayISO = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const fmtDate = s => { if(!s)return''; const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'}); };
const shortDate = s => { if(!s)return''; const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'2-digit'}); };
const rel = ts => { const s=(Date.now()-ts)/1000; if(s<60)return"à l'instant"; if(s<3600)return`il y a ${Math.floor(s/60)} min`; if(s<86400)return`il y a ${Math.floor(s/3600)} h`; return new Date(ts).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'}); };
const stOf = p => STATUS.find(s=>s.label===p.status)||STATUS[0];
const normPrio = v => PRIO.some(x=>x.key===v)?v:'moyenne';
const prioOf = p => PRIO.find(x=>x.key===normPrio(p.priority))||PRIO[1];
const byId = id => S.points.find(p=>p.id===id);
const nextId = () => S.points.length?Math.max(...S.points.map(p=>p.id))+1:1;
function normalize(arr){ return (arr||[]).map(p=>({ id:+p.id||0, title:String(p.title||'Sans titre'), desc:String(p.desc||''), addedDate:p.addedDate||todayISO(), status:STATUS.some(s=>s.label===p.status)?p.status:'À faire', priority:normPrio(p.priority), notes:String(p.notes||'') })); }

const IC = {
  pencil:'<svg class="ic" viewBox="0 0 24 24"><path d="M4 20h4L19.5 8.5a2.1 2.1 0 0 0-3-3L5 17z"/><path d="m13.5 6.5 3 3"/></svg>',
  trash:'<svg class="ic" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>',
  spark:'<svg class="ic" viewBox="0 0 24 24"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/></svg>',
  cal:'<svg class="ic" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
  grip:'<svg class="ic" viewBox="0 0 24 24"><circle cx="9" cy="6" r="1.3"/><circle cx="15" cy="6" r="1.3"/><circle cx="9" cy="12" r="1.3"/><circle cx="15" cy="12" r="1.3"/><circle cx="9" cy="18" r="1.3"/><circle cx="15" cy="18" r="1.3"/></svg>',
  cloud:'<svg class="ic" viewBox="0 0 24 24"><path d="M17.5 19a4.5 4.5 0 0 0 .4-9A6 6 0 0 0 6.2 8.5 4.5 4.5 0 0 0 6.5 19z"/><path d="m9 13 2 2 4-4"/></svg>',
  cloudOff:'<svg class="ic" viewBox="0 0 24 24"><path d="M17.5 19a4.5 4.5 0 0 0 .4-9A6 6 0 0 0 6.2 8.5 4.5 4.5 0 0 0 6.5 19z"/><path d="m4 4 16 16"/></svg>',
  sync:'<svg class="ic" viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 3v4h-4"/></svg>',
  out:'<svg class="ic" viewBox="0 0 24 24"><path d="M14 4h-8v16h8M10 12h11m0 0-3.5-3.5M21 12l-3.5 3.5"/></svg>',
  eye:'<svg class="ic" viewBox="0 0 24 24"><path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/></svg>',
  eyeOff:'<svg class="ic" viewBox="0 0 24 24"><path d="M4 4l16 16M9.9 5.9A10.6 10.6 0 0 1 12 5.5c6.5 0 10 6.5 10 6.5a17 17 0 0 1-3.2 3.9M6.1 8.3A16.6 16.6 0 0 0 2 12s3.5 6.5 10 6.5a10 10 0 0 0 3-.5"/></svg>',
  warn:'<svg class="ic" viewBox="0 0 24 24"><path d="M12 3 2.5 20h19z"/><path d="M12 9.5v4.5M12 17.2v.3"/></svg>',
  check:'<svg class="ic" viewBox="0 0 24 24"><path d="m4.5 12.5 5 5 10-11"/></svg>',
  x:'<svg class="ic" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>'
};
const TRASH_ANIM = '<svg viewBox="0 0 24 24"><g class="lid"><path d="M4 7h16M9 7V4h6v3"/></g><path d="M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>';

function toast(msg,{type='ok',duration=3800}={}){
  const t=document.createElement('div'); t.className=`toast ${type}`;
  t.innerHTML=`${type==='err'?IC.warn:IC.check}<span>${esc(msg)}</span>`;
  $('#toastHost').appendChild(t);
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300);},duration);
}
function richToast({title,sub,actions,hint,duration,icon=TRASH_ANIM,confirm=false,onClose}){
  const t=document.createElement('div'); t.className='toast toast-rich'+(confirm?' toast-confirm':'');
  t.setAttribute('role',confirm?'alertdialog':'alert');
  t.innerHTML=`<div class="tr-ico">${icon}</div><div class="tr-body"><div class="tr-title">${esc(title)}</div><div class="tr-sub" title="${escA(sub)}">${esc(sub)}</div></div>
    <div class="tc-actions"></div><button class="tr-close" type="button" aria-label="Fermer">${IC.x}</button>
    ${hint?`<div class="tr-hint">${esc(hint)}</div>`:''}<div class="tr-bar"><i style="animation-duration:${duration}ms"></i></div>`;
  const box=t.querySelector('.tc-actions'); $('#toastHost').appendChild(t);
  let remaining=duration,start=Date.now(),dead=false,timer;
  function close(key){ if(dead)return; dead=true; clearTimeout(timer); document.removeEventListener('keydown',onKey);
    t.classList.add('out'); setTimeout(()=>t.remove(),300); onClose?.(key); }
  function onKey(e){ if(e.key==='Escape') close(actions.find(a=>a.safe)?.key??null); }
  actions.forEach(a=>{ const b=document.createElement('button'); b.type='button'; b.className='tc-btn '+(a.kind==='ok'?'tc-ok':'tc-cancel');
    b.innerHTML=(a.icon||'')+esc(a.label); b.onclick=()=>close(a.key); box.appendChild(b); if(a.safe) setTimeout(()=>b.focus(),90); });
  t.querySelector('.tr-close').onclick=()=>close(null);
  document.addEventListener('keydown',onKey);
  timer=setTimeout(()=>close(null),remaining);
  t.addEventListener('mouseenter',()=>{clearTimeout(timer);remaining-=Date.now()-start;});
  t.addEventListener('mouseleave',()=>{if(!dead){start=Date.now();timer=setTimeout(()=>close(null),Math.max(600,remaining));}});
  return { close };
}

function loadLocal(){
  let raw=localStorage.getItem(K.V5);
  if(!raw){
    const old=localStorage.getItem(K.V4);
    if(old){ try{ const d=JSON.parse(old);
      S={ points:normalize(d.points), meetingDate:d.meetingDate||todayISO(), prefs:{...DEFAULT_PREFS,theme:d.theme||'chaleureux',autoCorrect:d.autoCorrect!==false}, savedViews:structuredClone(SEED_VIEWS), activity:[], updatedAt:d.updatedAt||0 };
      persistLocal(); return; }catch{} }
    S={ points:normalize(SEED), meetingDate:todayISO(), prefs:{...DEFAULT_PREFS}, savedViews:structuredClone(SEED_VIEWS), activity:[], updatedAt:0 };
    return;
  }
  try{ S=hydrate(JSON.parse(raw)); }catch{ S={ points:normalize(SEED), meetingDate:todayISO(), prefs:{...DEFAULT_PREFS}, savedViews:structuredClone(SEED_VIEWS), activity:[], updatedAt:0 }; }
}
function hydrate(d){
  return {
    points:normalize(d.points&&d.points.length?d.points:SEED),
    meetingDate:d.meetingDate||todayISO(),
    prefs:{...DEFAULT_PREFS,...(d.prefs||{}),theme:THEMES[d.prefs?.theme]?d.prefs.theme:(d.theme&&THEMES[d.theme]?d.theme:'chaleureux'),autoCorrect:d.prefs?.autoCorrect??d.autoCorrect??true},
    savedViews:Array.isArray(d.savedViews)?d.savedViews:structuredClone(SEED_VIEWS),
    activity:Array.isArray(d.activity)?d.activity.slice(0,60):[],
    updatedAt:d.updatedAt||0
  };
}
function persistLocal(){ localStorage.setItem(K.V5,JSON.stringify(S)); }
function save(log){
  S.updatedAt=Date.now(); if(log)pushActivity(log); persistLocal(); render();
  $('#saveIndicator').textContent='✓ Enregistré à '+new Date().toLocaleTimeString('fr-FR');
  if(fb&&user)queueCloud();
}
function pushActivity({type,label}){ S.activity.unshift({ts:Date.now(),type,label}); S.activity=S.activity.slice(0,60); }

function visible(){
  let list=S.points.map(p=>({p}));
  if(ui.status!=='all')list=list.filter(x=>stOf(x.p).key===ui.status);
  if(ui.prio!=='all')list=list.filter(x=>prioOf(x.p).key===ui.prio);
  if(ui.q){const q=ui.q.toLowerCase();list=list.filter(x=>(x.p.title+' '+x.p.desc+' '+x.p.notes).toLowerCase().includes(q));}
  const ord={todo:0,wip:1,done:2};
  const cmp={manual:null,priority:(a,b)=>PRIO_ORD[prioOf(a.p).key]-PRIO_ORD[prioOf(b.p).key],'date-asc':(a,b)=>a.p.addedDate.localeCompare(b.p.addedDate),'date-desc':(a,b)=>b.p.addedDate.localeCompare(a.p.addedDate),status:(a,b)=>ord[stOf(a.p).key]-ord[stOf(b.p).key],title:(a,b)=>a.p.title.localeCompare(b.p.title,'fr')}[ui.sort];
  if(cmp)list.sort((a,b)=>cmp(a,b)||a.p.id-b.p.id);
  return list.map(x=>x.p);
}
function counts(){ const c={all:S.points.length,todo:0,wip:0,done:0,haute:0,moyenne:0,basse:0}; S.points.forEach(p=>{c[stOf(p).key]++;c[prioOf(p).key]++;}); return c; }

function render(){
  const c=counts(), view=ui.printMode?'list':S.prefs.view;
  $('#chips').innerHTML=[['all','Tous'],['todo','À faire'],['wip','En cours'],['done','Terminés']].map(([k,l])=>`<button class="chip ${ui.status===k?'active':''}" data-filter="${k}" type="button">${l}<span class="n">${c[k]}</span></button>`).join('');
  $$('#viewSwitch .vs-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===S.prefs.view));
  const pct=c.all?Math.round(c.done/c.all*100):0;
  $('#statsStrip').innerHTML=`
    <span class="stat-pill"><span class="sq" style="background:var(--danger)"></span><b>${c.haute}</b> haute${c.haute>1?'s':''}</span>
    <span class="stat-pill"><span class="sq" style="background:var(--warn)"></span><b>${c.wip}</b> en cours</span>
    <span class="stat-pill"><span class="sq" style="background:var(--ok)"></span><b>${c.done}</b> terminé${c.done>1?'s':''}</span>
    <span class="stat-pill grow"><b>${pct}%</b><span class="mini-track"><span class="mini-fill" style="width:${pct}%"></span></span>${c.done}/${c.all}</span>`;
  $('#printDate').textContent='Compte rendu de réunion — '+fmtDate(S.meetingDate);
  renderDonut(c,pct); renderPrioBars(c); renderViews(); renderActivity(); renderBulk();
  const list=ui.printMode?S.points:visible(); const box=$('#pointsView'); box.className='points-view view-'+view;
  if(!list.length){ box.innerHTML=`<div class="empty-state">${S.points.length?'Aucun point ne correspond à ce filtre.':'Aucun point. Cliquez sur « Ajouter un point » pour commencer.'}</div>`; ui.firstRender=false; return; }
  box.innerHTML=view==='board'?boardHTML(list):view==='compact'?compactHTML(list):listHTML(list);
  ui.firstRender=false;
}
function renderDonut(c,pct){
  const R=42,C=2*Math.PI*R; let off=0;
  const segs=[['todo',c.todo],['wip',c.wip],['done',c.done]].map(([k,n])=>{ const len=c.all?n/c.all*C:0; const s=`<circle r="${R}" cx="50" cy="50" fill="none" stroke="var(${ST_VAR[k]})" stroke-width="11" stroke-dasharray="${len} ${C-len}" stroke-dashoffset="${-off}"/>`; off+=len; return s; }).join('');
  $('#donutWrap').innerHTML=`<svg viewBox="0 0 100 100" width="100%" height="100%"><circle r="${R}" cx="50" cy="50" fill="none" stroke="var(--surface2)" stroke-width="11"/>${segs}</svg><div class="donut-pct">${pct}%<small>terminé</small></div>`;
  $('#legend').innerHTML=[['todo','À faire',c.todo],['wip','En cours',c.wip],['done','Terminés',c.done]].map(([k,l,n])=>`<div><span class="sq" style="background:var(${ST_VAR[k]})"></span>${l}<b>${n}</b></div>`).join('');
}
function renderPrioBars(c){ const max=Math.max(1,c.haute,c.moyenne,c.basse);
  $('#prioBars').innerHTML=PRIO.map(p=>`<div class="pb-row"><span>${p.label}</span><span class="pb-track"><span class="pb-fill" style="width:${c[p.key]/max*100}%;background:var(${PRIO_VAR[p.key]})"></span></span><b>${c[p.key]}</b></div>`).join(''); }
function renderViews(){
  $('#savedViews').innerHTML=S.savedViews.length?S.savedViews.map(v=>`<span class="sv-chip ${ui.activeView===v.id?'active':''}" data-view-id="${v.id}" role="button" tabindex="0">${esc(v.name)}<button class="sv-x" data-del-view="${v.id}" type="button" aria-label="Supprimer la vue">${IC.x}</button></span>`).join(''):'<span class="hint" style="font-size:.76rem">Aucune vue enregistrée.</span>'; }
function renderActivity(){
  const el=$('#activityList'); if(!S.activity.length){ el.innerHTML='<li class="empty">Les actions réalisées apparaîtront ici.</li>'; return; }
  const col={add:'--ok',edit:'--info',del:'--danger',status:'--warn',prio:'--accent',bulk:'--accent2',import:'--info'};
  el.innerHTML=S.activity.slice(0,18).map(a=>`<li><span class="ad" style="background:var(${col[a.type]||'--muted'})"></span><span>${esc(a.label)}<time>${rel(a.ts)}</time></span></li>`).join(''); }
function renderBulk(){ const n=ui.sel.size; $('#bulkBar').hidden=n===0; document.body.classList.toggle('bulk-open',n>0); if(n)$('#bulkCount').textContent=`${n} point${n>1?'s':''} sélectionné${n>1?'s':''}`; }
function prioBadge(p){ const pr=prioOf(p); return `<button class="prio-badge prio-${pr.key}" data-act="prio" data-id="${p.id}" type="button" title="Priorité ${pr.label} — cliquer pour changer"><span class="dot"></span>${pr.label}</button>`; }
function statusBadge(p){ const st=stOf(p); return `<button class="status-badge ${st.badge}" data-act="status" data-id="${p.id}" type="button" title="Changer le statut"><span class="dot"></span>${st.label}</button>`; }
function descHTML(p){ return esc(p.desc).replace(/Voir le ticket GLPI/g,`<a href="${GLPI}" target="_blank" rel="noopener">Voir le ticket GLPI</a>`); }
function selBox(p){ return `<input type="checkbox" class="pt-sel" data-sel="${p.id}" ${ui.sel.has(p.id)?'checked':''} aria-label="Sélectionner ce point">`; }
function pendingCls(p){ return ui.pendingDelete===p.id?'pending-delete':''; }

function listHTML(list){
  return list.map((p,n)=>{ const st=stOf(p);
    return `<article class="pt-card ${st.card} ${pendingCls(p)} ${ui.sel.has(p.id)?'selected':''} ${ui.firstRender&&!ui.printMode?'enter':''}" data-drop-id="${p.id}" style="--i:${n}">
      <div class="pt-head">${selBox(p)}<span class="drag-handle" draggable="true" data-drag="${p.id}" title="Glisser pour réordonner">${IC.grip}</span>
        <div class="pt-meta"><button class="pt-title" data-act="open" data-id="${p.id}" type="button">${esc(p.title)}</button>
          <div class="pt-sub">${IC.cal}Ajouté le ${fmtDate(p.addedDate)} ${prioBadge(p)}</div></div>
        <div class="pt-actions">${statusBadge(p)}<button class="btn-icon" data-act="open" data-id="${p.id}" type="button" title="Modifier ce point" aria-label="Modifier">${IC.pencil}</button><button class="btn-icon danger" data-act="del" data-id="${p.id}" type="button" title="Supprimer ce point" aria-label="Supprimer">${IC.trash}</button></div></div>
      ${p.desc?`<div class="pt-desc">${descHTML(p)}</div>`:''}
      <div class="notes-wrapper"><textarea class="notes" spellcheck="true" data-note="${p.id}" placeholder="Vos notes, actions, responsables, échéances…">${esc(p.notes)}</textarea>
        <div class="notes-tools"><button class="btn-correct" data-correct type="button" title="Corriger cette note">${IC.spark}Corriger</button></div><div class="correction-indicator"></div></div>
      <div class="print-notes">${esc(p.notes)||'—'}</div></article>`; }).join('');
}
function boardHTML(list){
  return STATUS.map(s=>{ const items=list.filter(p=>stOf(p).key===s.key);
    return `<section class="bd-col" data-drop-status="${s.key}"><header class="bd-head"><span class="sq" style="background:var(${ST_VAR[s.key]})"></span>${s.label}<span class="n">${items.length}</span></header>
      <div class="bd-list">${items.length?items.map(p=>`<article class="bd-card ${s.card} ${ui.sel.has(p.id)?'selected':''}" draggable="true" data-drag="${p.id}" data-drop-id="${p.id}" data-drop-status="${s.key}">
        <div class="bd-top">${selBox(p)}<button class="bd-title" data-act="open" data-id="${p.id}" type="button">${esc(p.title)}</button><button class="btn-icon danger" data-act="del" data-id="${p.id}" type="button" title="Supprimer" aria-label="Supprimer">${IC.trash}</button></div>
        ${p.notes?`<div class="bd-note">${esc(p.notes)}</div>`:''}<div class="bd-foot">${prioBadge(p)}<span>${shortDate(p.addedDate)}</span></div></article>`).join(''):'<div class="bd-empty">Déposez un point ici</div>'}</div></section>`; }).join('');
}
function compactHTML(list){
  return `<div class="cp-head"><span></span><span></span><span>Point</span><span>Priorité</span><span>Statut</span><span>Date</span><span></span></div>`+
    list.map(p=>{ const st=stOf(p);
      return `<div class="cp-row ${st.card} ${ui.sel.has(p.id)?'selected':''}" data-drop-id="${p.id}">${selBox(p)}<span class="drag-handle" draggable="true" data-drag="${p.id}" title="Glisser pour réordonner">${IC.grip}</span>
        <button class="cp-title" data-act="open" data-id="${p.id}" type="button" title="${escA(p.title)}">${esc(p.title)}</button><span class="cp-prio">${prioBadge(p)}</span>${statusBadge(p)}<span class="cp-date">${shortDate(p.addedDate)}</span>
        <span class="cp-acts"><button class="btn-icon" data-act="open" data-id="${p.id}" type="button" title="Ouvrir" aria-label="Ouvrir">${IC.pencil}</button><button class="btn-icon danger" data-act="del" data-id="${p.id}" type="button" title="Supprimer" aria-label="Supprimer">${IC.trash}</button></span></div>`; }).join('');
}

function cycleStatus(id){ const p=byId(id); if(!p)return; const i=STATUS.findIndex(s=>s.label===p.status); p.status=STATUS[(i+1)%3].label; save({type:'status',label:`« ${p.title} » → ${p.status}`}); pulse(`[data-act="status"][data-id="${id}"]`); }
function cyclePrio(id){ const p=byId(id); if(!p)return; const i=PRIO.findIndex(x=>x.key===prioOf(p).key); p.priority=PRIO[(i+1)%3].key; save({type:'prio',label:`Priorité ${prioOf(p).label} · « ${p.title} »`}); pulse(`[data-act="prio"][data-id="${id}"]`); }
function pulse(sel){ const b=document.querySelector(sel); if(b){ b.classList.add('pulse'); b.addEventListener('animationend',()=>b.classList.remove('pulse'),{once:true}); } }

function askDelete(id){
  const p=byId(id); if(!p)return; if(ui.cancelConfirm)ui.cancelConfirm(); ui.pendingDelete=id; render();
  const h=richToast({ title:'Supprimer ce point ?', sub:`« ${p.title} »`, confirm:true, duration:8000, hint:'Sans réponse, rien ne sera effacé · Échap pour annuler',
    actions:[{key:'cancel',label:'Annuler',safe:true},{key:'ok',label:'Supprimer',kind:'ok',icon:IC.trash}],
    onClose:key=>{ ui.cancelConfirm=null; ui.pendingDelete=null; if(key==='ok')reallyDelete([id]); else{ render(); document.querySelector(`[data-act="del"][data-id="${id}"]`)?.focus(); } } });
  ui.cancelConfirm=()=>h.close('cancel');
}
function reallyDelete(ids){
  const removed=ids.map(id=>({p:byId(id),at:S.points.findIndex(x=>x.id===id)})).filter(x=>x.p); if(!removed.length)return;
  S.points=S.points.filter(p=>!ids.includes(p.id)); ids.forEach(id=>ui.sel.delete(id)); if(ids.includes(ui.drawerId))closeDrawer();
  save({type:'del',label:removed.length>1?`${removed.length} points supprimés`:`« ${removed[0].p.title} » supprimé`});
  richToast({ title:removed.length>1?`${removed.length} points supprimés`:'Point supprimé', sub:removed.length>1?removed.map(r=>r.p.title).join(' · '):`« ${removed[0].p.title} »`, duration:6500,
    actions:[{key:'undo',label:'Annuler',safe:true}],
    onClose:key=>{ if(key!=='undo')return; removed.sort((a,b)=>a.at-b.at).forEach(r=>S.points.splice(Math.min(r.at,S.points.length),0,r.p));
      save({type:'add',label:removed.length>1?`${removed.length} points restaurés`:`« ${removed[0].p.title} » restauré`}); toast('Restauré.');
      document.querySelector(`[data-drop-id="${removed[0].p.id}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}); } });
}
function askBulkDelete(){ const ids=[...ui.sel]; if(!ids.length)return;
  richToast({ title:`Supprimer ${ids.length} points ?`, sub:ids.map(i=>byId(i)?.title).filter(Boolean).join(' · '), confirm:true, duration:8000, hint:'Sans réponse, rien ne sera effacé',
    actions:[{key:'cancel',label:'Annuler',safe:true},{key:'ok',label:'Supprimer',kind:'ok',icon:IC.trash}], onClose:k=>{ if(k==='ok')reallyDelete(ids); } }); }
function addPoint(){
  const t=$('#newTitle').value.trim(),d=$('#newDesc').value.trim(),dt=$('#newDate').value,st=$('#newStatus').value;
  if(!t){ toast('Veuillez saisir un titre.',{type:'err'}); $('#newTitle').focus(); return; }
  const p={id:nextId(),title:t,desc:d,addedDate:dt||todayISO(),status:st,priority:normPrio($('#newPrio').dataset.value),notes:''};
  S.points.push(p); $('#newTitle').value=''; $('#newDesc').value=''; $('#addForm').hidden=true; setPrio($('#newPrio'),'moyenne');
  ui.q=''; $('#searchInput').value=''; ui.status='all'; ui.prio='all'; $('#prioFilter').value='all'; ui.activeView=null;
  save({type:'add',label:`« ${p.title} » ajouté`}); toast('Point ajouté.');
  setTimeout(()=>document.querySelector(`[data-drop-id="${p.id}"]`)?.scrollIntoView({behavior:'smooth',block:'center'}),80);
}
function setPrio(box,key){ if(!box)return; box.dataset.value=key; box.querySelectorAll('.prio-opt').forEach(b=>{const on=b.dataset.prio===key;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on));}); }
function setStatus(box,key){ if(!box)return; box.dataset.value=key; box.querySelectorAll('.status-opt').forEach(b=>{const on=b.dataset.st===key;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on));}); }
function prioSeg(id,val){ return `<div class="prio-seg" id="${id}" data-value="${val}" role="group" aria-label="Priorité">`+PRIO.map(x=>`<button type="button" class="prio-opt ${x.key===val?'selected':''}" data-prio="${x.key}" aria-pressed="${x.key===val}"><span class="dot"></span>${x.label}</button>`).join('')+'</div>'; }
function statusSeg(id,val){ return `<div class="status-seg" id="${id}" data-value="${val}" role="group" aria-label="Statut">`+STATUS.map(x=>`<button type="button" class="status-opt ${x.key===val?'selected':''}" data-st="${x.key}" aria-pressed="${x.key===val}"><span class="dot"></span>${x.label}</button>`).join('')+'</div>'; }

function openDrawer(id){
  const p=byId(id); if(!p)return; ui.drawerId=id; const list=visible(),pos=list.findIndex(x=>x.id===id);
  $('#drawerPos').textContent=pos>=0?`${pos+1} / ${list.length}`:'';
  $('#drawerBody').innerHTML=`
    <div class="dr-hero">${IC.cal} Ajouté le ${fmtDate(p.addedDate)} · Référence #${p.id}</div>
    <div class="form-field"><label for="drTitle">Titre du point</label><input type="text" id="drTitle" spellcheck="true" value="${escA(p.title)}"></div>
    <div class="form-field"><label for="drDate">Date d'ajout</label><input type="date" id="drDate" value="${escA(p.addedDate)}"></div>
    <div class="form-field"><label>Priorité</label>${prioSeg('drPrio',prioOf(p).key)}</div>
    <div class="form-field"><label>Statut</label>${statusSeg('drStatus',stOf(p).key)}</div>
    <div class="form-field"><label for="drDesc">Description / Contexte</label><div class="notes-wrapper"><textarea id="drDesc" class="notes" spellcheck="true">${esc(p.desc)}</textarea><div class="notes-tools"><button class="btn-correct" data-correct type="button">${IC.spark}Corriger</button></div><div class="correction-indicator"></div></div></div>
    <div class="form-field"><label for="drNotes">Notes de réunion</label><div class="notes-wrapper"><textarea id="drNotes" class="notes" spellcheck="true" style="min-height:8rem">${esc(p.notes)}</textarea><div class="notes-tools"><button class="btn-correct" data-correct type="button">${IC.spark}Corriger</button></div><div class="correction-indicator"></div></div></div>`;
  $('#drawer').hidden=false; $('#drawerScrim').hidden=false; setTimeout(()=>$('#drTitle').focus(),80);
}
function closeDrawer(){ ui.drawerId=null; $('#drawer').hidden=true; $('#drawerScrim').hidden=true; }
function saveDrawer(){
  const p=byId(ui.drawerId); if(!p)return closeDrawer();
  const t=$('#drTitle').value.trim(); if(!t){ toast('Le titre ne peut pas être vide.',{type:'err'}); return; }
  p.title=t; p.desc=$('#drDesc').value.trim(); p.notes=$('#drNotes').value; const d=$('#drDate').value; if(d)p.addedDate=d;
  p.priority=normPrio($('#drPrio').dataset.value); p.status=(STATUS.find(s=>s.key===$('#drStatus').dataset.value)||STATUS[0]).label;
  save({type:'edit',label:`« ${p.title} » modifié`}); toast('Point enregistré.'); closeDrawer();
}
function navDrawer(dir){ const list=visible(); if(!list.length)return; let i=list.findIndex(x=>x.id===ui.drawerId); i=i<0?0:(i+dir+list.length)%list.length; openDrawer(list[i].id); }

function clearMarks(){ $$('.drop-before,.drop-after,.drop-active').forEach(e=>e.classList.remove('drop-before','drop-after','drop-active')); }
function movePoint(id,targetId,before,statusKey){
  const from=S.points.findIndex(p=>p.id===id); if(from<0)return; const [p]=S.points.splice(from,1);
  if(statusKey){ const st=STATUS.find(s=>s.key===statusKey); if(st)p.status=st.label; }
  let to=targetId!=null?S.points.findIndex(x=>x.id===targetId):-1;
  if(to<0){ if(statusKey){ let last=-1; S.points.forEach((x,i)=>{if(stOf(x).key===statusKey)last=i;}); to=last+1||S.points.length; } else to=S.points.length; }
  else if(!before)to+=1;
  S.points.splice(Math.max(0,Math.min(to,S.points.length)),0,p);
  ui.sort='manual'; $('#sortSelect').value='manual';
  save({type:statusKey?'status':'edit',label:statusKey?`« ${p.title} » → ${p.status}`:`« ${p.title} » déplacé`});
}

function scheduleAuto(ta){
  if(!S.prefs.autoCorrect)return; clearTimeout(acTimers.get(ta));
  acTimers.set(ta,setTimeout(()=>{ const v=ta.value; if(ta.selectionStart===v.length&&/[\s.,;:!?)\n]/.test(v.slice(-1))&&v.trim().length>3&&v!==ta.dataset.lastCorrected)correct(ta,true); },1200));
}
async function correct(ta,silent){
  const wrap=ta.closest('.notes-wrapper'); if(!wrap)return;
  const btn=wrap.querySelector('.btn-correct'),ind=wrap.querySelector('.correction-indicator'),text=ta.value;
  if(!text.trim()||btn.disabled)return;
  const wait=Math.max(0,1400-(Date.now()-lastApi)); if(wait)await new Promise(r=>setTimeout(r,wait)); lastApi=Date.now();
  const cursor=ta.selectionStart,focus=document.activeElement===ta;
  btn.disabled=true; const old=btn.innerHTML; btn.innerHTML='<span class="spinner"></span>';
  if(!silent){ ind.textContent='Correction en cours…'; ind.className='correction-indicator visible'; }
  let n=0;
  try{
    const res=await fetch('https://api.languagetool.org/v2/check',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:`text=${encodeURIComponent(text)}&language=fr&enabledOnly=false`});
    if(!res.ok)throw new Error(res.status); const data=await res.json();
    const ms=(data.matches||[]).filter(m=>{const o=text.substr(m.offset,m.length); if(PROTECTED.has(o.toLowerCase())||/^[A-Z0-9]{2,6}$/.test(o))return false; if(silent&&m.rule?.issueType!=='misspelling')return false; return m.replacements?.length>0;}).sort((a,b)=>b.offset-a.offset);
    let out=text,shift=0; for(const m of ms){const r=m.replacements[0].value;out=out.slice(0,m.offset)+r+out.slice(m.offset+m.length);n++;if(m.offset<cursor)shift+=r.length-m.length;}
    if(out!==text){ ta.value=out;ta.dataset.lastCorrected=out; const id=ta.dataset.note; if(id){const p=byId(+id);if(p){p.notes=out;save();}} if(focus){ta.focus();const pos=Math.max(0,Math.min(out.length,cursor+shift));ta.setSelectionRange(pos,pos);} }
    if(!silent){ ind.textContent=n?`✓ ${n} correction${n>1?'s':''}`:'✓ Aucune faute'; ind.className='correction-indicator visible success'; setTimeout(()=>ind.className='correction-indicator',3000); }
  }catch{ if(!silent){ ind.textContent='⚠️ Service indisponible'; ind.className='correction-indicator visible'; setTimeout(()=>ind.className='correction-indicator',3000); } }
  btn.disabled=false; btn.innerHTML=old;
}

function applySavedView(id){ const v=S.savedViews.find(x=>x.id===id); if(!v)return;
  ui.q=v.q;ui.status=v.status;ui.prio=v.prio;ui.sort=v.sort;ui.activeView=v.id;S.prefs.view=v.view;
  $('#searchInput').value=v.q;$('#prioFilter').value=v.prio;$('#sortSelect').value=v.sort; save(); toast(`Vue « ${v.name} » appliquée.`); }
function saveCurrentView(name){ const v={id:'v'+Date.now(),name:name.slice(0,28),view:S.prefs.view,status:ui.status,prio:ui.prio,q:ui.q,sort:ui.sort};
  S.savedViews.push(v);ui.activeView=v.id; save({type:'edit',label:`Vue « ${v.name} » enregistrée`}); toast('Vue enregistrée.'); }

function download(name,content,mime){ const b=new Blob([content],{type:mime}),u=URL.createObjectURL(b),a=document.createElement('a'); a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1500); }
function exportJson(){ download(`reunion-${S.meetingDate}.json`,JSON.stringify(S,null,2),'application/json'); toast('Export JSON téléchargé.'); }
function exportCsv(){ const q=s=>`"${String(s??'').replace(/"/g,'""').replace(/\r?\n/g,' ⏎ ')}"`;
  const rows=[['Id','Titre','Priorité','Statut','Date d\'ajout','Description','Notes'].map(q).join(';')];
  S.points.forEach(p=>rows.push([p.id,p.title,prioOf(p).label,p.status,p.addedDate,p.desc,p.notes].map(q).join(';')));
  download(`reunion-${S.meetingDate}.csv`,'\uFEFF'+rows.join('\r\n'),'text/csv;charset=utf-8'); toast('Export CSV téléchargé.'); }
function importJson(file){ const r=new FileReader();
  r.onload=()=>{ try{ const d=JSON.parse(r.result); const pts=normalize(Array.isArray(d)?d:d.points); if(!pts.length)throw new Error('vide');
    richToast({ title:`Importer ${pts.length} points ?`, sub:'Les points actuels seront remplacés.', confirm:true, duration:9000,
      actions:[{key:'cancel',label:'Annuler',safe:true},{key:'ok',label:'Importer',kind:'ok'}],
      onClose:k=>{ if(k!=='ok')return; const backup=structuredClone(S.points); S.points=pts; if(d.meetingDate)S.meetingDate=d.meetingDate; if(Array.isArray(d.savedViews))S.savedViews=d.savedViews;
        $('#meetingDate').value=S.meetingDate; ui.sel.clear(); save({type:'import',label:`${pts.length} points importés`});
        richToast({ title:'Import terminé', sub:`${pts.length} points chargés`, duration:6500, actions:[{key:'undo',label:'Annuler',safe:true}],
          onClose:k2=>{ if(k2==='undo'){S.points=backup;save({type:'import',label:'Import annulé'});toast('Import annulé.');} } }); } });
  }catch{ toast('Fichier JSON invalide.',{type:'err'}); } }; r.readAsText(file); }

function renderThemeGrid(){ $('#themeGrid').innerHTML=themeList().map(t=>`<button type="button" class="theme-card ${S.prefs.theme===t.id?'active':''}" data-theme-id="${t.id}"><span class="tc-sw">${t.sw.map(c=>`<i style="background:${c}"></i>`).join('')}</span><span class="tc-name">${t.label}</span><span class="tc-mood">${t.mood}</span></button>`).join(''); }
function syncAppearanceUI(){ renderThemeGrid(); $('#accentPick').value=S.prefs.accent||getTheme(S.prefs.theme).v.accent; $('#accentHint').textContent=S.prefs.accent?'Accent personnalisé actif':'Accent du thème';
  $$('#densitySeg .seg-btn').forEach(b=>b.classList.toggle('active',b.dataset.density===S.prefs.density));
  $('#fontRange').value=S.prefs.fontScale;$('#fontVal').textContent=S.prefs.fontScale+' %';$('#motionToggle').checked=S.prefs.motion;$('#contrastToggle').checked=S.prefs.contrast;$('#autoToggle').checked=S.prefs.autoCorrect; }
function setPref(patch,{rerender=true}={}){ Object.assign(S.prefs,patch); applyAllPrefs(S.prefs); if(rerender)save(); }

async function initFirebase(){
  if(fb)return true;
  try{
    const [a,au,fs]=await Promise.all([import(FB_BASE+'firebase-app.js'),import(FB_BASE+'firebase-auth.js'),import(FB_BASE+'firebase-firestore.js')]);
    const app=a.initializeApp(FIREBASE_CONFIG),auth=au.getAuth(app);
    await au.setPersistence(auth,au.browserLocalPersistence);
    fb={auth,db:fs.getFirestore(app),au,fs};
    au.onAuthStateChanged(auth,handleAuth);
    return true;
  }catch(e){ console.warn(e); return false; }
}
function connectionFailed(){
  showAuth('login');
  authErr('login','Connexion au service impossible. Vérifiez votre réseau puis réessayez.');
  $('#loginBtn').disabled=true; $('#authRetry').hidden=false;
}
function handleAuth(u){
  if(unsub){unsub();unsub=null;} user=u; firstSnap=true; pendingRemote=null;
  if(u){
    $('#authOverlay').hidden=true; $('#app').hidden=false; updateAccount(); setSync('syncing');
    unsub=fb.fs.onSnapshot(fb.fs.doc(fb.db,'users',u.uid),snap=>{
      if(firstSnap){ firstSnap=false; if(!snap.exists()){pushCloud();return;} if(!snap.metadata.hasPendingWrites)applyRemote(snap.data(),true); else setSync('synced'); return; }
      if(snap.metadata.hasPendingWrites)return; const d=snap.data(); if(!d)return;
      if((d.updatedAt||0)<=S.updatedAt){setSync('synced');return;}
      if(typing()){pendingRemote=d;schedulePending();}else applyRemote(d,false);
    },err=>{console.warn(err);setSync('error');});
  }else{
    $('#app').hidden=true; $('#authOverlay').hidden=false; showAuth('login'); updateAccount();
  }
}
function typing(){ const a=document.activeElement; return a&&/^(TEXTAREA|INPUT)$/.test(a.tagName)&&$('#app').contains(a); }
function schedulePending(){ clearTimeout(pendingTimer); pendingTimer=setTimeout(()=>{ if(!pendingRemote)return; if(typing()){schedulePending();return;} const d=pendingRemote;pendingRemote=null;applyRemote(d,false); },1400); }
function applyRemote(d,force){
  if(!force&&(d.updatedAt||0)<=S.updatedAt)return; if(ui.cancelConfirm)ui.cancelConfirm(); closeDrawer(); ui.sel.clear();
  S=hydrate(d); persistLocal(); applyAllPrefs(S.prefs); $('#meetingDate').value=S.meetingDate; syncAppearanceUI(); render(); setSync('synced');
  $('#saveIndicator').textContent='✓ Synchronisé depuis le cloud'; if(!force)toast('Mise à jour reçue d’un autre appareil.');
}
async function pushCloud(){ if(!fb||!user)return; setSync('syncing'); try{ await fb.fs.setDoc(fb.fs.doc(fb.db,'users',user.uid),S,{merge:true}); setSync('synced'); }catch(e){console.warn(e);setSync('error');} }
function queueCloud(){ setSync('syncing'); clearTimeout(cloudTimer); cloudTimer=setTimeout(pushCloud,750); }
function flushCloud(){ if(fb&&user){clearTimeout(cloudTimer);pushCloud();} }
function setSync(s){ syncState=s; const b=$('#syncBadge'); if(!b)return;
  const m={synced:['synced',IC.cloud,'Synchronisé'],syncing:['syncing',IC.sync,'Sync…'],error:['error',IC.warn,'Erreur sync'],offline:['',IC.cloudOff,'Hors ligne'],local:['',IC.cloudOff,'Mode local']};
  const [c,i,l]=m[s]||m.local; b.className='sync-badge '+c; b.innerHTML=i+'<span>'+l+'</span>'; }
function updateAccount(){
  const a=$('#accountArea');
  if(fb&&user){ const mail=user.email||'';
    a.innerHTML=`<span class="sync-badge" id="syncBadge"></span><span class="user-chip" title="${escA(mail)}"><span class="avatar">${esc((mail[0]||'?').toUpperCase())}</span><span class="mail">${esc(mail)}</span></span><button class="btn-icon" data-acc="logout" type="button" title="Se déconnecter" aria-label="Se déconnecter">${IC.out}</button>`;
    setSync(navigator.onLine?(syncState==='local'?'synced':syncState):'offline');
  } else a.innerHTML='';
}
const AUTH_ERR={
  'auth/invalid-email':'Adresse email invalide.',
  'auth/user-not-found':'Aucun compte autorisé pour cette adresse. Contactez l’administrateur.',
  'auth/wrong-password':'Email ou mot de passe incorrect.',
  'auth/invalid-credential':'Email ou mot de passe incorrect.',
  'auth/user-disabled':'Ce compte a été désactivé par l’administrateur.',
  'auth/too-many-requests':'Trop de tentatives. Réessayez dans quelques minutes.',
  'auth/network-request-failed':'Erreur réseau. Vérifiez votre connexion.',
  'auth/operation-not-allowed':'Activez « Email/Mot de passe » dans Firebase Console.',
  'auth/admin-restricted-operation':'Création de compte désactivée. Seul l’administrateur peut créer un accès.',
  'auth/unauthorized-domain':'Domaine non autorisé : ajoutez votre domaine GitHub Pages dans Firebase.',
  'auth/missing-password':'Veuillez saisir le mot de passe.'
};
function authErr(v,msg){ const el=$('#'+({login:'authError',reset:'authError3'}[v])); if(el){el.innerHTML=IC.warn+'<span>'+esc(msg)+'</span>';el.hidden=false;} }
function clearAuthErr(){ ['authError','authError3'].forEach(i=>{const e=$('#'+i);if(e)e.hidden=true;}); }
function showAuth(v){ clearAuthErr(); $('#authLoading').hidden=v!=='loading'; $('#loginForm').hidden=v!=='login'; $('#resetForm').hidden=v!=='reset'; $('#sentView').hidden=v!=='sent';
  if(v==='login')setTimeout(()=>$('#loginEmail').focus(),60);
  if(v==='reset'){const e=$('#loginEmail').value;if(e)$('#resetEmail').value=e;setTimeout(()=>$('#resetEmail').focus(),60);} }
function busy(b,on,label){ b.disabled=on; b.innerHTML=on?'<span class="spinner"></span>Patience…':label; }

function bind(){
  const view=$('#pointsView');
  view.addEventListener('click',e=>{
    const po=e.target.closest('.prio-opt'); if(po){setPrio(po.closest('.prio-seg'),po.dataset.prio);return;}
    const so=e.target.closest('.status-opt'); if(so){setStatus(so.closest('.status-seg'),so.dataset.st);return;}
    const co=e.target.closest('[data-correct]'); if(co){correct(co.closest('.notes-wrapper').querySelector('textarea'),false);return;}
    const el=e.target.closest('[data-act]'); if(!el)return; const id=+el.dataset.id;
    ({status:()=>cycleStatus(id),prio:()=>cyclePrio(id),open:()=>openDrawer(id),del:()=>askDelete(id)})[el.dataset.act]?.();
  });
  view.addEventListener('change',e=>{const c=e.target.closest('[data-sel]');if(!c)return;const id=+c.dataset.sel;c.checked?ui.sel.add(id):ui.sel.delete(id);render();});
  view.addEventListener('input',e=>{const ta=e.target.closest('[data-note]');if(!ta)return;const p=byId(+ta.dataset.note);if(p){p.notes=ta.value;save();scheduleAuto(ta);}});
  view.addEventListener('focusout',()=>{if(pendingRemote&&!typing())schedulePending();});
  view.addEventListener('dragstart',e=>{const h=e.target.closest('[data-drag]');if(!h)return;ui.dragId=+h.dataset.drag;e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',String(ui.dragId));h.closest('[data-drop-id]')?.classList.add('dragging');});
  view.addEventListener('dragover',e=>{if(ui.dragId==null)return;const card=e.target.closest('[data-drop-id]'),col=e.target.closest('[data-drop-status]');if(!card&&!col)return;e.preventDefault();e.dataTransfer.dropEffect='move';clearMarks();
    if(card&&+card.dataset.dropId!==ui.dragId){const r=card.getBoundingClientRect();card.classList.add(e.clientY<r.top+r.height/2?'drop-before':'drop-after');}else if(col)col.classList.add('drop-active');});
  view.addEventListener('drop',e=>{if(ui.dragId==null)return;e.preventDefault();const card=e.target.closest('[data-drop-id]'),col=e.target.closest('[data-drop-status]');const id=ui.dragId;ui.dragId=null;
    if(card&&+card.dataset.dropId!==id)movePoint(id,+card.dataset.dropId,card.classList.contains('drop-before'),col?.dataset.dropStatus);else if(col)movePoint(id,null,false,col.dataset.dropStatus);clearMarks();});
  view.addEventListener('dragend',()=>{ui.dragId=null;clearMarks();$$('.dragging').forEach(x=>x.classList.remove('dragging'));});

  $('#chips').addEventListener('click',e=>{const c=e.target.closest('[data-filter]');if(!c)return;ui.status=c.dataset.filter;ui.activeView=null;render();});
  $('#searchInput').addEventListener('input',e=>{ui.q=e.target.value;ui.activeView=null;render();});
  $('#prioFilter').addEventListener('change',e=>{ui.prio=e.target.value;ui.activeView=null;render();});
  $('#sortSelect').addEventListener('change',e=>{ui.sort=e.target.value;ui.activeView=null;render();});
  $('#viewSwitch').addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(!b)return;setPref({view:b.dataset.view});});
  $('#railToggle').addEventListener('click',()=>document.body.classList.toggle('rail-open'));
  $('#meetingDate').addEventListener('change',e=>{S.meetingDate=e.target.value;save();});
  $('#printBtn').addEventListener('click',()=>window.print());

  $('#addToggle').addEventListener('click',()=>{const f=$('#addForm');f.hidden=!f.hidden;if(!f.hidden){$('#newDate').value=todayISO();$('#newTitle').focus();}});
  $('#addCancel').addEventListener('click',()=>$('#addForm').hidden=true);
  $('#addSave').addEventListener('click',addPoint);
  $('#newPrio').addEventListener('click',e=>{const b=e.target.closest('.prio-opt');if(b)setPrio($('#newPrio'),b.dataset.prio);});
  $('#newDesc').addEventListener('input',function(){scheduleAuto(this);});
  $('#addForm').addEventListener('click',e=>{const c=e.target.closest('[data-correct]');if(c)correct(c.closest('.notes-wrapper').querySelector('textarea'),false);});

  $('#drawerClose').addEventListener('click',closeDrawer);
  $('#drawerCancel').addEventListener('click',closeDrawer);
  $('#drawerScrim').addEventListener('click',closeDrawer);
  $('#drawerSave').addEventListener('click',saveDrawer);
  $('#drawerDelete').addEventListener('click',()=>{const id=ui.drawerId;closeDrawer();askDelete(id);});
  $('#drawerPrev').addEventListener('click',()=>navDrawer(-1));
  $('#drawerNext').addEventListener('click',()=>navDrawer(1));
  $('#drawerBody').addEventListener('click',e=>{const po=e.target.closest('.prio-opt');if(po)return setPrio(po.closest('.prio-seg'),po.dataset.prio);const so=e.target.closest('.status-opt');if(so)return setStatus(so.closest('.status-seg'),so.dataset.st);const c=e.target.closest('[data-correct]');if(c)correct(c.closest('.notes-wrapper').querySelector('textarea'),false);});
  $('#drawerBody').addEventListener('input',e=>{if(e.target.matches('textarea.notes'))scheduleAuto(e.target);});

  $('#bulkClose').addEventListener('click',()=>{ui.sel.clear();render();});
  $('#bulkAll').addEventListener('click',()=>{visible().forEach(p=>ui.sel.add(p.id));render();});
  $('#bulkDelete').addEventListener('click',askBulkDelete);
  $('#bulkStatus').addEventListener('change',e=>{const v=e.target.value;if(!v)return;const ids=[...ui.sel];ids.forEach(id=>{const p=byId(id);if(p)p.status=v;});e.target.value='';save({type:'bulk',label:`${ids.length} points → ${v}`});toast(`${ids.length} points mis à jour.`);});
  $('#bulkPrio').addEventListener('change',e=>{const v=e.target.value;if(!v)return;const ids=[...ui.sel];ids.forEach(id=>{const p=byId(id);if(p)p.priority=v;});e.target.value='';save({type:'bulk',label:`Priorité ${v} sur ${ids.length} points`});toast(`${ids.length} points mis à jour.`);});

  $('#savedViews').addEventListener('click',e=>{const del=e.target.closest('[data-del-view]');if(del){const id=del.dataset.delView;const v=S.savedViews.find(x=>x.id===id);S.savedViews=S.savedViews.filter(x=>x.id!==id);if(ui.activeView===id)ui.activeView=null;save({type:'edit',label:`Vue « ${v?.name} » supprimée`});return;}const c=e.target.closest('[data-view-id]');if(c)applySavedView(c.dataset.viewId);});
  $('#saveViewBtn').addEventListener('click',()=>{$('#saveViewRow').hidden=false;$('#viewName').value='';$('#viewName').focus();});
  $('#viewNameOk').addEventListener('click',()=>{const n=$('#viewName').value.trim();if(!n){toast('Donnez un nom à la vue.',{type:'err'});return;}saveCurrentView(n);$('#saveViewRow').hidden=true;});
  $('#viewName').addEventListener('keydown',e=>{if(e.key==='Enter')$('#viewNameOk').click();});

  $('#exportJson').addEventListener('click',exportJson);
  $('#exportCsv').addEventListener('click',exportCsv);
  $('#importBtn').addEventListener('click',()=>$('#importFile').click());
  $('#importFile').addEventListener('change',e=>{const f=e.target.files[0];if(f)importJson(f);e.target.value='';});
  $('#autoToggle').addEventListener('change',e=>setPref({autoCorrect:e.target.checked},{rerender:false}));

  $('#appearanceBtn').addEventListener('click',()=>{syncAppearanceUI();$('#appearanceModal').hidden=false;});
  $('#appearanceClose').addEventListener('click',()=>$('#appearanceModal').hidden=true);
  $('#appearanceModal').addEventListener('click',e=>{if(e.target.id==='appearanceModal')$('#appearanceModal').hidden=true;});
  $('#themeGrid').addEventListener('click',e=>{const c=e.target.closest('[data-theme-id]');if(!c)return;setPref({theme:c.dataset.themeId,accent:''});syncAppearanceUI();});
  $('#accentPick').addEventListener('input',e=>{setPref({accent:e.target.value});$('#accentHint').textContent='Accent personnalisé actif';});
  $('#accentReset').addEventListener('click',()=>{setPref({accent:''});syncAppearanceUI();});
  $('#densitySeg').addEventListener('click',e=>{const b=e.target.closest('[data-density]');if(!b)return;setPref({density:b.dataset.density});syncAppearanceUI();});
  $('#fontRange').addEventListener('input',e=>{const v=applyFontScale(e.target.value);$('#fontVal').textContent=v+' %';S.prefs.fontScale=v;});
  $('#fontRange').addEventListener('change',()=>save());
  $('#motionToggle').addEventListener('change',e=>setPref({motion:e.target.checked}));
  $('#contrastToggle').addEventListener('change',e=>setPref({contrast:e.target.checked}));

  $('#newsBtn').addEventListener('click',()=>{$('#newsModal').hidden=false;$('#newsBtn').classList.add('seen');localStorage.setItem(K.NEWS,'1');});
  $('#newsClose').addEventListener('click',()=>$('#newsModal').hidden=true);
  $('#newsModal').addEventListener('click',e=>{if(e.target.id==='newsModal')$('#newsModal').hidden=true;});

  $('#accountArea').addEventListener('click',e=>{const b=e.target.closest('[data-acc]');if(!b)return;
    if(b.dataset.acc==='logout'){flushCloud();fb.au.signOut(fb.auth).then(()=>toast('Déconnecté.')).catch(()=>toast('Déconnexion impossible.',{type:'err'}));}});

  $('#loginForm').addEventListener('submit',async e=>{e.preventDefault();clearAuthErr();
    if(!fb){connectionFailed();return;}
    const em=$('#loginEmail').value.trim(),pw=$('#loginPass').value;
    if(!em||!pw)return authErr('login','Renseignez votre email et votre mot de passe.');
    const b=$('#loginBtn');busy(b,true);
    try{await fb.au.signInWithEmailAndPassword(fb.auth,em,pw);}catch(err){authErr('login',AUTH_ERR[err.code]||'Connexion impossible.');}
    busy(b,false,'Se connecter');});
  $('#authRetry').addEventListener('click',async()=>{ $('#authRetry').hidden=true; $('#loginBtn').disabled=false; clearAuthErr(); showAuth('loading'); const ok=await initFirebase(); if(!ok)connectionFailed(); });
  $('#resetForm').addEventListener('submit',async e=>{e.preventDefault();clearAuthErr();
    if(!fb){authErr('reset','Service indisponible. Réessayez plus tard.');return;}
    const em=$('#resetEmail').value.trim();if(!em)return authErr('reset','Renseignez votre adresse email.');
    const b=$('#resetBtn');busy(b,true);
    try{await fb.au.sendPasswordResetEmail(fb.auth,em);$('#sentEmail').textContent=em;showAuth('sent');}catch(err){authErr('reset',AUTH_ERR[err.code]||'Envoi impossible.');}
    busy(b,false,'Envoyer le lien');});
  $('#toReset').onclick=()=>showAuth('reset');
  $('#backLogin').onclick=()=>showAuth('login');
  $('#backLogin2').onclick=()=>showAuth('login');
  $$('.eye').forEach(b=>{b.innerHTML=IC.eye;b.onclick=()=>{const i=$('#'+b.dataset.eye),s=i.type==='password';i.type=s?'text':'password';b.innerHTML=s?IC.eyeOff:IC.eye;};});
  ['loginEmail','loginPass','resetEmail'].forEach(i=>$('#'+i).addEventListener('input',clearAuthErr));

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      if(!$('#appearanceModal').hidden)return $('#appearanceModal').hidden=true;
      if(!$('#newsModal').hidden)return $('#newsModal').hidden=true;
      if(!$('#drawer').hidden)return closeDrawer();
      if(ui.sel.size){ui.sel.clear();return render();}
      if(!$('#addForm').hidden)return $('#addForm').hidden=true;
    }
    if(typing()||e.metaKey||e.ctrlKey||e.altKey)return;
    if($('#app').hidden)return;
    if(e.key==='/'){e.preventDefault();$('#searchInput').focus();}
    if(e.key.toLowerCase()==='n'){e.preventDefault();$('#addToggle').click();}
    if(['1','2','3'].includes(e.key))setPref({view:{'1':'list','2':'board','3':'compact'}[e.key]});
  });
  window.addEventListener('scroll',()=>$('#topbar').classList.toggle('scrolled',scrollY>8),{passive:true});
  window.addEventListener('online',()=>{if(user){setSync('syncing');flushCloud();}});
  window.addEventListener('offline',()=>{if(user)setSync('offline');});
  window.addEventListener('pagehide',flushCloud);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flushCloud();});
  window.addEventListener('beforeprint',()=>{ui.printMode=true;render();});
  window.addEventListener('afterprint',()=>{ui.printMode=false;render();});
}

loadLocal();
applyAllPrefs(S.prefs);
$('#meetingDate').value=S.meetingDate;
$('#sortSelect').value=ui.sort; $('#prioFilter').value=ui.prio;
$('#newsDone').innerHTML=NEWS_DONE.map(([t,d])=>`<li><span><b>${esc(t)}</b> — ${esc(d)}</span></li>`).join('');
$('#newsNext').innerHTML=NEWS_NEXT.map(([t,d])=>`<li><span><b>${esc(t)}</b> — ${esc(d)}</span></li>`).join('');
if(localStorage.getItem(K.NEWS))$('#newsBtn').classList.add('seen');
syncAppearanceUI(); bind(); render();
$('#app').hidden=true; $('#authOverlay').hidden=false; showAuth('loading');
initFirebase().then(ok=>{ if(!ok)connectionFailed(); });
