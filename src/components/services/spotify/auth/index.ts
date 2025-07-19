import axios from "axios";
import { AccessTokenError, AccessTokenResponse, AccessTokenSuccess } from "./models";
import { spotifyAuthErrorHandler } from "../error";

export class SpotifyAuthService {

    public API_URL = "https://accounts.spotify.com/api/token";
    public REDIRECT_URI = (process.env.NODE_ENV === "production") ? `${process.env.CLIENT_URL}/callback` : "http://localhost:3000/callback";

    public lastAccessTokenResponse: AccessTokenResponse | null;

    constructor() {
        this.lastAccessTokenResponse = null;
    }

    // * =======================================
    // * Get Token
    // * =======================================
    async getToken(): Promise<string> {
        const accessToken = this.lastAccessTokenResponse;
        const accessTokenString = accessToken ? (accessToken.data as AccessTokenSuccess).access_token : '';

        if (!accessToken || !accessTokenString) {
            console.error("[SpotifyAuthService][getToken] Invalid or missing access token obj in lastAccessTokenResponse.");
            throw new Error('GET_TOKEN_NO_REFRESH_TOKEN_ERROR');
        }

        return accessTokenString;
    }

    // * =======================================
    // * Create Token
    // * =======================================
    async createToken(): Promise<void> {
        const newAccessToken = await this.refreshToken();

        if (!newAccessToken || newAccessToken.status !== 200) {
            console.error("[SpotifyAuthService][createToken] No access token created on refreshToken.");
            throw new Error('CREATE_TOKEN_NO_TOKEN_ERROR')
        }

        this.lastAccessTokenResponse = newAccessToken;
    }

    // * =======================================
    // * Update Token
    // * =======================================
    async updateToken() : Promise<AccessTokenResponse> {
        const accessToken = this.lastAccessTokenResponse;

        if (!accessToken) {
            console.error('PRE_EMPTY_LAST_ACCESS_TOKEN_ERROR');
            return spotifyAuthErrorHandler('PRE_EMPTY_LAST_ACCESS_TOKEN_ERROR')
        }

        const tokenIssuedAt = new Date(accessToken.date).getTime();
        const tokenExpiresAt = tokenIssuedAt + (accessToken.data as AccessTokenSuccess).expires_in * 1000;
        const now = Date.now();

        if (now >= tokenExpiresAt) {
            const newAccessToken = await this.refreshToken();
            if (!newAccessToken || newAccessToken.status !== 200) {
                console.error("UPDATE_EXPIRED_TOKEN_ERROR");
                return spotifyAuthErrorHandler("EMPTY_REFRESH_TOKEN_ERROR")
            }

            this.lastAccessTokenResponse = newAccessToken;
        }

        if (!this.lastAccessTokenResponse) {
            console.error("POST_EMPTY_LAST_ACCESS_TOKEN_ERROR");
            return spotifyAuthErrorHandler("POST_EMPTY_LAST_ACCESS_TOKEN_ERROR")
        }

        return this.lastAccessTokenResponse;
    }

    // * =======================================
    // * Refresh Token
    // * =======================================
    async refreshToken(): Promise<AccessTokenResponse> {
        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: process.env.REFRESH_TOKEN as string,
        });
        const authHeader = `Basic ${(Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))}`;

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
                
                console.error("AXIOS_REFRESH_TOKEN_ERROR", status, errData.error, errData.error_description)
                return spotifyAuthErrorHandler("AXIOS_REFRESH_TOKEN_ERROR", errData, `${errData?.error_description}`)
            }

            console.error("UNCAUGHT_REFRESH_TOKEN_ERROR", error);
            return spotifyAuthErrorHandler("UNCAUGHT_REFRESH_TOKEN_ERROR", undefined, `${(error as Error).message ?? `Something went wrong refreshing token.`}`)
        }
    }
}