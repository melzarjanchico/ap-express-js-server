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
            throw new Error('Invalid or missing access token obj in lastAccessTokenResponse.');
        }

        return accessTokenString;
    }

    // * =======================================
    // * Update Token
    // * =======================================
    async updateToken(manualRefreshToken?: string) : Promise<AccessTokenResponse> {
        const accessToken = this.lastAccessTokenResponse;

        if (!manualRefreshToken) {
            if (!accessToken) {
                console.error('PRE_EMPTY_LAST_ACCESS_TOKEN_ERROR');
                return spotifyAuthErrorHandler('PRE_EMPTY_LAST_ACCESS_TOKEN_ERROR')
            }

            const { expires_in, refresh_token } = accessToken.data as AccessTokenSuccess;

            if (!refresh_token) {
                console.error('EMPTY_REFRESH_TOKEN_ERROR', accessToken);
                return spotifyAuthErrorHandler("EMPTY_REFRESH_TOKEN_ERROR")
            }

            const tokenIssuedAt = new Date(accessToken.date).getTime();
            const tokenExpiresAt = tokenIssuedAt + expires_in * 1000;
            const now = Date.now();

            if (now >= tokenExpiresAt) {
                const newAccessToken = await this.refreshToken(refresh_token);
                if (!newAccessToken || newAccessToken.status !== 200 || !(newAccessToken.data as AccessTokenSuccess).refresh_token) {
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

        } else {
            const newAccessToken = await this.refreshToken(manualRefreshToken);
            if (!newAccessToken || newAccessToken.status !== 200) {
                throw new Error ('Something went wrong while refreshing token.')
            }

            if (!(newAccessToken.data as AccessTokenSuccess).refresh_token) {
                (newAccessToken.data as AccessTokenSuccess).refresh_token = manualRefreshToken;
            }

            this.lastAccessTokenResponse = newAccessToken;
            return this.lastAccessTokenResponse;
        }
    }

    // * =======================================
    // * Refresh Token
    // * =======================================
    async refreshToken(refreshToken: string): Promise<AccessTokenResponse> {
        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
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