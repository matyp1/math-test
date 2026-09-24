import { createBoard, restoreBoard, select, place, locate, returnToPool, wordAt, filledCount, submit } from './game-engine.mjs';
import { readProgress, writeProgress, rewardOnce, purchaseClue } from './state.mjs';

const app = document.querySelector('#app');
const announcement = document.querySelector('#announcement');
const helpDialog = document.querySelector('#helpDialog');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lockIcon = '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2M3 7h10v7H3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
const brand = (extra = '') => `<img class="brand ${extra}" src="assets/brand/word-slop-swap.webp" alt="WORD slop swap" width="300" height="200">`;
const quip = (pose = 'neutral', extra = '') => `<div class="quip quip-${pose} ${extra}" role="img" aria-label="Quip ${pose}"></div>`;
let storage;
try { storage = window.localStorage; } catch { storage = { getItem() { return null; }, setItem() { throw Error('Storage unavailable'); } }; }
let progress = readProgress(storage);
let level, tutorialPuzzles, boards;
let view = 'splash', mode = 'tutorial', feedback = '', wrong = false, lastReward = 0, collapsed = false, storageAvailable = true, lastFocused = null;

function announce(message) { announcement.textContent = message; }
function save() { progress.boards = boards; storageAvailable = writeProgress(storage, progress); }
function vibrate(ms = 8) { try { navigator.vibrate?.(ms); } catch {} }
function puzzles() { return mode === 'tutorial' ? tutorialPuzzles : level.puzzles; }
function board() { return boards[mode]; }
function stars() { return `<span class="stars" aria-label="${progress.stars} stars"><span aria-hidden="true">★</span> <b data-stars>${progress.stars}</b></span>`; }
function topbar() { return `<header class="topbar"><button class="icon-button" data-action="home" aria-label="Go home">‹</button>${brand('small')}${stars()}<button class="icon-button help-button" data-action="help" aria-label="How to play">?</button></header>`; }
function navigate(next) { view=next;feedback='';wrong=false;render();window.scrollTo({top:0,behavior:'instant'});app.querySelector('h1')?.focus({preventScroll:true}); }
function openGame(nextMode,replay=false) {
  mode=nextMode;
  if(replay){boards[mode]=createBoard(puzzles());if(mode==='tutorial'){progress.tutorialStarted=false;progress.tutorialBiteSelected=false;boards.tutorial.pool=['dental-courage:2','dental-courage:0'];}}
  board().selected=null;collapsed=false;save();navigate('game');
}
function tutorialInstruction() {
  if(!progress.tutorialStarted)return {title:'One tiny lesson.',text:'Learn the ropes with one slop. Then we’ll unleash all five.',pose:'explain',step:0};
  if(filledCount(board(),puzzles())===2)return {title:'You’re in control.',text:'All spaces are filled. Press CHECK THE SLOP when you’re ready.',pose:'point',step:3};
  if(board().selected)return {title:'Now tap where it belongs.',text:filledCount(board(),puzzles())===0?'Try the first empty space. THE stays locked in the middle.':'Tap the remaining space to place your word.',pose:'point',step:2};
  if(filledCount(board(),puzzles())===1)return {title:'One word to go.',text:'Lift the last word from the pile, then tap its space.',pose:'explain',step:2};
  return {title:'Tap a word to lift it.',text:'Start with BITE in the Slop Pile. Watch it glow lime.',pose:'point',step:1};
}
function splash() { return `<section class="screen splash">${brand('hero')}<h1 tabindex="-1">Unscramble<br>the <em>nonsense.</em></h1>${quip('neutral','hero-quip')}<p class="splash-copy">Familiar words. Fresh fun.</p><div class="splash-actions"><button class="button primary" data-action="start">${progress.tutorialComplete?'Keep swapping':'Start swapping'} <span>→</span></button><button class="button secondary" data-action="home">Home</button></div></section>`; }
function home() {
  const complete=progress.completedLevels.includes(level.id);
  return `<section class="screen home"><header class="home-header">${brand('home-brand')}${stars()}<button class="icon-button" data-action="help" aria-label="How to play">?</button></header><div class="home-greeting">${quip('explain')}<div><p class="eyebrow">READY FOR A LITTLE MESS?</p><h1 tabindex="-1">Good words.<br><em>Busy brain.</em></h1></div></div><button class="level-card" data-action="${complete?'replay-level':'level'}"><span class="eyebrow">LEVEL 1 · FIVE SLOPS</span><strong>${complete?'A clean sweep.':'One big, beautiful mess.'}</strong><span>Five familiar phrases. One shared word pile.</span><span class="level-card-bottom"><span class="five-dots">${[1,2,3,4,5].map(n=>`<i>${complete?'✓':n}</i>`).join('')}</span><b class="round-go">→</b></span><span class="card-foot">${complete?'Play again · reward already collected':filledCount(boards.level,level.puzzles)?'Continue where you left off':'Play Level 1'}</span></button><button class="tutorial-card" data-action="${progress.tutorialComplete?'replay-tutorial':'tutorial'}"><span class="tutorial-icon">1</span><span><strong>ONE SLOP</strong><small>${progress.tutorialComplete?'Replay the hands-on tutorial':'Learn to lift, place and check'}</small></span><b>→</b></button><div class="home-note"><span>★</span><p><strong>A nudge when you need it.</strong><br>Extra clues cost 1 star. Wrong guesses cost nothing.</p></div><p class="build-note">${complete?'Level 1 complete. More levels are being prepared.':'Take your time. The slop isn’t going anywhere.'}</p>${!storageAvailable?'<p class="storage-note">Your browser isn’t saving progress. Keep this tab open to keep playing.</p>':''}</section>`;
}
function laneMarkup(p,lane) {
  const b=board(),clueOwned=progress.clues.includes(p.id),tut=mode==='tutorial';
  const showTarget=tut&&b.selected===`${p.id}:0`&&!b.lanes[0][0];
  const slots=p.solution.map((_,slot)=>{
    const locked=slot===p.anchorIndex,id=b.lanes[lane][slot],word=wordAt(b,puzzles(),lane,slot),selected=id&&b.selected===id;
    return `<button class="word slot ${locked?'locked':word?'filled':'empty'} ${selected?'selected':''} ${showTarget&&slot===0?'target':''}" ${locked?'disabled':''} data-lane="${lane}" data-slot="${slot}" ${id?`data-token="${escape(id)}"`:''} data-focus="slot-${lane}-${slot}" aria-label="${p.baseHint}, space ${slot+1}: ${word||'empty'}${locked?', locked':''}" ${!locked&&word?`aria-pressed="${Boolean(selected)}"`:''}><span>${word||`<span class="space-number">${slot+1}</span>`}</span>${locked?`<span class="lock-mark">${lockIcon}<span class="sr-only">Locked</span></span>`:''}</button>`;
  }).join('');
  return `<article class="lane tone-${p.tone}" aria-labelledby="hint-${lane}"><div class="lane-heading"><span class="lane-icon" aria-hidden="true">${p.icon}</span><h2 id="hint-${lane}">${p.baseHint}</h2>${!tut?`<button class="clue-button ${clueOwned?'owned':''}" data-clue="${lane}" aria-label="${clueOwned?'Show clue':'Buy extra clue for 1 star'}: ${p.baseHint}">${clueOwned?'Clue ✓':'Clue <span>★ 1</span>'}</button>`:''}</div><div class="slots">${slots}</div>${clueOwned?`<p class="clue-text">${escape(p.extraClue)}</p>`:''}</article>`;
}
function poolMarkup() {
  const b=board(),selectedFrom=b.selected&&locate(b,b.selected),canReturn=selectedFrom&&!('poolIndex' in selectedFrom),tutorialLocked=mode==='tutorial'&&!progress.tutorialBiteSelected;
  return `<section class="pile ${collapsed?'collapsed':''}" aria-label="The Slop Pile"><div class="pile-heading"><div><h2><span aria-hidden="true">∞</span> THE SLOP PILE</h2><p>${b.selected?`<strong>${b.tokens[b.selected].word}</strong> lifted · tap a space`:'Tap a word, then tap a space.'}</p></div><button class="pile-toggle" data-action="toggle-pile" aria-expanded="${!collapsed}" aria-label="${collapsed?'Expand':'Collapse'} word pile"><b>${b.pool.length}</b><span>left ${collapsed?'⌃':'⌄'}</span></button></div><div class="pool-words" role="group" aria-label="Available words">${b.pool.map((id,index)=>`<button class="word pool-word ${b.selected===id?'selected':''} ${tutorialLocked&&b.tokens[id].word==='BITE'?'teach-word':''}" data-pool="${escape(id)}" data-token="${escape(id)}" data-focus="pool-${escape(id)}" aria-label="Lift ${b.tokens[id].word}" aria-pressed="${b.selected===id}" ${tutorialLocked&&b.tokens[id].word!=='BITE'?'disabled':''} style="--tilt:${((index%5)-2)*0.65}deg">${b.tokens[id].word}</button>`).join('')||'<p class="empty-pile">Every word has a home. Happy with them? Check the slop.</p>'}</div><div class="selection-tools">${canReturn?'<button class="text-button return-word" data-action="return">↙ Return to pile</button>':'<span>Words can move between any lanes.</span>'}${b.selected?'<button class="text-button" data-action="deselect">Deselect</button>':''}</div></section>`;
}
function game() {
  const tut=mode==='tutorial',instruction=tut?tutorialInstruction():{title:'Five slops. One big mess.',text:'Use the hints and locked words to rebuild all five.',pose:'thinking'},intro=tut&&!progress.tutorialStarted,filled=filledCount(board(),puzzles()),total=Object.keys(board().tokens).length;
  return `<section class="screen game ${tut?'tutorial':'five-slops'}">${topbar()}<div class="game-title"><div><p class="eyebrow">${tut?'LEARN THE ROPES':'LEVEL 1'}</p><h1 tabindex="-1">${tut?'ONE SLOP':'FIVE SLOPS'}</h1></div><span class="progress-badge">${tut?`${instruction.step||1} / 3`:`${filled} / ${total}`}<small>${tut?'TUTORIAL':'WORDS PLACED'}</small></span></div><div class="coach ${wrong?'wrong-feedback':''}">${quip(wrong?'react':instruction.pose)}<div class="speech"><strong>${wrong?'Still a little sloppy.':instruction.title}</strong><p>${escape(feedback||instruction.text)}</p></div></div>${intro?`<div class="tutorial-intro"><p>Start with <strong>BITE THE BULLET.</strong><br>THE is already in place. You do the rest.</p><p class="star-intro">★ You start with ${progress.stars} ${progress.stars===1?'star':'stars'}. Use stars for extra clues in Five Slops.</p><button class="button primary" data-action="begin-tutorial">Let’s go <span>→</span></button></div>`:`<div class="board-content"><div class="board-legend">${lockIcon}<span>Locked words stay put.</span>${!tut?'<span class="legend-right">5 phrases · one pile</span>':''}</div><div class="lanes" aria-label="${tut?'One phrase':'Five phrase lanes'}">${puzzles().map(laneMarkup).join('')}</div>${tut?`<div class="tutorial-instruction"><strong>${instruction.title}</strong><span>${filled===total?'Nothing submits until you press the button.':'Tap a placed word to move it again.'}</span></div>`:''}</div><div class="play-dock">${feedback?`<p class="dock-feedback">${escape(feedback)}</p>`:''}${poolMarkup()}<div class="check-row"><button class="button primary check ${filled===total?'ready':''}" data-action="check">CHECK THE SLOP <span>→</span></button><p>${tut?'You choose when your answer is ready.':'All five phrases must be correct. No penalties.'}</p></div></div>`}${!storageAvailable?'<p class="storage-note">Progress isn’t saving in this browser.</p>':''}</section>`;
}
function success() {
  const tut=mode==='tutorial';
  return `<section class="screen success">${topbar()}<div class="success-art"><span class="spark spark-one" aria-hidden="true">✦</span>${quip('celebrate')}<span class="spark spark-two" aria-hidden="true">★</span></div><p class="eyebrow">${tut?'ONE SLOP, SORTED.':'LEVEL 1 COMPLETE'}</p><h1 tabindex="-1">${tut?'Nice swap!':'Clean slop!'}</h1><p class="success-line">${tut?'You solved it. On your terms.':'Five messes. One very tidy brain.'}</p><div class="solved-phrases">${puzzles().map(p=>`<div class="solved-phrase"><span>${p.icon}</span><p>${p.solution.join(' ')}</p><b aria-label="Correct">✓</b></div>`).join('')}</div><div class="reward-card"><span class="reward-star">★</span><div><strong>${lastReward?'+1 star':'Already rewarded'}</strong><p>${lastReward?'First-time solve reward':'Same satisfaction. No extra stars.'}</p></div>${quip('success')}</div><div class="success-actions">${tut?'<p><strong>Same idea. Bigger mess.</strong><br>Five phrases share one pile. Move words anywhere.</p><button class="button primary" data-action="level">Unleash Five Slops <span>→</span></button>':'<button class="button primary" data-action="home">Back home <span>→</span></button><button class="button secondary" data-action="replay-level">Play Level 1 again</button><p class="build-note">Level 2 is unlocked. Its puzzles are still being prepared.</p>'}</div></section>`;
}
function render() {
  const focused=document.activeElement?.dataset.focus,previousScroll=app.querySelector('.pool-words')?.scrollTop||0;
  app.innerHTML=view==='splash'?splash():view==='home'?home():view==='success'?success():game();
  app.dataset.view=view;app.dataset.mode=mode;
  const pool=app.querySelector('.pool-words');if(pool)pool.scrollTop=previousScroll;
  if(focused)Array.from(app.querySelectorAll('[data-focus]')).find(el=>el.dataset.focus===focused)?.focus({preventScroll:true});
}
function tileRects(){return new Map(Array.from(app.querySelectorAll('[data-token]')).map(el=>[el.dataset.token,el.getBoundingClientRect()]));}
function moveAndRender(change){
  const before=tileRects(),changed=change();
  if(changed){feedback='';wrong=false;vibrate(12);}save();render();
  if(changed&&!matchMedia('(prefers-reduced-motion: reduce)').matches)for(const el of app.querySelectorAll('[data-token]')){
    const old=before.get(el.dataset.token),next=el.getBoundingClientRect();
    if(!old||(old.x===next.x&&old.y===next.y))continue;
    el.animate([{transform:`translate(${old.x-next.x}px,${old.y-next.y}px) scale(1.04)`,zIndex:40},{transform:'translate(0,0) scale(1)',zIndex:40}],{duration:220,easing:'cubic-bezier(.2,.85,.3,1.12)'});
  }
}
function check(){
  const result=submit(board(),puzzles());
  if(!result.complete){wrong=true;feedback='Not quite yet. Keep swapping—your words and stars stay put.';render();announce(feedback);return;}
  lastReward=rewardOnce(progress,mode==='tutorial'?'tutorial-one':level.id);
  if(mode==='tutorial')progress.tutorialComplete=true;
  else{if(!progress.completedLevels.includes(level.id))progress.completedLevels.push(level.id);progress.completedPuzzles=[...new Set([...progress.completedPuzzles,...level.puzzles.map(p=>p.id)])];progress.unlockedLevel=2;}
  board().selected=null;save();vibrate(25);navigate('success');announce(`Solved! ${lastReward?'One star earned.':'Reward already collected.'}`);
}
app.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button||button.disabled)return;
  const action=button.dataset.action;
  if(action==='start'){openGame(progress.tutorialComplete?'level':'tutorial');return;}
  if(action==='home'){navigate('home');return;}
  if(action==='help'){lastFocused=button;helpDialog.showModal();return;}
  if(action==='level'||action==='tutorial'){openGame(action);return;}
  if(action==='replay-level'||action==='replay-tutorial'){openGame(action.slice(7),true);return;}
  if(action==='begin-tutorial'){progress.tutorialStarted=true;save();render();return;}
  if(action==='toggle-pile'){collapsed=!collapsed;render();return;}
  if(action==='return'){moveAndRender(()=>returnToPool(board()));announce('Word returned to the Slop Pile.');return;}
  if(action==='deselect'){board().selected=null;render();return;}
  if(action==='check'){check();return;}
  if('pool' in button.dataset){const id=button.dataset.pool;if(mode==='tutorial'&&board().tokens[id].word==='BITE')progress.tutorialBiteSelected=true;select(board(),id);wrong=false;feedback='';vibrate();save();render();announce(board().selected?`${board().tokens[id].word} lifted. Tap its destination.`:'Selection cleared.');return;}
  if('lane' in button.dataset){const lane=+button.dataset.lane,slot=+button.dataset.slot;if(board().selected){moveAndRender(()=>place(board(),puzzles(),lane,slot));announce('Word placed. You can move it again.');}else if(board().lanes[lane][slot]){select(board(),board().lanes[lane][slot]);wrong=false;feedback='';vibrate();render();announce('Placed word lifted. Tap any destination or Return to pile.');}else{feedback='Lift a word from the Slop Pile first.';wrong=false;render();announce(feedback);}return;}
  if('clue' in button.dataset){const p=puzzles()[+button.dataset.clue],result=purchaseClue(progress,p.id);feedback=result==='insufficient'?'You need 1 star for an extra clue. Keep swapping—your base hints are always free.':result==='owned'?'That clue is yours. No extra stars spent.':'One star spent. Your extra clue is open beneath the phrase.';wrong=false;save();render();announce(feedback);}
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&view==='game'&&!helpDialog.open){board().selected=null;render();announce('Selection cleared.');}});
helpDialog.addEventListener('close',()=>lastFocused?.focus());
async function boot(){
  const response=await fetch(new URL('../data/level-01.json',import.meta.url));if(!response.ok)throw Error('Puzzle data could not be loaded');
  level=await response.json();tutorialPuzzles=[level.puzzles[0]];
  boards={tutorial:restoreBoard(progress.boards.tutorial,tutorialPuzzles),level:restoreBoard(progress.boards.level,level.puzzles)};
  if(!progress.boards.tutorial)boards.tutorial.pool=['dental-courage:2','dental-courage:0'];save();render();
}
boot().catch(()=>{app.innerHTML=`<section class="screen loading">${brand('hero')}<h1>The slop didn’t load.</h1><p>Please check your connection and try again.</p><button class="button primary" id="retry">Try again</button></section>`;document.querySelector('#retry').onclick=()=>location.reload();});
