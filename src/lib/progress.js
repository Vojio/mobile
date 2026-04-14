export function createEmptyProgress() {
  return {
    activeStepIndex: 0,
    answers: {},
    completed: false
  };
}

export function ensureProgress(progressByCase, caseId) {
  if (!progressByCase[caseId]) {
    progressByCase[caseId] = createEmptyProgress();
  }

  return progressByCase[caseId];
}

export function getCaseMaxScore(caseItem) {
  return caseItem.steps.reduce(
    (sum, step) =>
      sum + Math.max(...step.question.options.map((option) => option.points)),
    0
  );
}

export function getTotalPossibleScore(caseLibrary) {
  return caseLibrary.reduce((sum, caseItem) => sum + getCaseMaxScore(caseItem), 0);
}

export function getCaseScore(caseItem, progress) {
  return Object.entries(progress.answers).reduce((sum, [stepIndex, answerIndex]) => {
    const step = caseItem.steps[Number(stepIndex)];
    const option = step?.question.options[Number(answerIndex)];
    return sum + (option?.points ?? 0);
  }, 0);
}

export function getTotalScore(caseLibrary, progressByCase) {
  return caseLibrary.reduce((sum, caseItem) => {
    const progress = ensureProgress(progressByCase, caseItem.id);
    return sum + getCaseScore(caseItem, progress);
  }, 0);
}

export function getCompletedCount(caseLibrary, progressByCase) {
  return caseLibrary.filter((caseItem) => ensureProgress(progressByCase, caseItem.id).completed).length;
}

export function getCompletionText(progress) {
  if (progress.completed) return "Abgeschlossen";
  if (Object.keys(progress.answers).length > 0) return "In Arbeit";
  return "Neu";
}

export function getRecommendedCase(caseLibrary, progressByCase) {
  return caseLibrary.find((caseItem) => !ensureProgress(progressByCase, caseItem.id).completed) ?? caseLibrary[0];
}

export function buildLeaderboard(peerScores, totalScore) {
  return [...peerScores, { name: "Du", score: totalScore }].sort(
    (left, right) => right.score - left.score
  );
}
