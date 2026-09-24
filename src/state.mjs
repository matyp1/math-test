export const STORAGE_KEY = 'word-slop-swap-v4';
export function freshProgress() {
  return { version: 4, stars: 1, rewards: [], completedPuzzles: [], completedLevels: [], tutorialComplete: false, unlockedLevel: 1, clues: [], boards: {}, tutorialStarted: false, tutorialBiteSelected: false };
}
export function readProgress(storage) {
  const result = freshProgress();
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY) || 'null');
    if (saved?.version === 4) {
      result.stars = Number.isSafeInteger(saved.stars) && saved.stars >= 0 ? saved.stars : 1;
      for (const key of ['rewards', 'completedPuzzles', 'completedLevels', 'clues']) result[key] = Array.isArray(saved[key]) ? [...new Set(saved[key].filter(x => typeof x === 'string'))] : [];
      result.tutorialComplete = saved.tutorialComplete === true;
      result.unlockedLevel = saved.unlockedLevel === 2 ? 2 : 1;
      result.boards = saved.boards && typeof saved.boards === 'object' ? saved.boards : {};
      result.tutorialStarted = saved.tutorialStarted === true;
      result.tutorialBiteSelected = saved.tutorialBiteSelected === true;
    } else {
      // Preserve existing earned balance and completed-level anti-farming state.
      const legacyStars = storage.getItem('wss3_stars');
      if (legacyStars !== null && Number.isSafeInteger(+legacyStars) && +legacyStars >= 0) result.stars = +legacyStars;
      if (storage.getItem('wss3_level1') === '1') {
        result.completedLevels = ['level-01']; result.rewards = ['level-01']; result.unlockedLevel = 2;
      }
    }
  } catch { /* Browser storage is an enhancement; play remains available. */ }
  return result;
}
export function writeProgress(storage, progress) {
  try { storage.setItem(STORAGE_KEY, JSON.stringify(progress)); return true; } catch { return false; }
}
export function rewardOnce(progress, id) {
  if (progress.rewards.includes(id)) return 0;
  progress.rewards.push(id); progress.stars += 1;
  return 1;
}
export function purchaseClue(progress, id) {
  if (progress.clues.includes(id)) return 'owned';
  if (progress.stars < 1) return 'insufficient';
  progress.stars -= 1; progress.clues.push(id);
  return 'purchased';
}
