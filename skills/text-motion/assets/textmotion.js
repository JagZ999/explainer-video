/* ===================================================================
   text-motion.js — helpers for the textmotion.css building blocks.
   Every time-driven effect takes a LOGICAL time `t` (seconds) so it stays
   correct under slow-clock rendering. Call the per-frame updaters from your
   render loop / rAF tick, keyed off your own clock — never wall-clock.
   =================================================================== */

/* clamp helper */
const _cl = (x,a,b)=>Math.max(a,Math.min(b,x));

/* --- word-rise: split an element's text into .tm-word spans --------
   Preserves inline markup (a colored/gradient/keyword <span>) as one unit. */
function tmSplit(el, html){
  el.innerHTML = (html ?? el.innerHTML).trim()
    .split(/(\s+)/).map(tok => /^\s+$/.test(tok) ? tok
      : (tok.startsWith('<') ? tok : `<span class="tm-word">${tok}</span>`)).join('');
}
/* reveal words up to logical time; t0..t1 spans the whole line */
function tmReveal(el, t0, t1, t){
  const ws = el.querySelectorAll('.tm-word'); const p=_cl((t-t0)/(t1-t0),0,1);
  const n = Math.floor(p*ws.length + 1e-3);
  ws.forEach((w,i)=>w.classList.toggle('on', i<n));
}

/* --- scramble-decode: text resolves out of random glyphs -----------
   finalHTML lets you swap to markup (e.g. a colored <em>) once decoded. */
const _GLY = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>%#";
function tmScramble(el, plain, t0, t1, t, finalHTML){
  const p=_cl((t-t0)/(t1-t0),0,1);
  if(p>=1){ if(el.dataset.tmDone!=='1'){ el.innerHTML=finalHTML??plain; el.dataset.tmDone='1'; } return; }
  el.dataset.tmDone='0';
  const n=Math.floor(p*plain.length); let out='';
  for(let i=0;i<plain.length;i++) out += i<n ? plain[i] : (plain[i]===' '?' ':_GLY[(Math.random()*_GLY.length)|0]);
  el.textContent=out;
}

/* --- keyword sweep: fire the highlight bar + lit state at a cue ----- */
function tmSweep(el, at, t){ const on=t>=at; el.classList.toggle('sweep',on); el.classList.toggle('lit',t>=at+0.35); }

/* --- ticker-roll: <span class="tm-ticker"><span class="tm-roll">…i…</span></span>
   holdFirst = seconds the first word stays before rolling; step = per-word secs */
function tmTicker(roll, t0, t, {holdFirst=1.4, step=0.85}={}){
  const items=roll.children; const n=items.length;
  let k = t < t0+holdFirst ? 0 : Math.min(n-1, 1+Math.floor((t-t0-holdFirst)/step));
  roll.style.transform = `translateY(${-k*1.15}em)`;
  const w = roll.parentElement; if(roll.dataset.w!==String(k)){ roll.dataset.w=String(k);
    w.style.width = items[k].getBoundingClientRect().width+'px'; }
}

/* --- living gradient: apply a scene's palette (color arc) ----------
   grad = {ga,gb,b1,b2,b3}; smooth CSS transition handles the blend. */
function tmGrad(gradbgEl, grad){ const s=gradbgEl.style;
  for(const k of ['ga','gb','b1','b2','b3']) if(grad[k]) s.setProperty('--'+k, grad[k]); }
/* drift the blobs by logical time (cheap transforms, no blur) */
function tmDrift(root, t){
  const b=root.querySelectorAll('.tm-blob'); if(!b.length) return;
  if(b[0]) b[0].style.transform=`translate(${18+Math.sin(t*0.06)*10}%, ${6+Math.cos(t*0.05)*7}%)`;
  if(b[1]) b[1].style.transform=`translate(${52+Math.cos(t*0.045)*11}%, ${40+Math.sin(t*0.055)*8}%)`;
  if(b[2]) b[2].style.transform=`translate(${34+Math.sin(t*0.035+2)*13}%, ${18+Math.cos(t*0.04+1)*9}%)`;
}

/* --- concentric ripple rings: build N rings sized to the frame ----- */
function tmRings(host, n=4, maxPct=180){ host.innerHTML='';
  for(let i=0;i<n;i++){ const r=document.createElement('i');
    r.style.width=r.style.height=maxPct+'%'; r.style.animationDelay=(i/n*6)+'s'; host.appendChild(r); } }

/* --- oversized demo cursor path: pts=[[t,xPct,yPct,click?],…] ------ */
function tmCursor(el, pts, t){
  let cur=null; for(const p of pts) if(t>=p[0]) cur=p;
  if(!cur){ el.style.opacity=0; return; }
  el.style.opacity=1; el.style.left=cur[1]+'%'; el.style.top=cur[2]+'%';
}

/* --- keyword punch (scale-pop) ------------------------------------- */
function tmPunch(el, at, t){ el.classList.toggle('pop', t>=at); }

/* ===================================================================
   THE PLATTER — helpers for the added recipes (see PLATTER.md).
   All time-driven; pass LOGICAL time t. No filter:blur anywhere.
   =================================================================== */

/* A7 · Motion-Blur Slide — reveal .tm-blurin words up to time (like tmReveal) */
function tmBlurIn(el, t0, t1, t){ const ws=el.querySelectorAll('.tm-blurin');
  const p=_cl((t-t0)/(t1-t0),0,1), n=Math.floor(p*ws.length+1e-3);
  ws.forEach((w,i)=>w.classList.toggle('on', i<n)); }

/* B2 · Mesh Wash — glide the soft light-sweep across the frame by logical time */
function tmMesh(el, t){ if(!el) return;
  el.style.transform=`translate(${Math.sin(t*0.08)*12}%, ${Math.cos(t*0.06)*8}%) rotate(${Math.sin(t*0.03)*6}deg)`; }

/* B5 · Neon Path Travellers — move dot(s) along an SVG <path>; pts=[{el,speed,off}] */
function tmTravel(pathEl, dots, t){ if(!pathEl||!pathEl.getTotalLength) return;
  const L=pathEl.getTotalLength();
  dots.forEach(d=>{ const u=((t*(d.speed||0.12)+(d.off||0))%1+1)%1; const pt=pathEl.getPointAtLength(u*L);
    d.el.setAttribute('cx',pt.x); d.el.setAttribute('cy',pt.y); }); }

/* C2 · Floating Rings (Bokeh) — build N rings at varied size/depth, then drift */
function tmBokeh(host, specs){ host.innerHTML='';
  specs.forEach(s=>{ const i=document.createElement('i'); if(s.soft)i.className='soft';
    i.style.width=i.style.height=s.d+'%'; i.dataset.x=s.x; i.dataset.y=s.y; i.dataset.sp=s.sp||0.04;
    host.appendChild(i); }); }
function tmBokehDrift(host, t){ host.querySelectorAll('i').forEach((i,k)=>{ const sp=+i.dataset.sp;
  i.style.transform=`translate(${(+i.dataset.x)+Math.sin(t*sp+k)*6}%, ${(+i.dataset.y)+Math.cos(t*sp*0.9+k)*7}%)`; }); }

/* C3 · Orb Bloom — fire the small-ring→big-glow bloom at a cue */
function tmOrb(el, at, t){ if(!el) return; el.classList.toggle('bloom', t>=at); }

/* C4 · Converge — pull scattered nodes toward a focal point over t0..t1.
   nodes=[{el,fromX,fromY,toX,toY}] in %; sets transform each frame. */
function tmConverge(nodes, t0, t1, t){ const p=_cl((t-t0)/(t1-t0),0,1), e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
  nodes.forEach(n=>{ const x=n.fromX+(n.toX-n.fromX)*e, y=n.fromY+(n.toY-n.fromY)*e;
    n.el.style.transform=`translate(${x}%, ${y}%)`; }); }

/* C5 · Metaball Merge — fire the two-circles-fuse bridge at a cue */
function tmMeta(el, at, t){ if(!el) return; el.classList.toggle('merged', t>=at); }

/* D4 · Glass Card Float — gentle parallax tilt by logical time */
function tmFloat(el, t, amp=6){ if(!el) return;
  el.style.transform=`perspective(1400px) rotateX(${Math.sin(t*0.5)*amp*0.4}deg) rotateY(${Math.cos(t*0.4)*amp}deg) translateY(${Math.sin(t*0.6)*1.5}%)`; }

/* E1/E2 · Integrations Orbit — place icons on a ring (or scatter), reveal + spokes.
   icons=[{el,spokeEl}]; radiusPct; reveal staggered from t0. scatter=jitter for constellation. */
function tmOrbit(icons, cx, cy, radius, t0, t, {scatter=0, step=0.12}={}){
  const n=icons.length;
  icons.forEach((ic,k)=>{ const ang=(k/n)*Math.PI*2 - Math.PI/2;
    const jit = scatter ? (Math.sin(k*12.9)*scatter) : 0;
    const r = radius + jit;
    const x = cx + Math.cos(ang)*r, y = cy + Math.sin(ang)*r*1.0;
    ic.el.style.left=x+'%'; ic.el.style.top=y+'%'; ic.el.style.transform='translate(-50%,-50%)';
    const on = t >= t0 + k*step; ic.el.classList.toggle('on', on);
    if(ic.spokeEl){ ic.spokeEl.style.width=r+'%';
      ic.spokeEl.style.transform=`rotate(${ang}rad)`; ic.spokeEl.classList.toggle('on', on); }
  }); }

/* G3 · Counter-Tick — roll a number up to its value over t0..t1 (odometer) */
function tmCount(el, to, t0, t1, t, {prefix='',suffix='',decimals=0}={}){ if(!el) return;
  const p=_cl((t-t0)/(t1-t0),0,1), e=1-Math.pow(1-p,3); const val=to*e;
  el.textContent = prefix + val.toLocaleString(undefined,{minimumFractionDigits:decimals,maximumFractionDigits:decimals}) + suffix; }

/* G2/C8 · Line-Draw — measure a path's length into --len, then toggle .drawn at a cue */
function tmDrawInit(svgEl){ svgEl.querySelectorAll('path,line,polyline').forEach(p=>{
  try{ p.style.setProperty('--len', Math.ceil(p.getTotalLength?p.getTotalLength():1000)); }catch(e){} }); }
function tmDraw(svgEl, at, t){ if(!svgEl) return; svgEl.classList.toggle('drawn', t>=at); }

/* B6 · Starfield — build N twinkling stars (deterministic; no Math.random for capture stability) */
function tmStars(host, n){ host.innerHTML='';
  for(let i=0;i<n;i++){ const s=document.createElement('i');
    const x=(Math.sin(i*12.9898)*43758.5453)%1, y=(Math.sin(i*78.233)*12543.123)%1;
    s.style.left=(Math.abs(x)*100).toFixed(2)+'%'; s.style.top=(Math.abs(y)*100).toFixed(2)+'%';
    s.style.animationDuration='calc('+(2+Math.abs(x)*4).toFixed(2)+'s * var(--R))';
    host.appendChild(s); } }

/* G8 · Timeline Scrubber — slide the playhead across a [t0..t1] window to fraction 0..1 */
function tmScrub(headEl, t0, t1, t){ if(!headEl) return; headEl.style.left=(_cl((t-t0)/(t1-t0),0,1)*100)+'%'; }

if (typeof module!=='undefined') module.exports = {
  tmSplit,tmReveal,tmScramble,tmSweep,tmTicker,tmGrad,tmDrift,tmRings,tmCursor,tmPunch,
  tmBlurIn,tmMesh,tmTravel,tmBokeh,tmBokehDrift,tmOrb,tmConverge,tmMeta,tmFloat,tmOrbit,
  tmCount,tmDrawInit,tmDraw,tmStars,tmScrub };
