export interface SteamBaseResponse<T> {
    response: T;
}

export interface SteamErrorResponse {
    error: {
        status: number,
        message: string
    }
}

export interface GetOwnedGamesList {
    gameCount: number;
    games: GetOwnedGamesListItem[];
}

export interface GetOwnedGamesListItem {
  appid: number;
  name: string;
  playtime_forever: number;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  playtime_deck_forever: number;
  playtime_disconnected: number;
  rtime_last_played: number;
  img_icon_url: string;
  img_logo_url?: string;
  content_descriptorids: number[];
  has_community_visible_stats?: boolean;
  has_leaderboards?: boolean;
}

export interface GetPlayerSummaryList {
    players: GetPlayerSummaryListItem[];
}

export interface GetPlayerSummaryListItem {
  steamid: string;
  communityvisibilitystate: number;
  profilestate?: number;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  avatarhash: string;
  lastlogoff?: number;
  personastate: number;
  personastateflags?: number;
  primaryclanid?: string;
  timecreated?: number;
  gameextrainfo?: string;
  gameid?: string;
  loccountrycode?: string;
  locstatecode?: string;
  loccityid?: number;
}

export enum PersonaState {
  Offline = 0,
  Online = 1,
  Busy = 2,
  Away = 3,
  Snooze = 4,
  LookingToTrade = 5,
  LookingToPlay = 6,
}
