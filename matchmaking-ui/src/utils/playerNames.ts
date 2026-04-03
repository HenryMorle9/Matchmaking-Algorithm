const PLAYER_NAMES = [
  "Ava",
  "Beau",
  "Cleo",
  "Dane",
  "Esme",
  "Finn",
  "Gia",
  "Hugo",
  "Iris",
  "Jade",
  "Kai",
  "Luca",
  "Mila",
  "Nico",
  "Orla",
  "Pia",
  "Quin",
  "Remy",
  "Skye",
  "Tess",
  "Uma",
  "Vera",
  "Wren",
  "Zane",
  "Arlo",
  "Bryn",
  "Cora",
  "Drew",
  "Etta",
  "Faye",
  "Gage",
  "Hope",
  "Isla",
  "Juno",
  "Kaia",
  "Levi",
  "Mara",
  "Nash",
  "Opal",
  "Reid",
  "Sage",
  "Thea",
  "Veda",
  "Wade",
  "Xena",
  "Yara",
  "Zuri",
] as const;

export function getPlayerName(id: number): string {
  if (!Number.isFinite(id)) return "Unknown";

  const normalizedId = Math.abs(Math.trunc(id));
  const baseName = PLAYER_NAMES[normalizedId % PLAYER_NAMES.length];
  const cycle = Math.floor(normalizedId / PLAYER_NAMES.length);

  if (cycle === 0) return baseName;

  const suffix = String.fromCharCode(65 + ((cycle - 1) % 26));
  return `${baseName} ${suffix}`;
}

export function formatPlayerList(playerIds: number[]): string {
  return `[${playerIds.map(getPlayerName).join(", ")}]`;
}

export function extractPlayerIdFromAction(action: string): number | null {
  const match = action.match(/player (\d+)/);
  return match ? Number(match[1]) : null;
}

export function formatPlayerAction(action: string): string {
  return action.replace(/player (\d+)/g, (_, rawId: string) =>
    getPlayerName(Number(rawId)),
  );
}
