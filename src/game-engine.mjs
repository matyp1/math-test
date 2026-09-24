// The same deliberately submitted board powers One Slop and Five Slops.
// Tokens have distinct IDs: equal words remain interchangeable for validation.
export function shuffled(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createBoard(puzzles, random = Math.random) {
  const tokens = {};
  const pool = [];
  const lanes = puzzles.map(p => p.solution.map((word, i) => {
    if (i === p.anchorIndex) return null;
    const id = `${p.id}:${i}`;
    tokens[id] = { id, word };
    pool.push(id);
    return null;
  }));
  return { lanes, pool: shuffled(pool, random), tokens, selected: null, moves: 0 };
}

export function locate(board, id) {
  const poolIndex = board.pool.indexOf(id);
  if (poolIndex !== -1) return { poolIndex };
  for (let lane = 0; lane < board.lanes.length; lane++) {
    const slot = board.lanes[lane].indexOf(id);
    if (slot !== -1) return { lane, slot };
  }
  return null;
}

export function select(board, id) {
  if (!board.tokens[id] || !locate(board, id)) return false;
  board.selected = board.selected === id ? null : id;
  return true;
}

export function place(board, puzzles, lane, slot) {
  if (!puzzles[lane] || slot < 0 || slot >= puzzles[lane].solution.length || slot === puzzles[lane].anchorIndex) return false;
  const id = board.selected;
  if (!id) return false;
  const from = locate(board, id);
  if (!from) return false;
  const displaced = board.lanes[lane][slot];
  if (displaced === id) { board.selected = null; return false; }
  if ('poolIndex' in from) {
    if (displaced) board.pool.splice(from.poolIndex, 1, displaced);
    else board.pool.splice(from.poolIndex, 1);
  } else board.lanes[from.lane][from.slot] = displaced;
  board.lanes[lane][slot] = id;
  board.selected = null;
  board.moves++;
  return true;
}

export function returnToPool(board) {
  const id = board.selected;
  const from = id && locate(board, id);
  if (!from || 'poolIndex' in from) return false;
  board.lanes[from.lane][from.slot] = null;
  board.pool.push(id);
  board.selected = null;
  board.moves++;
  return true;
}

export function wordAt(board, puzzles, lane, slot) {
  const p = puzzles[lane];
  return slot === p.anchorIndex ? p.anchorWord : board.tokens[board.lanes[lane][slot]]?.word ?? null;
}

export function filledCount(board, puzzles) {
  return board.lanes.reduce((n, row, lane) => n + row.filter((id, slot) => slot !== puzzles[lane].anchorIndex && id).length, 0);
}

// This is the ONLY correctness query. UI must call it only from submission.
export function submit(board, puzzles) {
  const complete = puzzles.every((p, lane) => p.solution.every((word, slot) => wordAt(board, puzzles, lane, slot) === word));
  return { complete };
}

export function restoreBoard(saved, puzzles) {
  const fresh = createBoard(puzzles);
  if (!saved || !Array.isArray(saved.pool) || !Array.isArray(saved.lanes) || saved.lanes.length !== puzzles.length) return fresh;
  const seen = [...saved.pool];
  for (let lane = 0; lane < puzzles.length; lane++) {
    const row = saved.lanes[lane];
    if (!Array.isArray(row) || row.length !== puzzles[lane].solution.length || row[puzzles[lane].anchorIndex] !== null) return fresh;
    for (const id of row) if (id !== null) seen.push(id);
  }
  if (seen.length !== Object.keys(fresh.tokens).length || new Set(seen).size !== seen.length || seen.some(id => !fresh.tokens[id])) return fresh;
  return { ...fresh, lanes: saved.lanes.map(row => [...row]), pool: [...saved.pool], moves: Number.isSafeInteger(saved.moves) && saved.moves >= 0 ? saved.moves : 0 };
}
