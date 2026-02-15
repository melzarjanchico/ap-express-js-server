const steamErrors: Record<string, any> = {
    // GET OWNED GAMES ERRORS
    AXIOS_GET_OWNED_GAMES_ERROR: {
        message: "Unknown axios error encountered",
        type: "AXIOS_GET_OWNED_GAMES_ERROR",
        code: 500
    },
    UNCAUGHT_GET_OWNED_GAME_ERROR: {
        message: "Unknown uncaught error encountered",
        type: "UNCAUGHT_GET_OWNED_GAME_ERROR",
        code: 500
    },

    // GET PLAYER SUMMARY ERROR
    AXIOS_GET_PLAYER_SUMMARY_ERROR: {
        message: "Unknown axios error encountered",
        type: "AXIOS_GET_PLAYER_SUMMARY_ERROR",
        code: 500
    },
    UNCAUGHT_GET_PLAYER_SUMMARY_ERROR: {
        message: "Unknown uncaught error encountered",
        type: "UNCAUGHT_GET_PLAYER_SUMMARY_ERROR",
        code: 500
    },
}

export const steamErrorHandler = (type: string, data?: unknown, message?: string) => {
    const mappedError = steamErrors[type];
    return {
        status: mappedError.code,
        data: data,
        message: `${mappedError.message}${message ? `: ${message}` : ""}`,
        date: new Date(),
        type: mappedError.type
    }
}
