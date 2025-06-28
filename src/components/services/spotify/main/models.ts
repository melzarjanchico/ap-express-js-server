import { Track } from "../../../../models/objects";

export interface SpotityMainServiceResponse {
    status: number,
    data: unknown,
    message: string,
    type?: string,
    date: Date
}

export interface SpotifyMainServiceErrorResponse {
    error: {
        status: number,
        message: string
    }
}

export interface TopTracksSuccessResponse {
    href: string,
    items: Track[],
    limit: number,
    next: string | null,
    offset: number,
    previous: string | null,
    total: number
}