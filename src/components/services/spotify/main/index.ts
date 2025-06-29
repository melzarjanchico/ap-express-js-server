import axios from "axios";
import { SpotifyMainServiceErrorResponse, SpotityMainServiceResponse, TopTracksSuccessResponse } from "./models";
import { spotifyErrorHandler } from "../error";
import { SpotifyAuthService } from "../auth";

export class SpotifyMainService {
    public API_URL = "https://api.spotify.com/v1";

    constructor(
        private svc: SpotifyAuthService
    ) {}

    // * =======================================
    // * GET Top Tracks
    // * =======================================
    async getCurrentTrack(timeRange?: string, limit?: number, offset?: number) {
        let accessToken: string;

        try {
            await this.svc.updateToken();
            accessToken = await this.svc.getToken();
        } catch (error) {
            console.error("GET_ACCESS_TOKEN_ERROR", error)
            return spotifyErrorHandler("GET_ACCESS_TOKEN_ERROR", error, `${(error as Error).message ?? `Something went wrong getting and updating the token.`}`)
        }

        const params = {
            time_range: timeRange ?? 'short_term',
            limit: limit ?? 10,
            offset: offset ?? 0
        };
        const url = `${this.API_URL}/me/top/tracks`;

        try {
            const response = await axios.get<TopTracksSuccessResponse>(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                params,
            });

            const data = response.data;
            const msgFrom = params.offset + 1;
            const msgTo = params.offset + params.limit;
            const msgType = params.time_range;

            return {
                status: 200,
                data,
                message: `User top ${msgType} ${msgFrom}-${msgTo} tracks acquired!`,
                date: new Date()
            } as SpotityMainServiceResponse;

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const errData = error.response?.data as SpotifyMainServiceErrorResponse;

                if (status === 401 && errData?.error?.message === "The access token expired") {
                    console.warn("EXPIRED_ACCESS_TOKEN:", status, errData.error.message);
                    return spotifyErrorHandler("EXPIRED_ACCESS_TOKEN", errData.error)
                }

                console.error("AXIOS_TOP_TRACK_ERROR", status, errData.error.message)
                return spotifyErrorHandler("AXIOS_TOP_TRACK_ERROR", errData, `${errData?.error?.message}`)
            }

            console.error("AXIOS_TOP_TRACK_ERROR", error)
            return spotifyErrorHandler("AXIOS_TOP_TRACK_ERROR", error, `${(error as Error).message ?? `Something went wrong getting top user tracks.`}`)
        }
    }

    // * =======================================
    // * GET Top Artists
    // * =======================================

    // * =======================================
    // * GET Current User
    // * =======================================

    // * =======================================
    // * GET Current Track
    // * =======================================

}