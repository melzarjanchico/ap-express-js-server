import axios from "axios";
import { GetRecentTracksResponse, GetTopAlbumsResponse, GetTopArtistsResponse, GetTopTracksResponse } from "./models";
import { lastfmErrorHandler } from "./error";

export class LastfmService {
    public API_URL = "http://ws.audioscrobbler.com/2.0";
    private LASTFM_USERNAME: string | undefined
    private LASTFM_API_KEY: string | undefined

    constructor() {
        this.LASTFM_USERNAME = process.env.LASTFM_USERNAME;
        this.LASTFM_API_KEY = process.env.LASTFM_API_KEY;
    }

    // * =======================================
    // * GET Recent Track
    // * =======================================
    async getRecentTrack(limit?: number) {
        const params = {
            method: 'user.getrecenttracks',
            user: this.LASTFM_USERNAME,
            api_key: this.LASTFM_API_KEY,
            format: 'json',
            limit: limit ?? 1,
        };
        const url = `${this.API_URL}`;

        try {
            const response = await axios.get<GetRecentTracksResponse>(url, {
                params,
            });

            return response.data;
        } catch (error) {
            console.error("UNCAUGHT_RECENT_TRACK_ERROR", error);
            return lastfmErrorHandler("UNCAUGHT_RECENT_TRACK_ERROR", error);
        }
    }

    // * =======================================
    // * GET Top Tracks
    // * =======================================
    async getTopTracks(limit?: number, period?: string) {
        const params = {
            method: 'user.gettoptracks',
            user: this.LASTFM_USERNAME,
            api_key: this.LASTFM_API_KEY,
            format: 'json',
            limit: limit ?? 10,
            period: period ?? '1month',
        };
        const url = `${this.API_URL}`;

        try {
            const response = await axios.get<GetTopTracksResponse>(url, {
                params,
            });

            return response.data;
        } catch (error) {
            console.error("UNCAUGHT_TOP_TRACKS_ERROR", error);
            return lastfmErrorHandler("UNCAUGHT_TOP_TRACKS_ERROR", error);
        }
    }

    // * =======================================
    // * GET Top Artists
    // * =======================================
    async getTopArtists(limit?: number, period?: string) {
        const params = {
            method: 'user.gettopartists',
            user: this.LASTFM_USERNAME,
            api_key: this.LASTFM_API_KEY,
            format: 'json',
            limit: limit ?? 10,
            period: period ?? '1month',
        };
        const url = `${this.API_URL}`;

        try {
            const response = await axios.get<GetTopArtistsResponse>(url, {
                params,
            });

            return response.data;
        } catch (error) {
            console.error("UNCAUGHT_TOP_ARTISTS_ERROR", error);
            return lastfmErrorHandler("UNCAUGHT_TOP_ARTISTS_ERROR", error);
        }
    }

    // * =======================================
    // * GET Top Albums
    // * =======================================
    async getTopAlbums(limit?: number, period?: string) {
        const params = {
            method: 'user.gettopalbums',
            user: this.LASTFM_USERNAME,
            api_key: this.LASTFM_API_KEY,
            format: 'json',
            limit: limit ?? 10,
            period: period ?? '1month',
        };
        const url = `${this.API_URL}`;

        try {
            const response = await axios.get<GetTopAlbumsResponse>(url, {
                params,
            });

            return response.data;
        } catch (error) {
            console.error("UNCAUGHT_TOP_ALBUMS_ERROR", error);
            return lastfmErrorHandler("UNCAUGHT_TOP_ALBUMS_ERROR", error);
        }
    }
}
