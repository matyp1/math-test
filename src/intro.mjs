// A self-contained title vignette. It never reads or changes puzzle/economy state.
export function introMarkup(brand, quip) {
  return `<section class="screen quip-intro" aria-labelledby="intro-title" data-phase="arrival" data-pose="neutral">
    <header class="intro-top"><span class="eyebrow">A LITTLE TROUBLE HAS ARRIVED.</span><button class="text-button" data-action="skip-intro">Skip intro →</button></header>
    <div class="intro-scene" aria-hidden="true">
      <div class="intro-halo"></div><div class="intro-logo">${brand()}</div>
      <div class="intro-impact"></div><div class="intro-shadow"></div><div class="intro-actor">${['neutral','thinking','point','celebrate'].map(p=>quip(p,`intro-pose pose-${p}`)).join('')}</div>
      <div class="intro-tiles">${['WORD','SLOP','SWAP'].map((w,i)=>`<span class="word intro-tile tile-${i}">${w}</span>`).join('')}</div>
      <div class="intro-puddle"></div><div class="intro-drops">${Array.from({length:7},(_,i)=>`<i style="--drop:${i}"></i>`).join('')}</div>
    </div>
    <p class="sr-only">Quip hops in, inspects three word tiles, flicks them into a messy pile and celebrates beneath the WORD slop swap logo.</p>
    <div class="intro-copy"><p class="eyebrow">MEET QUIP</p><h1 id="intro-title" tabindex="-1">Good words.<br><em>Bad influence.</em></h1><p>He makes the mess. You make sense of it.</p></div>
    <div class="intro-actions"><button class="button primary" data-action="start">Let’s swap <span>→</span></button><button class="text-button" data-action="replay-intro">Watch Quip again ↻</button></div>
  </section>`;
}

// Sampled ballistic arcs preserve gravity; damped rebounds settle at contact.
export function hopFrames(fromX, toX, height, rotation=0) {
  return Array.from({length:31},(_,i)=>{
    const t=i/30,flight=Math.min(t/.72,1),landed=t>.72;
    const rebound=landed&&i<30?Math.sin((t-.72)/.28*Math.PI*3)*Math.exp(-(t-.72)*15):0;
    const x=fromX+(toX-fromX)*flight,y=landed?-Math.abs(rebound)*9:-4*height*flight*(1-flight);
    const squash=landed?rebound*.1:Math.sin(flight*Math.PI)*-.025;
    return {offset:t,transform:`translate(${x}px,${y}px) rotate(${rotation*Math.sin(flight*Math.PI)}deg) scale(${1+squash},${1-squash})`};
  });
}
export function playIntro(root, reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const timers=[],animations=[];
  const animate=(selector,frames,options={})=>{
    const node=typeof selector==='string'?root.querySelector(selector):selector;
    if(node?.animate)animations.push(node.animate(frames,{fill:'both',...options}));
  };
  const later=(delay,fn)=>timers.push(setTimeout(fn,delay));
  const phase=(name,pose)=>{root.dataset.phase=name;root.dataset.pose=pose;};
  const shadow=(from,to,height,duration)=>animate('.intro-shadow',Array.from({length:31},(_,i)=>{
    const t=Math.min(i/30/.72,1),altitude=4*t*(1-t),size=1-altitude*height/230;
    return {offset:i/30,transform:`translateX(${from+(to-from)*t}px) scale(${size})`,opacity:.56-altitude*.32,filter:`blur(${5+altitude*7}px)`};
  }),{duration});
  const impact=(x,delay=0)=>animate('.intro-impact',[
    {transform:`translateX(${x}px) scale(.15)`,opacity:0},
    {transform:`translateX(${x}px) scale(.5)`,opacity:.42,offset:.12},
    {transform:`translateX(${x}px) scale(1.4)`,opacity:0}
  ],{duration:560,delay,easing:'ease-out'});
  const finish=()=>{phase('ready','celebrate');root.classList.add('intro-ready');};
  if(reducedMotion){root.classList.add('intro-static');finish();}
  else {
    animate('.intro-actor',hopFrames(-240,-48,80,-10),{duration:1050});
    shadow(-240,-48,80,1050);impact(-48,756);
    later(1080,()=>{
      phase('inspect','thinking');
      animate('.intro-actor',[
        {transform:'translateX(-48px) rotate(0)'},
        {transform:'translate(-43px,2px) rotate(6deg) scale(1.02,.98)',offset:.5},
        {transform:'translateX(-48px) rotate(0)'}
      ],{duration:850,easing:'ease-in-out'});
    });
    later(1930,()=>{
      phase('wind-up','point');
      animate('.intro-actor',[
        {transform:'translateX(-48px)'},
        {transform:'translate(-60px,8px) rotate(-9deg) scale(1.055,.94)',offset:.42,easing:'cubic-bezier(.6,0,.8,.3)'},
        {transform:'translate(4px,-3px) rotate(10deg) scale(.98,1.02)',offset:.64},
        {transform:'translate(-3px,2px) rotate(-3deg)',offset:.83},
        {transform:'translate(0,0) rotate(0)'}
      ],{duration:920,easing:'ease-in-out'});
      animate('.intro-shadow',[{transform:'translateX(-48px)'},{transform:'translateX(-60px)',offset:.42},{transform:'translateX(4px)',offset:.64},{transform:'translateX(0)'}],{duration:920});
    });
    later(2480,()=>{
      phase('flick','point');
      const ends=[[-72,252,-16],[2,265,9],[76,250,-7]];
      ends.forEach(([x,y,r],i)=>{
        const duration=840+i*75,delay=i*35;
        const frames=Array.from({length:41},(_,j)=>{
          const t=j/40,u=Math.min(t/.8,1),fallY=-235*u+(y+235)*u*u;
          const bounce=t>.8?Math.sin((t-.8)/.2*Math.PI)*12:0;
          return {offset:t,transform:`translate(${(i-1)*86+(x-(i-1)*86)*u}px,${fallY-bounce}px) rotate(${r*u+Math.sin(u*Math.PI)*32}deg)`};
        });
        animate(`.tile-${i}`,frames,{duration,delay});
        impact(x,duration*.8+delay);
      });
      animate('.intro-puddle',[{transform:'scale(.4)',opacity:0},{transform:'scale(1.1,.75)',opacity:.5,offset:.35},{transform:'scale(1)',opacity:.35}],{delay:680,duration:650});
      root.querySelectorAll('.intro-drops i').forEach((el,i)=>{
        const vx=(i-3)*34,height=24+(i%3)*18;
        animate(el,Array.from({length:21},(_,j)=>{
          const t=j/20;return{offset:t,transform:`translate(${vx*t}px,${-4*height*t*(1-t)}px) rotate(${t*120}deg) scale(${1-t*.65})`,opacity:Math.sin(Math.PI*t)*.75};
        }),{delay:680+i*18,duration:450+i*25});
      });
    });
    later(3630,()=>{
      phase('ta-da','celebrate');
      animate('.intro-actor',[
        {transform:'translateY(0)'},
        {transform:'translateY(5px) scale(1.05,.95)'}
      ],{duration:180,easing:'ease-in'});
    });
    later(3810,()=>{
      animate('.intro-actor',hopFrames(0,0,32,-4),{duration:900});shadow(0,0,32,900);impact(0,648);
      animate('.intro-logo',[{opacity:0,transform:'translateY(-12px) scale(.93)'},{opacity:1,transform:'translateY(2px) scale(1.01)',offset:.75},{opacity:1,transform:'none'}],{duration:700,easing:'ease-out'});
    });
    later(4740,()=>{
      finish();
      animate('.intro-actor',[{transform:'scale(1)'},{transform:'scale(1.008,.99)',offset:.5},{transform:'scale(1)'}],{duration:3400,iterations:Infinity,easing:'ease-in-out'});
    });
  }
  return()=>{timers.forEach(clearTimeout);animations.forEach(a=>a.cancel());};
}
