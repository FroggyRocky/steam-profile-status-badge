export type PlayerSummaryType = {
  steamid: string;
  personaname: string;
  avatar: string;
  avatarfull: string;
  avatarmedium: string;
  gameextrainfo?: string;
  gameid?: string;
  personastate: number;
  profileurl: string;
}


export type AdditionalPlayerSummaryType = {
  status?: StatusKeyType;
  profileImageBase64?: string;
  
}
export type GetPlayerSummaryResponse = {
  response?: {
    players?: PlayerSummaryType[];
  };
};

/**
 * Steam returning no player and Steam being unreachable are different problems,
 * so they get different badges instead of a single "not found".
 */
export type PlayerSummaryResult =
  | { ok: true; player: PlayerSummaryType }
  | { ok: false; reason: "NOT_FOUND" | "STEAM_UNAVAILABLE" };

export type StatusKeyType = keyof typeof PersonaStateEnum;

export enum PersonaStateEnum {
  Offline = 0,
  Online = 1,
  Busy = 2,
  Away = 3,
  Snooze = 4,
  LookingToTrade = 5,
  LookingToPlay = 6
}

