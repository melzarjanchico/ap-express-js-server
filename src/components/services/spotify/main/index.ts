import axios from "axios";
import { SpotifyMainServiceErrorResponse, SpotityMainServiceResponse, TopArtistsSuccessResponse, TopTracksSuccessResponse } from "./models";
import { spotifyErrorHandler } from "../error";
import { SpotifyAuthService } from "../auth";
import { User as CurrentUserSuccessResponse} from "../../../../models/objects";

export class SpotifyMainService {
    public API_URL = "https://api.spotify.com/v1";

    constructor(
        private svc: SpotifyAuthService
    ) {}

    // * =======================================
    // * GET Top Tracks
    // * =======================================
    async getTopTracks(timeRange?: string, limit?: number, offset?: number) {
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

            console.error("UNCAUGHT_TOP_TRACK_ERROR", error)
            return spotifyErrorHandler("UNCAUGHT_TOP_TRACK_ERROR", error, `${(error as Error).message ?? `Something went wrong getting top user tracks.`}`)
        }
    }

    // * =======================================
    // * GET Top Artists
    // * =======================================
    async getTopArtists(timeRange?: string, limit?: number, offset?: number) {
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
        const url = `${this.API_URL}/me/top/artists`;

        try {
            const response = await axios.get<TopArtistsSuccessResponse>(url, {
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
                message: `User top ${msgType} ${msgFrom}-${msgTo} artists acquired!`,
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

                console.error("AXIOS_TOP_ARTIST_ERROR", status, errData.error.message)
                return spotifyErrorHandler("AXIOS_TOP_ARTIST_ERROR", errData, `${errData?.error?.message}`)
            }

            console.error("UNCAUGHT_TOP_ARTIST_ERROR", error)
            return spotifyErrorHandler("UNCAUGHT_TOP_ARTIST_ERROR", error, `${(error as Error).message ?? `Something went wrong getting top user artists.`}`)
        }
    }

    // * =======================================
    // * GET Current User
    // * =======================================
    async getCurrentUser() {
        let accessToken: string;

        try {
            await this.svc.updateToken();
            accessToken = await this.svc.getToken();
        } catch (error) {
            console.error("GET_ACCESS_TOKEN_ERROR", error)
            return spotifyErrorHandler("GET_ACCESS_TOKEN_ERROR", error, `${(error as Error).message ?? `Something went wrong getting and updating the token.`}`)
        }

        const url = `${this.API_URL}/me`;

        try {
            const response = await axios.get<CurrentUserSuccessResponse>(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = response.data;

            return {
                status: 200,
                data,
                message: `User profile acquired!`,
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

                console.error("AXIOS_USER_PROFILE_ERROR", status, errData.error.message)
                return spotifyErrorHandler("AXIOS_USER_PROFILE_ERROR", errData, `${errData?.error?.message}`)
            }

            console.error("UNCAUGHT_USER_PROFILE_ERROR", error)
            return spotifyErrorHandler("UNCAUGHT_USER_PROFILE_ERROR", error, `${(error as Error).message ?? `Something went wrong getting user profile.`}`)
        }
    }

    // * =======================================
    // * GET Current Track
    // * =======================================
    async getCurrentTrack() {
        let accessToken: string;

        try {
            await this.svc.updateToken();
            accessToken = await this.svc.getToken();
        } catch (error) {
            console.error("GET_ACCESS_TOKEN_ERROR", error)
            return spotifyErrorHandler("GET_ACCESS_TOKEN_ERROR", error, `${(error as Error).message ?? `Something went wrong getting and updating the token.`}`)
        }

        const url = `${this.API_URL}/me/player/currently-playing`;

        try {
            const response = await axios.get<CurrentUserSuccessResponse>(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const data = response.data;

            return {
                status: 200,
                data,
                message: `User current track acquired!`,
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

                console.error("AXIOS_CURRENT_TRACK_ERROR", status, errData.error.message)
                return spotifyErrorHandler("AXIOS_CURRENT_TRACK_ERROR", errData, `${errData?.error?.message}`)
            }

            console.error("UNCAUGHT_CURRENT_TRACK_ERROR", error)
            return spotifyErrorHandler("UNCAUGHT_CURRENT_TRACK_ERROR", error, `${(error as Error).message ?? `Something went wrong getting user current track.`}`)
        }

    }

}