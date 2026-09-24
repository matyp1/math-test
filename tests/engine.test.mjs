import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createBoard, select, place, returnToPool, wordAt, submit, restoreBoard } from '../src/game-engine.mjs';
import { freshProgress, rewardOnce, purchaseClue, readProgress, writeProgress, STORAGE_KEY } from '../src/state.mjs';
const level=JSON.parse(await readFile(new URL('../data/level-01.json',import.meta.url)));
const puzzles=level.puzzles;
function solve(b,ps){for(let lane=0;lane<ps.length;lane++)for(let slot=0;slot<ps[lane].solution.length;slot++){if(slot===ps[lane].anchorIndex)continue;select(b,`${ps[lane].id}:${slot}`);place(b,ps,lane,slot);}}
function memory(){const m=new Map();return{getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};}
test('canonical Level 1 has exactly the five required phrases and 18 shared tokens',()=>{
 assert.deepEqual(puzzles.map(p=>p.solution.join(' ')),['BITE THE BULLET','ACTIONS SPEAK LOUDER THAN WORDS','BETTER LATE THAN NEVER','WHAT HAS HANDS BUT CANNOT CLAP','A WATCHED POT NEVER BOILS']);
 const b=createBoard(puzzles);assert.equal(b.pool.length,18);assert.equal(new Set(b.pool).size,18);assert.equal(b.lanes.length,5);
 for(const [i,p]of puzzles.entries())assert.equal(wordAt(b,puzzles,i,p.anchorIndex),p.anchorWord);
});
test('tutorial uses the same engine; selecting and placing does not add completion state',()=>{
 const ps=[puzzles[0]],b=createBoard(ps);select(b,'dental-courage:0');assert.equal(b.selected,'dental-courage:0');place(b,ps,0,0);select(b,'dental-courage:2');place(b,ps,0,2);
 assert.equal('complete' in b,false);assert.deepEqual(submit(b,ps),{complete:true});
});
test('a wrong tutorial submission preserves every field',()=>{
 const ps=[puzzles[0]],b=createBoard(ps);select(b,'dental-courage:2');place(b,ps,0,0);select(b,'dental-courage:0');place(b,ps,0,2);const before=JSON.stringify(b);assert.equal(submit(b,ps).complete,false);assert.equal(JSON.stringify(b),before);
});
test('locked words cannot be selected or overwritten',()=>{
 const b=createBoard(puzzles);assert.equal(select(b,'dental-courage:1'),false);select(b,'dental-courage:0');const before=JSON.stringify(b);assert.equal(place(b,puzzles,0,1),false);assert.equal(JSON.stringify(b),before);
});
test('words move pool to lane, between lanes, to occupied slots and back to pool',()=>{
 const b=createBoard(puzzles);select(b,'dental-courage:0');place(b,puzzles,0,0);select(b,'dental-courage:0');place(b,puzzles,2,0);assert.equal(wordAt(b,puzzles,2,0),'BITE');assert.equal(wordAt(b,puzzles,0,0),null);
 select(b,'louder-hands:0');place(b,puzzles,0,0);select(b,'dental-courage:0');place(b,puzzles,0,0);assert.equal(wordAt(b,puzzles,2,0),'ACTIONS');assert.equal(wordAt(b,puzzles,0,0),'BITE');
 select(b,'dental-courage:2');place(b,puzzles,0,0);assert.ok(b.pool.includes('dental-courage:0'));select(b,'dental-courage:2');assert.equal(returnToPool(b),true);assert.equal(wordAt(b,puzzles,0,0),null);
 const ids=[...b.pool,...b.lanes.flat().filter(Boolean)];assert.equal(ids.length,18);assert.equal(new Set(ids).size,18);
});
test('tapping selected token deselects it',()=>{const b=createBoard(puzzles);select(b,b.pool[0]);select(b,b.pool[0]);assert.equal(b.selected,null);});
test('all five are required, wrong full board preserved, and equal words interchangeable',()=>{
 const b=createBoard(puzzles);solve(b,puzzles);select(b,'fashionably-late:2');place(b,puzzles,1,3);assert.equal(submit(b,puzzles).complete,true);
 select(b,'dental-courage:0');place(b,puzzles,0,2);const before=JSON.stringify(b);assert.equal(submit(b,puzzles).complete,false);assert.equal(JSON.stringify(b),before);
 select(b,'dental-courage:0');place(b,puzzles,0,0);assert.equal(submit(b,puzzles).complete,true);
});
test('18 correct placements alone never mutate progression or stars',()=>{const b=createBoard(puzzles),p=freshProgress(),before=JSON.stringify(p);solve(b,puzzles);assert.equal(JSON.stringify(p),before);assert.equal('complete' in b,false);});
test('starting balance, clue costs, owned clues and insufficient balance',()=>{
 const p=freshProgress();assert.equal(p.stars,1);assert.equal(purchaseClue(p,'clock'),'purchased');assert.equal(p.stars,0);assert.equal(purchaseClue(p,'clock'),'owned');assert.equal(p.stars,0);assert.equal(purchaseClue(p,'louder-hands'),'insufficient');assert.deepEqual(p.clues,['clock']);
});
test('first-time tutorial and level rewards cannot be farmed',()=>{const p=freshProgress();assert.equal(rewardOnce(p,'tutorial-one'),1);assert.equal(rewardOnce(p,'tutorial-one'),0);assert.equal(rewardOnce(p,'level-01'),1);assert.equal(rewardOnce(p,'level-01'),0);assert.equal(p.stars,3);});
test('progress, clues, board, rewards and tutorial survive persistence',()=>{
 const storage=memory(),p=freshProgress(),b=createBoard(puzzles);select(b,'dental-courage:0');place(b,puzzles,3,0);p.boards.level=b;p.tutorialComplete=true;p.completedLevels=['level-01'];p.completedPuzzles=puzzles.map(p=>p.id);p.unlockedLevel=2;rewardOnce(p,'level-01');purchaseClue(p,'clock');assert.equal(writeProgress(storage,p),true);
 const loaded=readProgress(storage);assert.deepEqual(loaded,p);const restored=restoreBoard(loaded.boards.level,puzzles);assert.deepEqual(restored.lanes,b.lanes);assert.deepEqual(restored.pool,b.pool);assert.equal(rewardOnce(loaded,'level-01'),0);
});
test('corrupt duplicate/missing tokens reset only the board, never trust injected token text',()=>{
 const b=createBoard(puzzles);b.pool[0]=b.pool[1];const restored=restoreBoard(b,puzzles);assert.equal(new Set(restored.pool).size,18);
 const clean=createBoard(puzzles);clean.tokens[clean.pool[0]].word='injected';assert.notEqual(restoreBoard(clean,puzzles).tokens[clean.pool[0]].word,'injected');
});
test('storage corruption and denied storage do not block the game',()=>{
 const storage=memory();storage.setItem(STORAGE_KEY,'broken');assert.deepEqual(readProgress(storage),freshProgress());assert.equal(writeProgress({setItem(){throw Error('denied');}},freshProgress()),false);
});
test('legacy balances and anti-farming completion survive migration',()=>{const s=memory();s.setItem('wss3_stars','7');s.setItem('wss3_level1','1');const p=readProgress(s);assert.equal(p.stars,7);assert.equal(rewardOnce(p,'level-01'),0);assert.equal(p.tutorialComplete,false);});
