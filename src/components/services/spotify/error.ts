import { AccessTokenError, AccessTokenResponse } from "./auth/models";
import { SpotityMainServiceResponse } from "./main/models"

const spotifyAuthErrors: Record<string, any> = {
    AXIOS_REFRESH_TOKEN_ERROR: {
        message: "Unknown axios error encountered",
        type: "AXIOS_REFRESH_TOKEN_ERROR",
        code: 500
    },
    UNCAUGHT_REFRESH_TOKEN_ERROR: {
        message: "Unknown uncaught error encountered",
        type: "UNCAUGHT_REFRESH_TOKEN_ERROR",
        code: 500
    }
}

const spotifyErrors: Record<string, any> = {
    EXPIRED_ACCESS_TOKEN: {
        message: "Access token is expired",
        type: "EXPIRED_ACCESS_TOKEN",
        code: 401
    },
    AXIOS_TOP_TRACK_ERROR: {
        message: "Unknown axios error encountered",
        type: "AXIOS_TOP_TRACK_ERROR",
        code: 500
    },
    UNCAUGHT_TOP_TRACK_ERROR: {
        message: "Unknown uncaught error encountered",
        type: "AXIOS_TOP_TRACK_ERROR",
        code: 500
    }
}

export const spotifyAuthErrorHandler = (type: string, data?: AccessTokenError, message?: string) : AccessTokenResponse => {
    const mappedError = spotifyAuthErrors[type];
    return {
        status: mappedError.code,
        data: data,
        message: `${mappedError.message}${message ? `: ${message}` : ""}`,
        date: new Date(),
        type: mappedError.type
    }
}

export const spotifyErrorHandler = (type: string, data?: unknown, message?: string) : SpotityMainServiceResponse => {
    const mappedError = spotifyErrors[type];
    return {
        status: mappedError.code,
        data: data,
        message: `${mappedError.message}${message ? `: ${message}` : ""}`,
        date: new Date(),
        type: mappedError.type
    }
}