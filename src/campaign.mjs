import { rewardOnce } from './state.mjs';

export function unlockedCount(progress, levels) {
  let count = 1;
  while (count < levels.length && progress.completedLevels.includes(levels[count - 1].id)) count++;
  return count;
}

export function canPlay(progress, levels, id) {
  const index = levels.findIndex(level => level.id === id);
  return index >= 0 && index < unlockedCount(progress, levels);
}

export function recommendedLevel(progress, levels) {
  return levels.find(level => canPlay(progress, levels, level.id) && !progress.completedLevels.includes(level.id)) || levels.at(-1);
}

// Called only after the shared engine confirms a deliberate correct submission.
export function completeLevel(progress, levels, level) {
  const reward = rewardOnce(progress, level.id);
  if (!progress.completedLevels.includes(level.id)) progress.completedLevels.push(level.id);
  progress.completedPuzzles = [...new Set([...progress.completedPuzzles, ...level.puzzles.map(p => p.id)])];
  progress.unlockedLevel = unlockedCount(progress, levels);
  return reward;
}
