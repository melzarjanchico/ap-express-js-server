import { AccessTokenError, AccessTokenResponse } from "./auth/models";
import { SpotityMainServiceResponse } from "./main/models"

const spotifyAuthErrors: Record<string, any> = {
    PRE_EMPTY_LAST_ACCESS_TOKEN_ERROR: {
        message: "Last access token saved in the server is empty pre-update.",
        type: "PRE_EMPTY_LAST_ACCESS_TOKEN_ERROR",
        code: 500
    },
    POST_EMPTY_LAST_ACCESS_TOKEN_ERROR: {
        message: "Last access token saved in the server is empty post-update.",
        type: "POST_EMPTY_LAST_ACCESS_TOKEN_ERROR",
        code: 500
    },
    EMPTY_REFRESH_TOKEN_ERROR: {
        message: "Last access token refresh token is empty.",
        type: "EMPTY_REFRESH_TOKEN_ERROR",
        code: 500
    },
    UPDATE_EXPIRED_TOKEN_ERROR: {
        message: "Something went wrong during updating expired token.",
        type: "UPDATE_EXPIRED_TOKEN_ERROR",
        code: 500
    },
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
    GET_ACCESS_TOKEN_ERROR: {
        message: "Error encountered during refresh, get, or update of access token.",
        type: "GET_ACCESS_TOKEN_ERROR",
        code: 500
    },
    EXPIRED_ACCESS_TOKEN: {
        message: "Access token is expired",
        type: "EXPIRED_ACCESS_TOKEN",
        code: 401
    },

    // TOP TRACKS ERRORS
    AXIOS_TOP_TRACK_ERROR: {
        message: "Unknown axios error encountered",
        type: "AXIOS_TOP_TRACK_ERROR",
        code: 500
    },
    UNCAUGHT_TOP_TRACK_ERROR: {
        message: "Unknown uncaught error encountered",
        type: "AXIOS_TOP_TRACK_ERROR",
        code: 500
    },

    // TOP ARTISTS ERROR
    AXIOS_TOP_ARTIST_ERROR: {
        message: "Unknown axios error encountered",
        type: "AXIOS_TOP_ARTIST_ERROR",
        code: 500
    },
    UNCAUGHT_TOP_ARTIST_ERROR: {
        message: "Unknown uncaught error encountered",
        type: "UNCAUGHT_TOP_ARTIST_ERROR",
        code: 500
    },

    // USER PROFILE ERRORS
    AXIOS_USER_PROFILE_ERROR: {
        message: "Unknown axios error encountered",
        type: "AXIOS_USER_PROFILE_ERROR",
        code: 500
    },
    UNCAUGHT_USER_PROFILE_ERROR: {
        message: "Unknown uncaught error encountered",
        type: "UNCAUGHT_USER_PROFILE_ERROR",
        code: 500
    },

    // CURRENT TRACK ERRORS
    AXIOS_CURRENT_TRACK_ERROR: {
        message: "Unknown axios error encountered",
        type: "AXIOS_CURRENT_TRACK_ERROR",
        code: 500
    },
    UNCAUGHT_CURRENT_TRACK_ERROR: {
        message: "Unknown uncaught error encountered",
        type: "UNCAUGHT_CURRENT_TRACK_ERROR",
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