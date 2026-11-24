/* ═══════════════════════════════════════════════════════════════
   pwa.js  ·  Installation, service worker, hors ligne, badge, icônes
   Génère les PNG d'icônes (192/512/maskable/apple) puis publie un
   manifeste complet : aucun fichier binaire à versionner.
   ═══════════════════════════════════════════════════════════════ */
export const PWA_VERSION = '7';
const BASE = new URL('./', location.href);
const BADGE_KEY = 'reunionBadge';
const $ = s => document.querySelector(s);
const hide = (s,v) => { const el=$(s); if(el) el.hidden=!!v; };
const html = (s,h) => { const el=$(s); if(el) el.innerHTML=h; };
const txt = (s,v) => { const el=$(s); if(el) el.textContent=v; };

const IC = {
  down:'<svg class="ic" viewBox="0 0 24 24"><path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
  phone:'<svg class="ic" viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10.5 18.5h3"/></svg>',
  globe:'<svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18M3.5 9h17M3.5 15h17"/></svg>',
  sync:'<svg class="ic" viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 3v4h-4"/></svg>',
  check:'<svg class="ic" viewBox="0 0 24 24"><path d="m4.5 12.5 5 5 10-11"/></svg>',
  cloudOff:'<svg class="ic" viewBox="0 0 24 24"><path d="M17.5 19a4.5 4.5 0 0 0 .4-9A6 6 0 0 0 6.2 8.5 4.5 4.5 0 0 0 6.5 19z"/><path d="m4 4 16 16"/></svg>'
};

let hooks=null, reg=null, deferred=null, manifestUrl=null, reloading=false, updateShown=false;
let badgeOn = localStorage.getItem(BADGE_KEY)!=='0';
let lastBadge = -1, pendingIntent = null, lastUpdateCheck = 0;

const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.matchMedia('(display-mode: minimal-ui)').matches || navigator.standalone===true;

/* ── Icônes PNG dessinées à la volée ── */
function rr(g,x,y,w,h,r){
  g.beginPath();
  if(typeof g.roundRect==='function'){ g.roundRect(x,y,w,h,r); return; }
  r=Math.min(r,w/2,h/2);
  g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath();
}
function makeIcon(size,maskable=false){
  try{
    const cv=document.createElement('canvas'); cv.width=cv.height=size;
    const g=cv.getContext('2d'); if(!g) return null;
    const grad=g.createLinearGradient(0,0,size,size);
    grad.addColorStop(0,'#a8410f'); grad.addColorStop(.5,'#c96a1a'); grad.addColorStop(1,'#e8b34a');
    g.fillStyle=grad;
    if(maskable) g.fillRect(0,0,size,size);
    else { rr(g,0,0,size,size,size*.225); g.fill(); }
    const halo=g.createRadialGradient(size*.28,size*.22,0,size*.28,size*.22,size*.7);
    halo.addColorStop(0,'rgba(255,255,255,.22)'); halo.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle=halo;
    if(maskable) g.fillRect(0,0,size,size); else { rr(g,0,0,size,size,size*.225); g.fill(); }
    const s=size*(maskable?.58:.7), ox=(size-s)/2, oy=(size-s)/2;
    g.fillStyle='#fff8ef';
    const bh=s*.12, r=bh/2, gap=s*.245;
    [1,1,.6].forEach((w,i)=>{ rr(g,ox,oy+s*.15+i*gap,s*w,bh,r); g.fill(); });
    g.beginPath(); g.arc(ox+s*.81,oy+s*.15+2*gap+bh/2,bh*.66,0,Math.PI*2); g.fill();
    return cv.toDataURL('image/png');
  }catch{ return null; }
}
function buildManifest(){
  const p192=makeIcon(192), p512=makeIcon(512), mask=makeIcon(512,true), apple=makeIcon(180);
  if(apple){ const l=document.querySelector('link[rel="apple-touch-icon"]'); if(l) l.href=apple; }
  if(!p192||!p512) return;
  const abs=u=>new URL(u,BASE).href;
  const icons=[
    {src:p192,sizes:'192x192',type:'image/png',purpose:'any'},
    {src:p512,sizes:'512x512',type:'image/png',purpose:'any'},
    ...(mask?[{src:mask,sizes:'512x512',type:'image/png',purpose:'maskable'}]:[]),
    {src:abs('icons/icon.svg'),sizes:'any',type:'image/svg+xml',purpose:'any'}
  ];
  const shortIcon=[{src:p192,sizes:'192x192',type:'image/png'}];
  const manifest={
    id:BASE.href,
    name:'Suivi Réunion Prestataire — Geoparts',
    short_name:'Réunion Geoparts',
    description:'Ordre du jour, priorités, notes et discussions datées pour le suivi bimensuel du prestataire. Synchronisé et utilisable hors ligne.',
    lang:'fr', dir:'ltr',
    start_url:abs('?source=pwa'),
    scope:BASE.href,
    display:'standalone',
    display_override:['standalone','minimal-ui'],
    orientation:'any',
    background_color:'#f6ecdf',
    theme_color:'#bc5215',
    categories:['business','productivity','utilities'],
    icons,
    shortcuts:[
      {name:'Nouveau point',short_name:'Nouveau',description:'Ajouter un point à l’ordre du jour',url:abs('?action=new'),icons:shortIcon},
      {name:'Points urgents',short_name:'Urgences',description:'Priorité haute en tête',url:abs('?view=urgent'),icons:shortIcon},
      {name:'Vue Tableau',short_name:'Tableau',description:'Kanban par statut',url:abs('?view=board'),icons:shortIcon}
    ],
    share_target:{ action:abs('?share=1'), method:'GET', params:{title:'title',text:'text',url:'url'} },
    launch_handler:{client_mode:['navigate-existing','auto']},
    prefer_related_applications:false
  };
  try{
    if(manifestUrl) URL.revokeObjectURL(manifestUrl);
    manifestUrl=URL.createObjectURL(new Blob([JSON.stringify(manifest)],{type:'application/manifest+json'}));
    const link=document.querySelector('link[rel="manifest"]');
    if(link) link.href=manifestUrl;
  }catch{}
}

/* ── Badge d'icône ── */
function setBadge(n){
  const v=Math.max(0,+n||0);
  if(v===lastBadge) return; lastBadge=v;
  if(!badgeOn){ try{ navigator.clearAppBadge?.(); }catch{} return; }
  try{
    if('setAppBadge' in navigator){ v>0 ? navigator.setAppBadge(v) : navigator.clearAppBadge?.(); }
  }catch{}
}
function setThemeColor(hex){
  const m=document.querySelector('meta[name="theme-color"]');
  if(m&&hex) m.setAttribute('content',hex.trim());
}

/* ── Installation ── */
function installVisible(){
  const can = !!deferred || (isIOS() && !isStandalone());
  hide('#installBtn',!can); hide('#installBtnAuth',!can); hide('#pwaInstall',!can);
}
async function doInstall(){
  if(isIOS() && !deferred){ hide('#iosModal',false); return; }
  if(!deferred){ hooks?.toast('Installation déjà effectuée ou non proposée par ce navigateur.'); return; }
  try{
    deferred.prompt();
    const choice=await deferred.userChoice;
    if(choice?.outcome==='accepted') hooks?.toast('Installation lancée — retrouvez l’app sur votre appareil.');
    deferred=null; installVisible(); refreshPanel();
  }catch{ deferred=null; installVisible(); }
}

/* ── Mises à jour ── */
function showUpdate(){
  if(updateShown||!reg?.waiting) return; updateShown=true;
  hooks?.richToast({
    title:'Nouvelle version prête', sub:'Le cache a été mis à jour en arrière-plan.',
    icon:IC.sync, duration:14000, hint:'Vos données sont conservées · rechargement en un clic',
    actions:[{key:'later',label:'Plus tard',safe:true},{key:'go',label:'Recharger',kind:'go',icon:IC.check}],
    onClose:k=>{ updateShown=false; if(k==='go'){ try{ reg.waiting.postMessage({type:'SKIP_WAITING'}); }catch{ location.reload(); } } }
  });
}
async function checkUpdate(manual=false){
  if(!reg){ if(manual) hooks?.toast('Service worker indisponible sur ce navigateur.',{type:'err'}); return; }
  lastUpdateCheck=Date.now();
  try{
    await reg.update();
    if(reg.waiting) showUpdate();
    else if(manual) hooks?.toast(reg.installing?'Mise à jour en cours de téléchargement…':'Vous avez la dernière version.');
  }catch{ if(manual) hooks?.toast('Vérification impossible hors ligne.',{type:'err'}); }
  refreshPanel();
}

/* ── Panneau Application ── */
async function refreshPanel(){
  const st=$('#pwaState');
  if(st){
    if(isStandalone()){ st.className='pwa-state on'; st.innerHTML=IC.check+'<span>Installée · plein écran</span>'; }
    else if(deferred||isIOS()){ st.className='pwa-state ready'; st.innerHTML=IC.down+'<span>Prête à être installée</span>'; }
    else { st.className='pwa-state'; st.innerHTML=IC.globe+'<span>Ouverte dans le navigateur</span>'; }
  }
  txt('#pwaVersion','v'+PWA_VERSION);
  txt('#pwaOffline', reg?.active ? (navigator.onLine?'prêt · en ligne':'prêt · hors ligne') : 'en préparation');
  const badge=$('#pwaBadge'); if(badge) badge.checked=badgeOn;
  hide('#appBadge',!isStandalone());
  installVisible();
  try{
    const est=await navigator.storage?.estimate?.();
    if(est){
      const mb=n=>(n/1048576).toFixed(1)+' Mo';
      txt('#pwaStorage',`${mb(est.usage||0)} / ${mb(est.quota||0)}`);
      const m=$('#pwaMeter'); if(m) m.style.width=Math.min(100,((est.usage||0)/Math.max(1,est.quota||1))*100).toFixed(2)+'%';
    } else txt('#pwaStorage','non mesurable');
  }catch{ txt('#pwaStorage','non mesurable'); }
  try{
    const persisted=await navigator.storage?.persisted?.();
    const b=$('#pwaPersist');
    if(b){ b.textContent=persisted?'Stockage durable ✓':'Stockage durable'; b.disabled=!!persisted; }
  }catch{}
}
async function askPersist(){
  try{
    const ok=await navigator.storage?.persist?.();
    hooks?.toast(ok?'Stockage marqué durable : le navigateur ne l’évincera pas.':'Refusé par le navigateur — installez l’app pour renforcer la persistance.',{type:ok?'ok':'err'});
  }catch{ hooks?.toast('Fonction non disponible ici.',{type:'err'}); }
  refreshPanel();
}
function clearCache(){
  hooks?.richToast({
    title:'Vider le cache ?', sub:'Les fichiers seront retéléchargés. Vos points restent intacts.',
    confirm:true, duration:9000, hint:'Utile après une mise à jour récalcitrante',
    actions:[{key:'cancel',label:'Annuler',safe:true},{key:'ok',label:'Vider & recharger',kind:'ok'}],
    onClose:async k=>{
      if(k!=='ok')return;
      try{ reg?.active?.postMessage({type:'CLEAR_CACHES'}); }catch{}
      try{ const keys=await caches.keys(); await Promise.all(keys.map(k=>caches.delete(k))); }catch{}
      location.reload();
    }
  });
}

/* ── Connectivité ── */
function syncConnectivity(notify=false){
  const on=navigator.onLine;
  hide('#offlinePill',on);
  hooks?.onConnectivity?.(on);
  if(notify) hooks?.toast(on?'Connexion rétablie — synchronisation en cours.':'Hors ligne : vos modifications sont conservées et partiront au retour du réseau.',{type:on?'ok':'err',duration:5000});
  refreshPanel();
}

/* ── Intentions (raccourcis manifeste / partage) ── */
function readIntent(){
  const q=new URLSearchParams(location.search);
  const shared = q.has('share')||q.get('title')||q.get('text')||q.get('url');
  if(shared) pendingIntent={kind:'share',payload:{title:q.get('title')||'',text:q.get('text')||'',url:q.get('url')||''}};
  else if(q.get('action')==='new') pendingIntent={kind:'new'};
  else if(q.get('view')==='board') pendingIntent={kind:'board'};
  else if(q.get('view')==='urgent') pendingIntent={kind:'urgent'};
  if([...q.keys()].length){ try{ history.replaceState({},'',BASE.pathname); }catch{} }
}

/* ── Initialisation ── */
export function initPWA(h){
  hooks=h||{};
  buildManifest();
  readIntent();
  setThemeColor(getComputedStyle(document.documentElement).getPropertyValue('--surface'));
  syncConnectivity(false);

  window.addEventListener('beforeinstallprompt',e=>{ e.preventDefault(); deferred=e; installVisible(); refreshPanel(); });
  window.addEventListener('appinstalled',()=>{ deferred=null; installVisible(); refreshPanel(); hooks?.toast('Application installée. Lancez-la depuis votre écran d’accueil.'); });
  window.addEventListener('online',()=>syncConnectivity(true));
  window.addEventListener('offline',()=>syncConnectivity(true));
  try{ window.matchMedia('(display-mode: standalone)').addEventListener('change',()=>{ installVisible(); refreshPanel(); }); }catch{}

  ['#installBtn','#installBtnAuth','#pwaInstall'].forEach(s=>{ const el=$(s); if(el) el.addEventListener('click',doInstall); });
  const iosClose=$('#iosClose'); if(iosClose) iosClose.addEventListener('click',()=>hide('#iosModal',true));
  const iosModal=$('#iosModal'); if(iosModal) iosModal.addEventListener('click',e=>{ if(e.target.id==='iosModal') hide('#iosModal',true); });
  const up=$('#pwaUpdate'); if(up) up.addEventListener('click',()=>checkUpdate(true));
  const pe=$('#pwaPersist'); if(pe) pe.addEventListener('click',askPersist);
  const cl=$('#pwaClear'); if(cl) cl.addEventListener('click',clearCache);
  const bg=$('#pwaBadge'); if(bg) bg.addEventListener('change',e=>{
    badgeOn=e.target.checked;
    try{ localStorage.setItem(BADGE_KEY,badgeOn?'1':'0'); }catch{}
    lastBadge=-1; setBadge(hooks?.badgeCount?.()??0);
    hooks?.toast(badgeOn?'Badge activé sur l’icône de l’application.':'Badge désactivé.');
  });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape' && $('#iosModal') && !$('#iosModal').hidden) hide('#iosModal',true); });

  if('serviceWorker' in navigator){
    const start=async()=>{
      try{
        reg=await navigator.serviceWorker.register(new URL('sw.js',BASE).href,{scope:'./',updateViaCache:'none'});
        if(reg.waiting && navigator.serviceWorker.controller) showUpdate();
        reg.addEventListener('updatefound',()=>{
          const nw=reg.installing; if(!nw)return;
          nw.addEventListener('statechange',()=>{ if(nw.state==='installed' && navigator.serviceWorker.controller) showUpdate(); refreshPanel(); });
        });
        navigator.serviceWorker.addEventListener('controllerchange',()=>{ if(reloading)return; reloading=true; location.reload(); });
        navigator.serviceWorker.addEventListener('message',e=>{ if(e.data?.type==='SW_READY') refreshPanel(); });
        refreshPanel();
      }catch(err){ console.warn('SW non enregistré :',err); txt('#pwaOffline','indisponible'); }
    };
    if(document.readyState==='complete') start(); else window.addEventListener('load',start,{once:true});
    document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='visible' && Date.now()-lastUpdateCheck>900000) checkUpdate(false); });
    setInterval(()=>checkUpdate(false),1800000);
  } else txt('#pwaOffline','non supporté');

  refreshPanel();
  return {
    setBadge, setThemeColor, refreshPanel, checkUpdate,
    takeIntent(){ const i=pendingIntent; pendingIntent=null; return i; },
    version:PWA_VERSION, standalone:isStandalone
  };
}
