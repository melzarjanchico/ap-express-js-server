import axios from "axios";
import { GetOwnedGamesList, GetPlayerSummaryList, PersonaState, SteamBaseResponse } from "./models";
import { steamErrorHandler } from "./error";
import { CurrentGame, Game } from "../../../models/objects";
import { convertPlaytime, getSteamImages, minutesToReadable } from "./helper";

export class SteamMainService {
    public API_URL = "http://api.steampowered.com";
    private API_KEY: string | undefined
    private STEAM_ID: string | undefined

    constructor() {
        this.API_KEY = process.env.STEAM_API_KEY;
        this.STEAM_ID = process.env.STEAM_ID;
    }

    // * =======================================
    // * GET Owned Games
    // * =======================================
    async getOwnedGames(appid?: number) {
        const params = {
            key: this.API_KEY,
            steamid: this.STEAM_ID,
            include_appinfo: 1,
            include_played_free_games: 1,
        };
        const url = `${this.API_URL}/IPlayerService/GetOwnedGames/v0001`;

        try {
            const response = await axios.get<SteamBaseResponse<GetOwnedGamesList>>(url, {
                params,
            });

            let games = response.data.response.games ?? [];

            if (appid) {
                games = games.filter(g => g.appid === appid);
            }

            return games
                .sort((a, b) => (b.rtime_last_played ?? 0) - (a.rtime_last_played ?? 0))
                .map<Game>((g) => {
                    const minutes = g.playtime_forever ?? 0;
                    return {
                        id: g.appid,
                        gameName: g.name,
                        playtimeMinutes: minutes,
                        playtimeReadable: minutesToReadable(minutes),
                        lastPlayed: convertPlaytime(g.rtime_last_played),
                        ...getSteamImages(g.appid, g.img_icon_url)
                    };
                })
                .slice(0, 10);

        } catch (error) {
            console.error("UNCAUGHT_GET_OWNED_GAME_ERROR", error);

            return steamErrorHandler("UNCAUGHT_GET_OWNED_GAME_ERROR", error);
        }
    }

    // * =======================================
    // * GET Current Game
    // * =======================================
    async getCurrentGame() {
        const params = {
            key: this.API_KEY,
            steamids: this.STEAM_ID,
        };
        const url = `${this.API_URL}/ISteamUser/GetPlayerSummaries/v0002`;

        try {
            const response = await axios.get<SteamBaseResponse<GetPlayerSummaryList>>(url, {
                params,
            });

            const userProfile = response.data.response.players[0];
            let currentGame: CurrentGame | undefined;

            if (userProfile?.gameid) {
                const currentGameList = await this.getOwnedGames(Number(userProfile.gameid));

                if (Array.isArray(currentGameList) && currentGameList.length > 0) {
                    currentGame = {
                        state: userProfile.personastate,
                        status: PersonaState[userProfile.personastate],
                        game: currentGameList[0]}
                } else {
                    currentGame = {
                        state: userProfile.personastate,
                        status: PersonaState[userProfile.personastate]
                    }
                }
            } else {
                currentGame = {
                    state: userProfile.personastate,
                    status: PersonaState[userProfile.personastate]
                } 
            }

            return currentGame;

        } catch (error) {
            console.error("UNCAUGHT_GET_PLAYER_SUMMARY_ERROR", error);
            return steamErrorHandler("UNCAUGHT_GET_PLAYER_SUMMARY_ERROR", error);
        }
    }

}
