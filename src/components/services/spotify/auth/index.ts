import axios from "axios";
import { AccessTokenError, AccessTokenResponse, AccessTokenSuccess } from "./models";
import { spotifyAuthErrorHandler } from "../error";

export class SpotifyAuthService {

    public API_URL = "https://accounts.spotify.com/api/token";
    public REDIRECT_URI = (process.env.NODE_ENV === "production") ? `${process.env.CLIENT_URL}/callback` : "http://localhost:3000/callback";

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