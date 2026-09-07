import { NextRequest } from "next/server";
import { fetchPlayerSummary, isValidSteamId } from "../../../lib/playerLib";
import { BADGE_ERRORS, BadgeError } from "../../../lib/badgeErrors";
export const dynamic = "force-dynamic";

/** Same wording as the SVG badge, so both endpoints explain a failure identically. */
function errorResponse(error: BadgeError) {
  return Response.json(
    { error: error.title, hint: error.hint },
    { status: error.status, headers: { "Cache-Control": error.cacheControl } }
  );
}

export async function GET(request: NextRequest) {
  try {
    const steamId = request.nextUrl.searchParams.get("steamId");
    if (!steamId) {
      return errorResponse(BADGE_ERRORS.MISSING_ID);
    }
    if (!isValidSteamId(steamId)) {
      return errorResponse(BADGE_ERRORS.INVALID_ID);
    }
    const result = await fetchPlayerSummary(steamId);
    if (!result.ok) {
      return errorResponse(BADGE_ERRORS[result.reason]);
    }
    return Response.json({ data: result.player });
  } catch (error) {
    return errorResponse(BADGE_ERRORS.UNEXPECTED);
  }
}
