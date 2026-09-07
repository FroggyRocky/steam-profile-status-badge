import { GetPlayerSummaryResponse, PlayerSummaryResult } from "../types";

/** A Steam ID64 is 17 digits. Anything else is a custom profile name. */
const STEAM_ID_PATTERN = /^\d{17}$/;

export function isValidSteamId(steamId: string): boolean {
  return STEAM_ID_PATTERN.test(steamId);
}

export async function fetchPlayerSummary(
  steamId: string
): Promise<PlayerSummaryResult> {
  try {
    const res = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${encodeURIComponent(
        steamId
      )}`
    );
    if (!res.ok) {
      return { ok: false, reason: "STEAM_UNAVAILABLE" };
    }
    const result: GetPlayerSummaryResponse = await res.json();
    const player = result.response?.players?.[0];
    if (!player) {
      return { ok: false, reason: "NOT_FOUND" };
    }
    return { ok: true, player };
  } catch (error) {
    // Network failure or an unparseable body both mean we could not reach Steam.
    return { ok: false, reason: "STEAM_UNAVAILABLE" };
  }
}

export async function convertImageToBase64(
  imageUrl: string
): Promise<string | undefined> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return undefined;
    }
    const contentType = response.headers.get("content-type");
    const mimeType = contentType?.startsWith("image/")
      ? contentType.split(";")[0].trim()
      : "image/jpeg";
    const blob = await response.arrayBuffer();
    const buffer = Buffer.from(blob);
    const base64 = buffer.toString("base64");
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    return undefined;
  }
}
