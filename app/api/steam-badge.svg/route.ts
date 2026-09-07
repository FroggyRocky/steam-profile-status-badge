import { NextRequest, NextResponse } from "next/server";
import {
  fetchPlayerSummary,
  convertImageToBase64,
  isValidSteamId,
} from "../../../lib/playerLib";
import { SteamBadge } from "../../../components/SteamBadge";
import { BADGE_ERRORS, BadgeError } from "../../../lib/badgeErrors";
import {
  PersonaStateEnum,
  StatusKeyType,
  AdditionalPlayerSummaryType,
  PlayerSummaryType,
} from "../../../types";
export const dynamic = "force-dynamic";

const CACHE_SUCCESS =
  "public, max-age=300, s-maxage=300, stale-while-revalidate=600";

type BadgeProps = Parameters<typeof SteamBadge>[0];

async function svgResponse(props: BadgeProps, cacheControl: string) {
  const ReactDOMServer = (await import("react-dom/server")).default;
  const markup = ReactDOMServer.renderToStaticMarkup(SteamBadge(props));
  return new NextResponse(markup, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": cacheControl,
    },
  });
}

/** Always answer with an SVG. This endpoint is loaded by an <img> tag. */
function errorBadge(error: BadgeError) {
  return svgResponse({ playerSummary: undefined, error }, error.cacheControl);
}

export async function GET(request: NextRequest) {
  try {
    const steamId = request.nextUrl.searchParams.get("steamId");
    if (!steamId) {
      return await errorBadge(BADGE_ERRORS.MISSING_ID);
    }
    if (!isValidSteamId(steamId)) {
      return await errorBadge(BADGE_ERRORS.INVALID_ID);
    }
    const result = await fetchPlayerSummary(steamId);
    if (!result.ok) {
      return await errorBadge(BADGE_ERRORS[result.reason]);
    }
    const player = result.player;
    const profileImage = await convertImageToBase64(player.avatarfull);
    const status = Object.keys(PersonaStateEnum).find((key) => {
      return PersonaStateEnum[key as StatusKeyType] === player.personastate;
    });
    const responseData = {
      ...player,
      status,
      profileImageBase64: profileImage,
    } as PlayerSummaryType & AdditionalPlayerSummaryType;
    return await svgResponse({ playerSummary: responseData }, CACHE_SUCCESS);
  } catch (error) {
    return await errorBadge(BADGE_ERRORS.UNEXPECTED);
  }
}
