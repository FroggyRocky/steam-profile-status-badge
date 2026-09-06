import { PlayerSummaryType, GetPlayerSummaryResponse } from "../types";

export async function fetchPlayerSummary(
  steamId: string | null
): Promise<PlayerSummaryType | undefined> {
  if (!steamId) return undefined;
  try {
    const res = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${encodeURIComponent(
        steamId
      )}`
    );
    if (!res.ok) {
      return undefined;
    }
    const result: GetPlayerSummaryResponse = await res.json();
    const data = result.response?.players?.[0];
    if (!data) {
      return undefined;
    }
    return data;
  } catch (error) {
    return undefined;
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
