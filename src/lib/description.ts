export function keepDescription(current?: string, incoming?: string) {
  const kept = current?.trim();
  const next = incoming?.trim();
  if (kept && next) {
    const currentHasChinese = /[\u4e00-\u9fff]/.test(kept);
    const incomingHasChinese = /[\u4e00-\u9fff]/.test(next);
    return incomingHasChinese && !currentHasChinese ? incoming : current;
  }
  if (kept) return current;
  return next ? incoming : current || incoming;
}
