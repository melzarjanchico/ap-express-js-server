const lastfmErrors: Record<string, any> = {
    // GET RECENT TRACK ERRORS
    AXIOS_RECENT_TRACK_ERROR: {
        message: "Unknown axios error encountered",
        type: "AXIOS_RECENT_TRACK_ERROR",
        code: 500
    },
    UNCAUGHT_RECENT_TRACK_ERROR: {
        message: "Unknown uncaught error encountered",
        type: "UNCAUGHT_RECENT_TRACK_ERROR",
        code: 500
    },

    // GET TOP ARTISTS ERROR
    AXIOS_TOP_ARTISTS_ERROR: {
        message: "Unknown axios error encountered",
        type: "AXIOS_TOP_ARTISTS_ERROR",
        code: 500
    },
    UNCAUGHT_TOP_ARTISTS_ERROR: {
        message: "Unknown uncaught error encountered",
        type: "UNCAUGHT_TOP_ARTISTS_ERROR",
        code: 500
    },

    // GET TOP ALBUMS
    AXIOS_TOP_ALBUMS_ERROR: {
        message: "Unknown axios error encountered",
        type: "AXIOS_TOP_ALBUMS_ERROR",
        code: 500
    },
    UNCAUGHT_TOP_ALBUMS_ERROR: {
        message: "Unknown uncaught error encountered",
        type: "UNCAUGHT_TOP_ALBUMS_ERROR",
        code: 500
    },

    // GET TOP TRACKS
    AXIOS_TOP_TRACKS_ERROR: {
        message: "Unknown axios error encountered",
        type: "AXIOS_TOP_TRACKS_ERROR",
        code: 500
    },
    UNCAUGHT_TOP_TRACKS_ERROR: {
        message: "Unknown uncaught error encountered",
        type: "UNCAUGHT_TOP_TRACKS_ERROR",
        code: 500
    },
}

export const lastfmErrorHandler = (type: string, data?: unknown, message?: string) => {
    const mappedError = lastfmErrors[type];
    return {
        status: mappedError.code,
        data: data,
        message: `${mappedError.message}${message ? `: ${message}` : ""}`,
        date: new Date(),
        type: mappedError.type
    }
}