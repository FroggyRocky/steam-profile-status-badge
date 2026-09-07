const CACHE_STABLE = "public, max-age=300, s-maxage=300";
const CACHE_SHORT = "public, max-age=60, s-maxage=60";
const CACHE_NONE = "no-store";

export type BadgeErrorKey =
  | "MISSING_ID"
  | "INVALID_ID"
  | "NOT_FOUND"
  | "STEAM_UNAVAILABLE"
  | "UNEXPECTED";

export type BadgeError = {
  /** Headline shown on the badge and returned as `error` by the JSON endpoint. */
  title: string;
  /** Second line telling the reader how to fix it. */
  hint: string;
  status: number;
  cacheControl: string;
};

export const BADGE_ERRORS: Record<BadgeErrorKey, BadgeError> = {
  MISSING_ID: {
    title: "No Steam ID provided",
    hint: "Add ?steamId=YOUR_STEAM_ID to the badge URL",
    status: 400,
    // A missing parameter is deterministic, so it is safe to cache.
    cacheControl: CACHE_STABLE,
  },
  INVALID_ID: {
    title: "Invalid Steam ID",
    hint: "Use the 17-digit number from your profile URL, not your custom name",
    status: 400,
    cacheControl: CACHE_STABLE,
  },
  NOT_FOUND: {
    title: "Steam profile not found",
    hint: "No Steam account matches this ID",
    status: 404,
    // A profile could appear later, so keep this one short-lived.
    cacheControl: CACHE_SHORT,
  },
  STEAM_UNAVAILABLE: {
    title: "Steam is not responding",
    hint: "The Steam API is down or rate-limiting us, try again soon",
    status: 503,
    cacheControl: CACHE_NONE,
  },
  UNEXPECTED: {
    title: "Badge unavailable",
    hint: "Something went wrong while building this badge",
    status: 500,
    cacheControl: CACHE_NONE,
  },
};
