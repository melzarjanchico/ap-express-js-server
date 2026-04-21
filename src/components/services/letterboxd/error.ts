const letterboxdErrors: Record<string, any> = {
    // GET OWNED GAMES ERRORS
    AXIOS_GET_RECENT_FILMS_ERROR: {
        message: "Unknown axios error encountered",
        type: "AXIOS_GET_RECENT_FILMS_ERROR",
        code: 500
    },
    UNCAUGHT_GET_RECENT_FILMS_ERROR: {
        message: "Unknown uncaught error encountered",
        type: "UNCAUGHT_GET_RECENT_FILMS_ERROR",
        code: 500
    },
}

export const letterboxdErrorHandler = (type: string, data?: unknown, message?: string) => {
    const mappedError = letterboxdErrors[type];
    return {
        status: mappedError.code,
        data: data,
        message: `${mappedError.message}${message ? `: ${message}` : ""}`,
        date: new Date(),
        type: mappedError.type
    }
}
