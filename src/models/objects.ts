export interface Image {
    height: number,
    url: string,
    width: number,
}

export interface User {
    country: string,
    display_name: string,
    email: string,
    external_urls: {
        spotify: string
    },
    followers: {
        total: number
    },
    id: string,
    images: Image[],
    product: string,
    type: string,
    uri: string
}

export interface Artist {
    external_urls: {
        spotify: string
    },
    followers: {
        total: number
    },
    genres: string[],
    id: string,
    images: Image[],
    name: string,
    popularity: number,
    type: string,
    uri: string
}

export interface SimplifiedArtist {
    external_urls: {
        spotify: string
    },
    id: string,
    name: string,
    type: string,
    uri: string
}

export interface Album {
    album_type: string,
    artists: SimplifiedArtist[],
    external_urls: {
        spotify: string
    },
    id: string,
    images: Image[],
    name: string,
    release_date: string,
    total_tracks: number,
    type: string,
    uri: string
}

export interface Track {
    album: Album,
    artists: SimplifiedArtist[],
    disc_number: number,
    explicit: boolean,
    external_urls: {
        spotify: string
    },
    id: string,
    is_local: boolean,
    name: string,
    popularity: number,
    preview_url: string | null,
    track_number: number,
    type: string,
    uri: string
}

