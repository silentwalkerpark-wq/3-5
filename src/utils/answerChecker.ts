export function normalizeAnswer(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\s\-_.,/()·・]/g, '')
    .trim();
}

export function checkAnswer(userInput: string, canonicalAnswer: string, acceptedAnswers: string[]): boolean {
  const cleanInput = normalizeAnswer(userInput);
  if (!cleanInput) return false;

  const cleanCanonical = normalizeAnswer(canonicalAnswer);
  if (cleanInput === cleanCanonical) return true;

  return acceptedAnswers.some((accepted) => normalizeAnswer(accepted) === cleanInput);
}
