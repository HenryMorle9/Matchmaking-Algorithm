import { getPlayerName } from "./playerNames";

export function parseTeamInput(input: string, availablePlayers: number[] = []): number[] {
  const tokens = input
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "");

  if (tokens.length === 0) return [];

  const validPlayers = new Set(availablePlayers);
  const playerNameLookup = new Map(
    availablePlayers.map((id) => [getPlayerName(id).toLowerCase(), id]),
  );

  return Array.from(
    new Set(
      tokens.map((token) => {
        const numericId = Number(token);
        if (Number.isInteger(numericId)) {
          if (availablePlayers.length === 0 || validPlayers.has(numericId)) {
            return numericId;
          }
          throw new Error(`Player ID ${numericId} is not in the loaded graph.`);
        }

        const nameMatch = playerNameLookup.get(token.toLowerCase());
        if (nameMatch !== undefined) {
          return nameMatch;
        }

        throw new Error(`Unknown player "${token}".`);
      }),
    ),
  );
}
