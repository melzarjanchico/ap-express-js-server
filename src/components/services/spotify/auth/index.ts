import axios from "axios";
import { AccessTokenError, AccessTokenResponse, AccessTokenSuccess } from "./models";
import { spotifyAuthErrorHandler } from "../error";
import { generateRandomString } from "./helper";
import { VercelService } from "../../vercel";

export class SpotifyAuthService {
    public API_URL = "https://accounts.spotify.com/api/token";
    public REDIRECT_URI = (process.env.NODE_ENV === "production") ? `${process.env.SPOTIFY_CLIENT_URL}/spotify/renew/callback` : "http://127.0.0.1:3000/spotify/renew/callback";

    public lastAccessTokenResponse: AccessTokenResponse | null;
    public appState: string;

    constructor() {
        this.lastAccessTokenResponse = null;
        this.appState = generateRandomString(16);
    }

    // * =======================================
    // * Get Token
    // * =======================================
    async getToken(): Promise<string> {
        const accessToken = this.lastAccessTokenResponse;
        const accessTokenString = accessToken ? (accessToken.data as AccessTokenSuccess).access_token : '';

        if (!accessToken || !accessTokenString) {
            console.error("[SpotifyAuthService][getToken][ERROR]: Invalid or missing access token obj in lastAccessTokenResponse.", accessTokenString);
            throw new Error('GET_TOKEN_NO_REFRESH_TOKEN_ERROR');
        }

        return accessTokenString;
    }

    // * =======================================
    // * Create Token
    // * =======================================
    async createToken(): Promise<void> {
        const newAccessToken = await this.requestAccessToken();

        if (!newAccessToken || newAccessToken.status !== 200) {
            console.error("[SpotifyAuthService][createToken][ERROR]: No access token created on refreshToken.");
            throw new Error('CREATE_TOKEN_NO_TOKEN_ERROR')
        } else {
            console.log("[SpotifyAuthService][createToken][SUCCESS]: New access token created upon server initialization.");
        }

        this.lastAccessTokenResponse = newAccessToken;
    }

    // * =======================================
    // * Update Token (for Spotify main functions)
    // * =======================================
    async updateToken() : Promise<AccessTokenResponse> {
        const accessToken = this.lastAccessTokenResponse;

        if (!accessToken) {
            console.error('[SpotifyAuthService][updateToken][ERROR]: PRE_EMPTY_LAST_ACCESS_TOKEN_ERROR');
            return spotifyAuthErrorHandler('PRE_EMPTY_LAST_ACCESS_TOKEN_ERROR')
        }

        const tokenIssuedAt = new Date(accessToken.date).getTime();
        const tokenExpiresAt = tokenIssuedAt + (accessToken.data as AccessTokenSuccess).expires_in * 1000;
        const now = Date.now();

        if (now >= tokenExpiresAt) {
            const newAccessToken = await this.requestAccessToken();
            if (!newAccessToken || newAccessToken.status !== 200) {
                console.error("[SpotifyAuthService][updateToken][ERROR]: UPDATE_EXPIRED_TOKEN_ERROR");
                return spotifyAuthErrorHandler("EMPTY_REFRESH_TOKEN_ERROR")
            }

            this.lastAccessTokenResponse = newAccessToken;
        }

        if (!this.lastAccessTokenResponse) {
            console.error("[SpotifyAuthService][updateToken][ERROR]: POST_EMPTY_LAST_ACCESS_TOKEN_ERROR");
            return spotifyAuthErrorHandler("POST_EMPTY_LAST_ACCESS_TOKEN_ERROR")
        }

        return this.lastAccessTokenResponse;
    }

    // * =======================================
    // * Request Access Token from Spotify
    // * =======================================
    async requestAccessToken(grant_type = 'refresh_token', code?: string): Promise<AccessTokenResponse> {
        let params: URLSearchParams;

        if (grant_type === 'authorization_code') {
            if (code) {
                params = new URLSearchParams({
                    grant_type,
                    code,
                    redirect_uri: this.REDIRECT_URI,
                })
            } else {
                throw new Error('REQUEST_ACCESS_TOKEN_NO_CODE_ON_AUTH');
            }
        } else {
            params = new URLSearchParams({
                grant_type,
                refresh_token: process.env.SPOTIFY_REFRESH_TOKEN as string,
            });
        }

        const authHeader = `Basic ${(Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))}`;

        try {
            const response = await axios.post<AccessTokenSuccess>(
                this.API_URL,
                params.toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': authHeader,
                    }
                }
            );
            const data = response.data;

            return {
                status: 200,
                data: data,
                message: "Refresh access token acquired!",
                date: new Date()
            } as AccessTokenResponse;

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const errData = error.response?.data as AccessTokenError;
                
                console.error("[SpotifyAuthService][requestAccessToken][ERROR]: AXIOS_REFRESH_TOKEN_ERROR", status, errData.error, errData.error_description)
                return spotifyAuthErrorHandler("AXIOS_REFRESH_TOKEN_ERROR", errData, `${errData?.error_description}`)
            }

            console.error("[SpotifyAuthService][requestAccessToken][ERROR]: UNCAUGHT_REFRESH_TOKEN_ERROR", error);
            return spotifyAuthErrorHandler("UNCAUGHT_REFRESH_TOKEN_ERROR", undefined, `${(error as Error).message ?? `Something went wrong refreshing token.`}`)
        }
    }

    // * =======================================
    // * Renew Spotify 
    // * =======================================
    handleLogin(): string {
        const state = generateRandomString(16);
        const scope =
            'user-read-private user-read-email user-top-read user-read-currently-playing';

        this.appState = state;

        const authUrl =
            'https://accounts.spotify.com/authorize?' +
            new URLSearchParams({
                response_type: 'code',
                client_id: process.env.SPOTIFY_CLIENT_ID as string,
                scope: scope,
                redirect_uri: this.REDIRECT_URI,
                state: state,
                show_dialog: 'true'
            }).toString();

        console.log("[SpotifyAuthService][handleLogin][AuthUrl]:", authUrl);
        return authUrl;
    }

    // * =======================================
    // * Handle callback from Spotify
    // * =======================================
    async handleCallback(code: string, state: string, ubi: string): Promise<AccessTokenResponse | undefined> {
        console.info("[SpotifyAuthService][handleCallback][Query]:", code, state, ubi);
        
        if (state !== this.appState) {
            console.error("[SpotifyAuthService][handleCallback][ERROR]: App state is invalid. Discontinuing updating env variables.")
            // TODO: Alert my personal email that this happened using NodeMailer.
            return;
        } else {
            console.log("[SpotifyAuthService][handleCallback][SUCCESS]: App state is valid. Continuing updating env variables.")
            const newAccessToken = await this.requestAccessToken('authorization_code', code);

            return newAccessToken;
        }
    }
}
