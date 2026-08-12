/* ==========================================================================
   IEEE PRESIDENCY UNIVERSITY — EXPERIENCE ENGINE
   Vanilla JS. No external runtime dependency (works fully offline).
   ========================================================================== */
(function(){
"use strict";

/* ---------------------------------------------------------------------- */
/* DATA                                                                    */
/* ---------------------------------------------------------------------- */
const SECTION_META = [
  {label:'Intro'},{label:'Why IEEE'},{label:'Milestones'},{label:'Chapters'},
  {label:'Achievements'},{label:'Funding'},{label:'Travel'},{label:'Why Join'},{label:'Connect'}
];
const SECTION_DURATION = [14000,26000,26000,22000,30000,19000,20000,15000,19000]; // ms
const TRANSITIONS = ['t-iris','t-vert','t-stack','t-stack','t-zoom','t-slide','t-punch','t-iris'];
const TRANS_DUR = { 't-zoom':600,'t-punch':500,'t-slide':600,'t-vert':600,'t-iris':1100,'t-stack':550 };

const SOCIETIES = [
  {key:'socCas', name:'IEEE Circuits & Systems Society', abbr:'CAS'},
  {key:'socSps', name:'IEEE Signal Processing Society', abbr:'SPS'},
  {key:'socComsoc', name:'IEEE Communications Society', abbr:'ComSoc'},
  {key:'socCis', name:'IEEE Computational Intelligence Society', abbr:'CIS'},
  {key:'socNano', name:'IEEE Nanotechnology Council', abbr:'NANO'},
  {key:'socSensors', name:'IEEE Sensors Council', abbr:'Sensors'},
  {key:'socCeda', name:'IEEE Council on Electronic Design Automation', abbr:'CEDA'},
  {key:'socCtsoc', name:'IEEE Consumer Technology Society', abbr:'CTSoc'},
  {key:'socPels', name:'IEEE Power Electronics Society', abbr:'PELS'},
  {key:'socIes', name:'IEEE Industrial Electronics Society', abbr:'IES'}
];

const ACHIEVEMENTS = [
  {title:'Hackathon @ IIT-Delhi', loc:'New Delhi · January 2026', img:'ach1A', inset:'ach1B'},
  {title:'3rd Place — CAS Student Design Program', loc:'Asia Pacific Shortlist', img:'ach2A', inset:'ach2B'},
  {title:'2nd Prize — AI Autonomous Hackathon 2025', loc:'National Level · Vijayawada, AP', img:'ach3A', inset:'ach3B'},
  {title:'1st Place — IEEE I2CONECCT-2025', loc:'Mangaluru', img:'ach4A', inset:'ach4B'},
  {title:'Best Project Award — IEEE YESIST12 Prelims', loc:'Selected for Finals at Malaysia', img:'ach5A', inset:null},
  {title:'Top Positions — IEEE PELS & IES Event 2025', loc:'Presidency University', img:'ach6A', inset:'ach6B'}
];

const MILE_YEARS = ['2023','2023','2025','2023'];

/* ---------------------------------------------------------------------- */
/* STATE                                                                   */
/* ---------------------------------------------------------------------- */
const STATE = {
  current:0, playing:true, auto:true, speed:1, sound:false,
  transitioning:false, audioCtx:null
};
let activeTimers = [];

/* ---------------------------------------------------------------------- */
/* UTIL                                                                    */
/* ---------------------------------------------------------------------- */
const $  = (s,r)=> (r||document).querySelector(s);
const $$ = (s,r)=> Array.from((r||document).querySelectorAll(s));
const clamp = (v,a,b)=> Math.max(a,Math.min(b,v));

class PausableTimer{
  constructor(fn, delayMs){ this.fn=fn; this.remaining=delayMs; this.running=false; this.id=null; }
  start(){
    this.clear();
    this.running=true;
    this.startedAt=Date.now();
    const wait = Math.max(0, this.remaining/STATE.speed);
    this.id=setTimeout(()=>{ this.running=false; this.fn(); }, wait);
    return this;
  }
  pause(){
    if(!this.running) return;
    clearTimeout(this.id);
    const elapsedReal=(Date.now()-this.startedAt)*STATE.speed;
    this.remaining=Math.max(0,this.remaining-elapsedReal);
    this.running=false;
  }
  clear(){ if(this.id) clearTimeout(this.id); this.running=false; this.id=null; }
}
function registerTimer(fn,delay){ const t=new PausableTimer(fn,delay); activeTimers.push(t); return t; }
function clearAllTimers(){ activeTimers.forEach(t=>t.clear()); activeTimers=[]; }
function pauseAllTimers(){ activeTimers.forEach(t=>t.pause()); }
function resumeAllTimers(){ activeTimers.forEach(t=>t.start()); }

function announce(text){ const el=$('#liveRegion'); if(el) el.textContent=text; }

function playTone(freq,dur,type,vol){
  if(!STATE.sound) return;
  try{
    if(!STATE.audioCtx) STATE.audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    const ctx=STATE.audioCtx;
    const osc=ctx.createOscillator(), gain=ctx.createGain();
    osc.type=type||'sine'; osc.frequency.value=freq;
    gain.gain.setValueAtTime(0,ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol||0.05, ctx.currentTime+0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime+(dur||0.12));
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime+(dur||0.12)+0.02);
  }catch(e){ /* audio unavailable — fail silently */ }
}
function tick(){ playTone(720,0.05,'sine',0.035); }
function chime(){ playTone(523,0.09,'sine',0.045); setTimeout(()=>playTone(784,0.12,'sine',0.04),70); }

/* ---------------------------------------------------------------------- */
/* ASSET WIRING                                                            */
/* ---------------------------------------------------------------------- */
function wireAssets(){
  $$('[data-asset]').forEach(el=>{
    const key = el.getAttribute('data-asset');
    if(window.ASSETS && ASSETS[key]) el.src = ASSETS[key];
  });
}

/* ---------------------------------------------------------------------- */
/* BEAT SEQUENCER — drives per-section internal choreography               */
/* ---------------------------------------------------------------------- */
class BeatSequencer{
  constructor(opts){
    this.beats = opts.beats;          // array of elements with [data-beat]
    this.holds = opts.holds;          // array of ms, same length
    this.onChange = opts.onChange || null;
    this.loop = !!opts.loop;
    this.dotsWrap = opts.dots || null;
    this.prevBtn = opts.prev || null;
    this.nextBtn = opts.next || null;
    this.index = -1;
    this.timer = null;
    if(this.dotsWrap){
      this.dotsWrap.innerHTML = this.holds.map((_,i)=>`<button type="button" aria-label="Item ${i+1}"></button>`).join('');
      this.dots = $$('button', this.dotsWrap);
      this.dots.forEach((d,i)=> d.addEventListener('click', ()=>{ this.userGoTo(i); }));
    }
    if(this.prevBtn) this.prevBtn.addEventListener('click', ()=> this.userGoTo(this.index-1));
    if(this.nextBtn) this.nextBtn.addEventListener('click', ()=> this.userGoTo(this.index+1));
  }
  render(i){
    if(this.beats) this.beats.forEach(b=> b.classList.toggle('is-active', (+b.dataset.beat)===i));
    if(this.dots) this.dots.forEach((d,idx)=> d.classList.toggle('active', idx===i));
    if(this.onChange) this.onChange(i);
  }
  goTo(i){
    const n=this.holds.length;
    if(i<0) i = this.loop ? n-1 : 0;
    if(i>=n){ if(this.loop) i=0; else return; }
    this.index=i;
    this.render(i);
    this.scheduleNext();
  }
  userGoTo(i){
    this.goTo(clamp(i,0,this.holds.length-1));
    kickIdle();
  }
  scheduleNext(){
    if(this.timer) this.timer.clear();
    const n=this.holds.length;
    if(!this.loop && this.index>=n-1) return; // resting on final beat
    this.timer = registerTimer(()=> this.goTo(this.index+1), this.holds[this.index]);
    this.timer.start();
  }
  start(){ this.goTo(0); }
  toEnd(){ this.goTo(this.holds.length-1); }
  destroy(){ if(this.timer) this.timer.clear(); }
}

/* ---------------------------------------------------------------------- */
/* GEOMETRY HELPERS                                                        */
/* ---------------------------------------------------------------------- */
function seedIn(els, baseDelay, step){
  els.forEach(el=> el.classList.remove('seeded'));
  void document.body.offsetWidth; // reflow
  requestAnimationFrame(()=> requestAnimationFrame(()=>{
    els.forEach((el,i)=>{ el.style.setProperty('--d', ((baseDelay+i*step)/1000)+'s'); el.classList.add('seeded'); });
  }));
}

/* ---------------------------------------------------------------------- */
/* SCENE 0 — HERO                                                          */
/* ---------------------------------------------------------------------- */
const HeroScene = (()=>{
  let built=false, netEl;
  function build(){
    netEl = $('#heroNetwork');
    const W=1200,H=800, N=24;
    const pts=[];
    for(let i=0;i<N;i++){
      pts.push({x: 80+Math.random()*(W-160), y: 60+Math.random()*(H-220)});
    }
    let svg='';
    // edges: connect each point to its 2 nearest neighbours
    const edges=[];
    pts.forEach((p,i)=>{
      const dists = pts.map((q,j)=> j===i?Infinity:Math.hypot(p.x-q.x,p.y-q.y)).map((d,j)=>[d,j]);
      dists.sort((a,b)=>a[0]-b[0]);
      for(let k=0;k<2;k++){ const j=dists[k][1]; const key=i<j?i+'-'+j:j+'-'+i; if(!edges.includes(key)) edges.push(key); }
    });
    edges.forEach((key,idx)=>{
      const [i,j]=key.split('-').map(Number);
      const p=pts[i], q=pts[j];
      const len = Math.hypot(p.x-q.x,p.y-q.y);
      svg += `<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" style="--d:${(idx*0.035).toFixed(2)}s"/>`;
    });
    pts.forEach((p,i)=>{
      const r = 2.4+Math.random()*2.6;
      svg += `<circle cx="${p.x}" cy="${p.y}" r="${r.toFixed(1)}" style="--d:${(i*0.045).toFixed(2)}s;--dx:${(Math.random()*14-7).toFixed(1)}px;--dy:${(Math.random()*14-7).toFixed(1)}px"/>`;
    });
    netEl.innerHTML = svg;
    built=true;
  }
  function play(){
    if(!built) build();
    $$('circle,line', netEl).forEach(el=>el.classList.remove('seeded'));
    void netEl.offsetWidth;
    requestAnimationFrame(()=> requestAnimationFrame(()=>{
      $$('circle,line', netEl).forEach(el=> el.classList.add('seeded'));
    }));
    const beats = $$('#scene-0 .beat');
    beats.forEach(b=>b.classList.remove('is-active'));
    const schedule = [200,1000,3200,5200];
    schedule.forEach((t,i)=>{
      registerTimer(()=>{ beats[i].classList.add('is-active'); if(i>0) tick(); }, t).start();
    });
  }
  function enter(){ play(); }
  function leave(){ }
  function replay(){ play(); }
  function skip(){ $$('#scene-0 .beat').forEach(b=>b.classList.add('is-active')); }
  return {enter,leave,replay,skip};
})();

/* ---------------------------------------------------------------------- */
/* SCENE 1 — WHY IEEE                                                      */
/* ---------------------------------------------------------------------- */
const WhyScene = (()=>{
  let seq;
  function onChange(i){
    $('#whyEyebrow').classList.toggle('show', i>0);
    if(i===2){
      seedIn($$('#scene-1 [data-beat="2"] .why-card'), 0, 110);
      const path = $('#whyPath');
      $$('.node-lbl,.arrow', path).forEach((el,idx)=>{
        registerTimer(()=> el.classList.add('on'), 550+idx*260).start();
      });
    }
    if(i===3){
      seedIn($$('#scene-1 [data-beat="3"] .wwd-card'), 120, 90);
    }
  }
  function build(){
    const beats = $$('#scene-1 .beat');
    seq = new BeatSequencer({ beats, holds:[3500,5500,8500,8500], onChange });
  }
  function enter(){ if(!seq) build(); $('#whyEyebrow').classList.remove('show'); seq.start(); }
  function leave(){ if(seq) seq.destroy(); }
  function replay(){ enter(); }
  function skip(){ seq && seq.toEnd(); onChange(3); }
  return {enter,leave,replay,skip};
})();

/* ---------------------------------------------------------------------- */
/* SCENE 2 — MILESTONES                                                    */
/* ---------------------------------------------------------------------- */
const MilestoneScene = (()=>{
  let seq, builtStops=false;
  function buildStops(){
    const wrap=$('#mileStops');
    wrap.innerHTML = MILE_YEARS.map((y,i)=>`<div class="mile-stop" data-i="${i}"><span class="yr">${y}</span></div>`).join('');
    $$('.mile-stop', wrap).forEach(s=> s.addEventListener('click', ()=> seq.userGoTo(+s.dataset.i)));
    builtStops=true;
  }
  function onChange(i){
    const track = $('#mileTrack i');
    track.style.transform = `scaleX(${(i+1)/MILE_YEARS.length})`;
    $$('.mile-stop').forEach((s,idx)=>{
      s.classList.toggle('active', idx===i);
      s.classList.toggle('done', idx<i);
    });
  }
  function build(){
    if(!builtStops) buildStops();
    const beats = $$('#scene-2 .mile-card');
    seq = new BeatSequencer({
      beats, holds:[6500,6500,6500,6500], onChange,
      dots: $('#mileDots'), prev: $('[data-act="prev"]', $('#mileLocalNav')), next: $('[data-act="next"]', $('#mileLocalNav'))
    });
  }
  function enter(){ if(!seq) build(); $('#mileTrack i').style.transform='scaleX(0)'; seq.start(); }
  function leave(){ if(seq) seq.destroy(); }
  function replay(){ enter(); }
  function skip(){ seq && seq.toEnd(); }
  return {enter,leave,replay,skip};
})();

/* ---------------------------------------------------------------------- */
/* SCENE 3 — CHAPTERS & SOCIETIES                                          */
/* ---------------------------------------------------------------------- */
const ChaptersScene = (()=>{
  let built=false, cycleTimer=null, spotIndex=-1, nodes=[], lines=[];
  const W=1000,H=562,CX=500,CY=281,RX=402,RY=214;
  function build(){
    const svg=$('#chapSvg'); svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const nodesWrap=$('#chapNodes');
    let svgHtml='', nodesHtml='';
    SOCIETIES.forEach((s,i)=>{
      const ang = -Math.PI/2 + i*(2*Math.PI/SOCIETIES.length);
      const x = CX+RX*Math.cos(ang), y=CY+RY*Math.sin(ang);
      s._x=x; s._y=y;
      svgHtml += `<line class="chap-line" data-i="${i}" x1="${CX}" y1="${CY}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" style="--d:${(i*0.09).toFixed(2)}s"/>`;
      nodesHtml += `<div class="chap-node" data-i="${i}" style="left:${(x/W*100).toFixed(2)}%;top:${(y/H*100).toFixed(2)}%;--d:${(i*0.09+0.15).toFixed(2)}s">
        <img data-asset="${s.key}" alt="${s.name}">
        <span class="chap-tip">${s.abbr} — ${s.name}</span>
      </div>`;
    });
    svg.innerHTML = svgHtml;
    nodesWrap.innerHTML = nodesHtml;
    wireAssets();
    nodes = $$('.chap-node', nodesWrap);
    lines = $$('.chap-line', svg);
    nodes.forEach(n=> n.addEventListener('mouseenter', ()=> spotlight(+n.dataset.i, true)));
    nodes.forEach(n=> n.addEventListener('click', ()=> { spotlight(+n.dataset.i, true); kickIdle(); }));
    built=true;
  }
  function spotlight(i, manual){
    spotIndex=i;
    nodes.forEach(n=> n.classList.toggle('spot', +n.dataset.i===i));
    lines.forEach(l=> l.classList.toggle('spot', +l.dataset.i===i));
    if(manual && cycleTimer){ cycleTimer.clear(); scheduleCycle(2600); }
  }
  function scheduleCycle(delay){
    cycleTimer = registerTimer(()=>{ spotlight((spotIndex+1)%SOCIETIES.length); scheduleCycle(1700); }, delay);
    cycleTimer.start();
  }
  function play(){
    if(!built) build();
    nodes.forEach(n=>n.classList.remove('seeded'));
    lines.forEach(l=>l.classList.remove('seeded'));
    void $('#chapField').offsetWidth;
    requestAnimationFrame(()=> requestAnimationFrame(()=>{
      lines.forEach(l=>l.classList.add('seeded'));
      nodes.forEach(n=>n.classList.add('seeded'));
    }));
    nodes.forEach(n=>n.classList.remove('spot'));
    lines.forEach(l=>l.classList.remove('spot'));
    spotIndex=-1;
    if(cycleTimer) cycleTimer.clear();
    registerTimer(()=>{ spotlight(0); scheduleCycle(1700); }, 1900).start();
  }
  function enter(){ play(); }
  function leave(){ if(cycleTimer) cycleTimer.clear(); }
  function replay(){ play(); }
  function skip(){ nodes.forEach(n=>n.classList.add('seeded')); lines.forEach(l=>l.classList.add('seeded')); }
  return {enter,leave,replay,skip};
})();

/* ---------------------------------------------------------------------- */
/* SCENE 4 — ACHIEVEMENTS                                                  */
/* ---------------------------------------------------------------------- */
const AchievementsScene = (()=>{
  let built=false, cards=[], active=0, seq;
  function build(){
    const wrap=$('#achCarousel');
    wrap.innerHTML = ACHIEVEMENTS.map((a,i)=>`
      <div class="ach-card" data-i="${i}" data-pos="far">
        <img class="bg" data-asset="${a.img}" alt="">
        <div class="ach-scrim"></div>
        <div class="ach-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="5.4"/><path d="M8.7 3.2h6.6l2.8 6.5-4.3 2.1-1.8-1.9-1.8 1.9-4.3-2.1z"/></svg></div>
        ${a.inset?`<div class="ach-inset"><img data-asset="${a.inset}" alt=""></div>`:''}
        <div class="ach-info">
          <span class="ach-num">ACHIEVEMENT 0${i+1} / 0${ACHIEVEMENTS.length}</span>
          <h3>${a.title}</h3>
          <div class="loc">${a.loc}</div>
        </div>
      </div>`).join('');
    wireAssets();
    cards = $$('.ach-card', wrap);
    built=true;
  }
  function render(i){
    active=i;
    const n=cards.length;
    cards.forEach((c,idx)=>{
      let d = idx-i;
      if(d>n/2) d-=n; if(d<-n/2) d+=n;
      c.dataset.pos = Math.abs(d)<=2 ? String(d) : 'far';
    });
  }
  function build2(){
    if(!built) build();
    seq = new BeatSequencer({
      beats:null, holds:ACHIEVEMENTS.map(()=>4600), onChange:render, loop:true,
      dots:$('#achDots'), prev:$('[data-act="prev"]',$('#achLocalNav')), next:$('[data-act="next"]',$('#achLocalNav'))
    });
  }
  function enter(){ if(!seq) build2(); seq.start(); }
  function leave(){ if(seq) seq.destroy(); }
  function replay(){ enter(); }
  function skip(){ seq && seq.goTo(ACHIEVEMENTS.length-1); }
  return {enter,leave,replay,skip};
})();

/* ---------------------------------------------------------------------- */
/* SCENE 5 — FUNDING                                                       */
/* ---------------------------------------------------------------------- */
const FundingScene = (()=>{
  let seq, counterRAF=null;
  function runCounter(){
    const el=$('#fundCounter');
    const target=10000, start=performance.now(), dur=1400;
    function frame(ts){
      if(!STATE.playing){ counterRAF=requestAnimationFrame(frame); return; }
      const p=clamp((ts-start)/dur,0,1);
      const eased = 1-Math.pow(1-p,3);
      const val = Math.round(1000 + eased*(target-1000));
      el.textContent = '$'+val.toLocaleString('en-US');
      if(p<1) counterRAF=requestAnimationFrame(frame); else el.textContent='$1,000 – $10,000';
    }
    el.textContent='$1,000';
    counterRAF=requestAnimationFrame(frame);
  }
  function onChange(i){
    if(i===0){ registerTimer(()=> $('#fundFlow0').classList.add('on'), 900).start(); }
    if(i===1){ runCounter(); }
    if(i===2){ seedIn($$('#scene-5 [data-beat="2"] .stage-card'), 0, 140); }
  }
  function build(){
    const beats=$$('#scene-5 .beat');
    seq = new BeatSequencer({ beats, holds:[4500,6000,8500], onChange });
  }
  function enter(){ if(!seq) build(); $('#fundFlow0').classList.remove('on'); seq.start(); }
  function leave(){ if(seq) seq.destroy(); if(counterRAF) cancelAnimationFrame(counterRAF); }
  function replay(){ enter(); }
  function skip(){ seq && seq.toEnd(); $('#fundCounter').textContent='$1,000 – $10,000'; onChange(2); }
  return {enter,leave,replay,skip};
})();

/* ---------------------------------------------------------------------- */
/* SCENE 6 — TRAVEL                                                        */
/* ---------------------------------------------------------------------- */
const TravelScene = (()=>{
  let seq;
  function onChange(i){
    if(i===1) seedIn($$('#scene-6 [data-beat="1"] .example-chip'),0,100);
  }
  function build(){
    const beats=$$('#scene-6 .beat');
    seq = new BeatSequencer({
      beats, holds:[6000,6000,6000], onChange,
      dots:$('#travDots'), prev:$('[data-act="prev"]',$('#travLocalNav')), next:$('[data-act="next"]',$('#travLocalNav'))
    });
  }
  function enter(){ if(!seq) build(); seq.start(); }
  function leave(){ if(seq) seq.destroy(); }
  function replay(){ enter(); }
  function skip(){ seq && seq.toEnd(); }
  return {enter,leave,replay,skip};
})();

/* ---------------------------------------------------------------------- */
/* SCENE 7 — WHY JOIN (rapid fire)                                         */
/* ---------------------------------------------------------------------- */
const JoinScene = (()=>{
  let seq, particlesBuilt=false;
  function buildParticles(){
    const wrap=$('#joinParticles');
    let html='';
    for(let i=0;i<20;i++){
      const left = Math.random()*100, dur=6+Math.random()*7, delay=Math.random()*8;
      html += `<span style="left:${left.toFixed(1)}%;animation-duration:${dur.toFixed(1)}s;animation-delay:${delay.toFixed(1)}s"></span>`;
    }
    wrap.innerHTML = html;
    particlesBuilt=true;
  }
  function build(){
    if(!particlesBuilt) buildParticles();
    const beats=$$('#scene-7 .beat');
    seq = new BeatSequencer({ beats, holds:[1300,1300,1300,1300,1300,1300,2400,4800], onChange:(i)=>{ if(i<6) tick(); if(i===7) chime(); } });
  }
  function enter(){ if(!seq) build(); seq.start(); }
  function leave(){ if(seq) seq.destroy(); }
  function replay(){ enter(); }
  function skip(){ seq && seq.toEnd(); }
  return {enter,leave,replay,skip};
})();

/* ---------------------------------------------------------------------- */
/* SCENE 8 — CONNECT                                                       */
/* ---------------------------------------------------------------------- */
const ConnectScene = (()=>{
  let seq;
  function onChange(i){
    if(i===1){
      $$('.conn-flow span', document).forEach((s,idx)=>{
        registerTimer(()=> s.classList.add('on'), idx*380).start();
      });
    }
  }
  function build(){
    const beats=$$('#scene-8 .beat');
    seq = new BeatSequencer({ beats, holds:[3800,4400,10800], onChange });
  }
  function enter(){ if(!seq) build(); $$('.conn-flow span').forEach(s=>s.classList.remove('on')); seq.start(); }
  function leave(){ if(seq) seq.destroy(); }
  function replay(){ enter(); }
  function skip(){ seq && seq.toEnd(); onChange(1); }
  return {enter,leave,replay,skip};
})();

const SCENES = [HeroScene,WhyScene,MilestoneScene,ChaptersScene,AchievementsScene,FundingScene,TravelScene,JoinScene,ConnectScene];

/* ---------------------------------------------------------------------- */
/* PRESENTATION CONTROLLER                                                 */
/* ---------------------------------------------------------------------- */
const sceneEls = ()=> $$('.scene');
let progressSegs = [];
let sectionTimer = null;
let segRAF=null, segElapsed=0, segLastTs=null, segDuration=1;

function buildChrome(){
  // rail
  const railList = $('#railList');
  railList.innerHTML = SECTION_META.map((m,i)=>`
    <li class="rail-item" data-index="${i}">
      <span class="rail-label"><em>0${i+1}</em>${m.label}</span>
      <span class="rail-node"></span>
    </li>`).join('');
  $$('.rail-item', railList).forEach(li=> li.addEventListener('click', ()=> goTo(+li.dataset.index)));

  // progress bar segments
  const track = $('#progressTrack');
  track.innerHTML = SECTION_META.map((_,i)=>`<div class="progress-seg" data-index="${i}"><i></i></div>`).join('');
  progressSegs = $$('.progress-seg', track);
  progressSegs.forEach(seg=> seg.addEventListener('click', ()=> goTo(+seg.dataset.index)));

  // settings jump grid
  const jump = $('#jumpGrid');
  jump.innerHTML = SECTION_META.map((m,i)=>`<button class="jump-btn" type="button" data-index="${i}">0${i+1} ${m.label}</button>`).join('');
  $$('.jump-btn', jump).forEach(b=> b.addEventListener('click', ()=>{ goTo(+b.dataset.index); }));
}

function resetSegProgress(duration){ segElapsed=0; segLastTs=null; segDuration=duration; }
function segTick(ts){
  if(segLastTs==null) segLastTs=ts;
  const dt=ts-segLastTs; segLastTs=ts;
  if(STATE.playing && !STATE.transitioning) segElapsed += dt*STATE.speed;
  const p = clamp(segElapsed/segDuration,0,1);
  const el = progressSegs[STATE.current];
  if(el) el.style.setProperty('--p', p.toFixed(4));
  segRAF = requestAnimationFrame(segTick);
}

function updateChrome(){
  $('#counter').innerHTML = `<b>0${STATE.current+1}</b> / 09`;
  progressSegs.forEach((seg,i)=>{
    seg.classList.toggle('done', i<STATE.current);
    seg.classList.toggle('active', i===STATE.current);
    if(i>STATE.current) seg.style.setProperty('--p',0);
  });
  $$('.rail-item').forEach((li,i)=>{
    li.classList.toggle('active', i===STATE.current);
    li.classList.toggle('done', i<STATE.current);
  });
  $$('.jump-btn').forEach((b,i)=> b.classList.toggle('active', i===STATE.current));
  announce('Section '+(STATE.current+1)+' of 9: '+SECTION_META[STATE.current].label);
}

function setPlaying(v){
  STATE.playing=v;
  document.body.classList.toggle('is-paused', !v);
  $('#playPauseBtn .ic-play').style.display = v?'none':'';
  $('#playPauseBtn .ic-pause').style.display = v?'':'none';
  $('#playPauseBtn').setAttribute('aria-label', v?'Pause':'Play');
  if(v) resumeAllTimers(); else pauseAllTimers();
}
function setAuto(v){
  STATE.auto=v;
  $('#modeChip').setAttribute('data-auto', v);
  $('#modeChipLabel').textContent = v?'Auto Play':'Manual Mode';
  $('#autoSwitch').classList.toggle('on', v);
  $('#autoSwitch').setAttribute('aria-checked', v);
  if(v) scheduleSectionAdvance(); else if(sectionTimer) sectionTimer.clear();
}
function setSound(v){
  STATE.sound=v;
  $('#soundBtn .ic-sound').style.display = v?'':'none';
  $('#soundBtn .ic-mute').style.display = v?'none':'';
  $('#soundBtn').classList.toggle('on', v);
  $('#soundSwitch').classList.toggle('on', v);
  $('#soundSwitch').setAttribute('aria-checked', v);
}
function setReducedMotion(v){
  document.body.classList.toggle('reduce-motion', v);
  $('#motionSwitch').classList.toggle('on', v);
  $('#motionSwitch').setAttribute('aria-checked', v);
}
function setSpeed(v){
  pauseAllTimers();
  STATE.speed=v;
  $$('.speed-btn').forEach(b=> b.classList.toggle('active', parseFloat(b.dataset.speed)===v));
  if(STATE.playing) resumeAllTimers();
}

function scheduleSectionAdvance(){
  if(sectionTimer) sectionTimer.clear();
  if(!STATE.auto) return;
  if(STATE.current>=8) return; // last section: no auto-advance onward
  sectionTimer = registerTimer(()=> next(), SECTION_DURATION[STATE.current]);
  sectionTimer.start();
}

function goTo(newIndex){
  newIndex = clamp(newIndex,0,8);
  if(STATE.transitioning) return;
  if(newIndex===STATE.current){ SCENES[newIndex].replay(); resetSegProgress(SECTION_DURATION[newIndex]); scheduleSectionAdvance(); return; }
  STATE.transitioning=true;
  const oldI=STATE.current, els=sceneEls();
  const oldEl=els[oldI], newEl=els[newIndex];
  const cls = TRANSITIONS[Math.min(oldI,newIndex)];
  clearAllTimers();
  SCENES[oldI].leave();
  oldEl.classList.remove('is-active');
  oldEl.classList.add(cls,'is-leaving');
  newEl.classList.add(cls,'is-entering');
  const dur = TRANS_DUR[cls]||600;
  setTimeout(()=>{
    oldEl.classList.remove(cls,'is-leaving');
    newEl.classList.remove(cls,'is-entering');
    newEl.classList.add('is-active');
    STATE.current=newIndex;
    STATE.transitioning=false;
    updateChrome();
    resetSegProgress(SECTION_DURATION[newIndex]);
    SCENES[newIndex].enter();
    scheduleSectionAdvance();
  }, dur);
}
function next(){ goTo(STATE.current+1<=8?STATE.current+1:8); }
function prev(){ goTo(STATE.current-1>=0?STATE.current-1:0); }
function replaySection(){ clearAllTimers(); SCENES[STATE.current].replay(); resetSegProgress(SECTION_DURATION[STATE.current]); scheduleSectionAdvance(); kickIdle(); }
function skipSection(){ SCENES[STATE.current].skip(); kickIdle(); }
function restartAll(){ setAuto(true); if(!STATE.playing) setPlaying(true); STATE.current=0; goToHard(0); }
function goToHard(i){
  // force display of section i without transition (used for restart)
  const els=sceneEls();
  els.forEach((el,idx)=> el.classList.toggle('is-active', idx===i));
  STATE.current=i; updateChrome(); resetSegProgress(SECTION_DURATION[i]);
  clearAllTimers();
  SCENES[i].enter();
  scheduleSectionAdvance();
}

/* ---------------------------------------------------------------------- */
/* IDLE / CHROME VISIBILITY                                                */
/* ---------------------------------------------------------------------- */
let idleTimer=null;
function kickIdle(){
  document.body.classList.remove('chrome-hidden');
  if(idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(()=>{
    if(STATE.playing && !$('#settingsPanel').classList.contains('open')){
      document.body.classList.add('chrome-hidden');
    }
  }, 3200);
}

/* ---------------------------------------------------------------------- */
/* FULLSCREEN                                                              */
/* ---------------------------------------------------------------------- */
function toggleFullscreen(){
  const doc=document, el=document.documentElement;
  const isFs = doc.fullscreenElement||doc.webkitFullscreenElement;
  if(!isFs){
    const req = el.requestFullscreen||el.webkitRequestFullscreen;
    if(req) req.call(el).catch(()=>{});
  } else {
    const exit = doc.exitFullscreen||doc.webkitExitFullscreen;
    if(exit) exit.call(doc).catch ? exit.call(doc).catch(()=>{}) : exit.call(doc);
  }
}
function onFsChange(){
  const isFs = !!(document.fullscreenElement||document.webkitFullscreenElement);
  document.body.classList.toggle('is-fullscreen', isFs);
  $('#fsBtn .ic-expand').style.display = isFs?'none':'';
  $('#fsBtn .ic-compress').style.display = isFs?'':'none';
}

/* ---------------------------------------------------------------------- */
/* ACTION DISPATCH                                                         */
/* ---------------------------------------------------------------------- */
function handleAction(action){
  kickIdle();
  switch(action){
    case 'prev': prev(); break;
    case 'next': next(); break;
    case 'playpause': setPlaying(!STATE.playing); break;
    case 'replay': replaySection(); break;
    case 'skip': skipSection(); break;
    case 'sound': setSound(!STATE.sound); break;
    case 'settings': $('#settingsPanel').classList.toggle('open'); break;
    case 'fullscreen': toggleFullscreen(); break;
  }
}

/* ---------------------------------------------------------------------- */
/* INIT                                                                     */
/* ---------------------------------------------------------------------- */
function init(){
  wireAssets();
  buildChrome();

  $('#controlbar').addEventListener('click', e=>{
    const btn=e.target.closest('[data-action]');
    if(btn) handleAction(btn.dataset.action);
  });
  $('#heroExploreBtn').addEventListener('click', ()=>{ next(); });
  $('#replayAllBtn').addEventListener('click', ()=>{ restartAll(); });
  $('#presentBtn').addEventListener('click', ()=>{ toggleFullscreen(); if(!STATE.playing) setPlaying(true); });

  // settings toggles
  $('#autoSwitch').addEventListener('click', ()=> setAuto(!STATE.auto));
  $('#soundSwitch').addEventListener('click', ()=> setSound(!STATE.sound));
  $('#motionSwitch').addEventListener('click', ()=> setReducedMotion(!document.body.classList.contains('reduce-motion')));
  $$('.speed-btn').forEach(b=> b.addEventListener('click', ()=> setSpeed(parseFloat(b.dataset.speed))));
  document.addEventListener('click', e=>{
    const panel=$('#settingsPanel');
    if(panel.classList.contains('open') && !panel.contains(e.target) && !e.target.closest('[data-action="settings"]')){
      panel.classList.remove('open');
    }
  });

  // keyboard
  document.addEventListener('keydown', e=>{
    if(e.key===' '||e.code==='Space'){ e.preventDefault(); handleAction('playpause'); }
    else if(e.key==='ArrowRight'){ handleAction('next'); }
    else if(e.key==='ArrowLeft'){ handleAction('prev'); }
    else if(e.key==='r'||e.key==='R'){ handleAction('replay'); }
    else if(e.key==='f'||e.key==='F'){ handleAction('fullscreen'); }
    else if(e.key==='Escape'){ $('#settingsPanel').classList.remove('open'); }
  });

  // touch swipe
  let tsx=0,tsy=0;
  $('#stage').addEventListener('touchstart', e=>{ tsx=e.changedTouches[0].clientX; tsy=e.changedTouches[0].clientY; kickIdle(); }, {passive:true});
  $('#stage').addEventListener('touchend', e=>{
    const dx=e.changedTouches[0].clientX-tsx, dy=e.changedTouches[0].clientY-tsy;
    if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.4){ dx<0 ? next() : prev(); }
  }, {passive:true});

  // idle / activity
  ['mousemove','touchstart','click','keydown'].forEach(evt=> document.addEventListener(evt, kickIdle, {passive:true}));
  kickIdle();

  // fullscreen listeners
  document.addEventListener('fullscreenchange', onFsChange);
  document.addEventListener('webkitfullscreenchange', onFsChange);

  // reduced motion preference
  if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches){ setReducedMotion(true); }

  // initial UI state
  setSound(false);
  setAuto(true);
  updateChrome();
  segRAF = requestAnimationFrame(segTick);
  resetSegProgress(SECTION_DURATION[0]);

  // enter hero
  sceneEls()[0].classList.add('is-active');
  SCENES[0].enter();
  scheduleSectionAdvance();
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
else init();

})();