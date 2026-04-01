export const getTomorrowTimestamp = (now = new Date()) => {
  const tomorrow = new Date(now);
  tomorrow.setHours(24, 0, 0, 0);
  return tomorrow.getTime();
};

export const isHiddenUntilActive = (hiddenUntil: string | null, now = Date.now()) => {
  if (!hiddenUntil) return false;

  const parsed = Number(hiddenUntil);
  if (!Number.isFinite(parsed)) return false;

  return parsed > now;
};
