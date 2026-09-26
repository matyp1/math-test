// A self-contained title vignette. It never reads or changes puzzle/economy state.
export function introMarkup(brand, quip) {
  return `<section class="screen quip-intro" aria-labelledby="intro-title" data-phase="arrival" data-pose="neutral">
    <header class="intro-top"><span class="eyebrow">A LITTLE TROUBLE HAS ARRIVED.</span><button class="text-button" data-action="skip-intro">Skip intro →</button></header>
    <div class="intro-scene" aria-hidden="true">
      <div class="intro-halo"></div><div class="intro-logo">${brand()}</div>
      <div class="intro-shadow"></div><div class="intro-actor">${['neutral','thinking','point','celebrate'].map(p=>quip(p,`intro-pose pose-${p}`)).join('')}</div>
      <div class="intro-tiles">${['WORD','SLOP','SWAP'].map((w,i)=>`<span class="word intro-tile tile-${i}">${w}</span>`).join('')}</div>
      <div class="intro-puddle"></div><div class="intro-drops">${Array.from({length:7},(_,i)=>`<i style="--drop:${i}"></i>`).join('')}</div>
    </div>
    <p class="sr-only">Quip hops in, inspects three word tiles, flicks them into a messy pile and celebrates beneath the WORD slop swap logo.</p>
    <div class="intro-copy"><p class="eyebrow">MEET QUIP</p><h1 id="intro-title" tabindex="-1">Good words.<br><em>Bad influence.</em></h1><p>He makes the mess. You make sense of it.</p></div>
    <div class="intro-actions"><button class="button primary" data-action="start">Let’s swap <span>→</span></button><button class="text-button" data-action="replay-intro">Watch Quip again ↻</button></div>
  </section>`;
}

export function playIntro(root, reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const timers = [], animations = [];
  const animate = (selector, frames, options) => {
    const node = root.querySelector(selector);
    if (node?.animate) animations.push(node.animate(frames, {fill:'both', ...options}));
  };
  const phase = (name, pose) => { root.dataset.phase=name;root.dataset.pose=pose; };
  const later = (delay, fn) => timers.push(setTimeout(fn, delay));
  const finish = () => {phase('ready','celebrate');root.classList.add('intro-ready');};
  if (reducedMotion) {
    root.classList.add('intro-static');finish();
  } else {
    animate('.intro-actor', [
      {transform:'translate(-240px,30px) scale(1.1,.8)',opacity:0,offset:0},
      {transform:'translate(-105px,-65px) rotate(-12deg) scale(.92,1.08)',opacity:1,offset:.24},
      {transform:'translate(-48px,15px) rotate(4deg) scale(1.2,.78)',offset:.45},
      {transform:'translate(-48px,-14px) rotate(-3deg) scale(.96,1.04)',offset:.63},
      {transform:'translate(-48px,0) rotate(0) scale(1)',offset:1}
    ], {duration:1000,easing:'ease-out'});
    animate('.intro-shadow',[{transform:'translateX(-180px) scale(.3)',opacity:0},{transform:'translateX(-48px) scale(1)',opacity:.55}],{duration:1000});
    later(1050,()=>{phase('inspect','thinking');animate('.intro-actor',[{transform:'translateX(-48px) rotate(0)'},{transform:'translateX(-48px) rotate(-8deg)'},{transform:'translateX(-48px) rotate(2deg)'}],{duration:650,easing:'ease-in-out'});});
    later(1750,()=>{phase('flick','point');animate('.intro-actor',[{transform:'translateX(-48px) rotate(-6deg)'},{transform:'translate(18px,-15px) rotate(12deg) scale(1.08,.95)'},{transform:'translateX(0) rotate(-4deg) scale(1)'}],{duration:580,easing:'cubic-bezier(.2,.7,.3,1)'});});
    later(1980,()=>{
      const ends=[[-72,252,-16],[2,265,9],[76,250,-7]];
      ends.forEach(([x,y,r],i)=>animate(`.tile-${i}`,[{transform:`translate(${(i-1)*86}px,0) rotate(0)`},{transform:`translate(${x*.65}px,-75px) rotate(${r*3}deg)`,offset:.35},{transform:`translate(${x}px,${y+8}px) rotate(${r}deg) scale(1.1,.85)`,offset:.82},{transform:`translate(${x}px,${y}px) rotate(${r}deg) scale(1)`}],{duration:800+i*65,easing:'cubic-bezier(.3,.1,.6,1)'}));
      animate('.intro-puddle',[{transform:'scale(.2)',opacity:0},{transform:'scale(1.15,.8)',opacity:.65},{transform:'scale(1)',opacity:.45}],{delay:650,duration:480});
      root.querySelectorAll('.intro-drops i').forEach((el,i)=>animations.push(el.animate([{transform:'translate(0,0) scale(0)',opacity:0},{transform:`translate(${(i-3)*34}px,${-45-(i%3)*25}px) scale(1)`,opacity:.85,offset:.4},{transform:`translate(${(i-3)*40}px,20px) scale(.15)`,opacity:0}],{delay:650,duration:650,fill:'both',easing:'ease-out'})));
    });
    later(2940,()=>{phase('ta-da','celebrate');animate('.intro-actor',[{transform:'translate(0,8px) scale(1.12,.85)'},{transform:'translate(0,-42px) rotate(-5deg) scale(.92,1.08)',offset:.45},{transform:'translate(0,0) scale(1)',offset:1}],{duration:720,easing:'ease-out'});animate('.intro-logo',[{opacity:0,transform:'translateY(-24px) scale(.7) rotate(-8deg)'},{opacity:1,transform:'translateY(4px) scale(1.05) rotate(2deg)',offset:.7},{opacity:1,transform:'none'}],{duration:700,easing:'ease-out'});});
    later(3750,finish);
  }
  return () => {timers.forEach(clearTimeout);animations.forEach(a=>a.cancel());};
}
