import { NextRequest, NextResponse } from "next/server";
import {
  fetchPlayerSummary,
  convertImageToBase64,
} from "../../../lib/playerLib";
import { SteamBadge } from "../../../components/SteamBadge";
import {
  PersonaStateEnum,
  StatusKeyType,
  AdditionalPlayerSummaryType,
  PlayerSummaryType,
} from "../../../types";
export const dynamic = "force-dynamic";

const CACHE_SUCCESS =
  "public, max-age=300, s-maxage=300, stale-while-revalidate=600";
const CACHE_NOT_FOUND = "public, max-age=60, s-maxage=60";
const CACHE_ERROR = "no-store";

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const steamId = searchParams.get("steamId");
    if (!steamId) {
      return await svgResponse(
        { playerSummary: undefined, message: "steamId is required" },
        CACHE_NOT_FOUND
      );
    }
    const data = await fetchPlayerSummary(steamId);
    if (!data) {
      return await svgResponse(
        { playerSummary: undefined },
        CACHE_NOT_FOUND
      );
    }
    const profileImage = await convertImageToBase64(data.avatarfull);
    const status = Object.keys(PersonaStateEnum).find((key) => {
      return PersonaStateEnum[key as StatusKeyType] === data.personastate;
    });
    const responseData = {
      ...data,
      status,
      profileImageBase64: profileImage,
    } as PlayerSummaryType & AdditionalPlayerSummaryType;
    return await svgResponse({ playerSummary: responseData }, CACHE_SUCCESS);
  } catch (error) {
    return await svgResponse(
      { playerSummary: undefined, message: "Something went wrong" },
      CACHE_ERROR
    );
  }
}
