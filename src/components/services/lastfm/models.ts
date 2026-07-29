export interface LastfmImage {
    size: "small" | "medium" | "large" | "extralarge" | "mega";
    "#text": string;
}

export interface LastfmPagination {
    user: string;
    total: string;
    page: string;
    totalPages: string;
    perPage: string;
}

export interface LastfmArtistSummary {
    name: string;
    mbid: string;
    url: string;
}

export interface LastfmAlbumSummary {
    mbid: string;
    "#text": string;
    url: string;
}

export interface LastfmTrack {
    artist: LastfmArtistSummary & {
        "#text": string;
    };
    streamable:
        | {
              fulltrack: string;
              "#text": string;
          }
        | string;
    image: LastfmImage[];
    mbid: string;
    album: LastfmAlbumSummary;
    name: string;
    "@attr"?: {
        nowplaying?: "true";
        rank?: string;
    };
    url: string;
    date?: {
        uts: string;
        "#text": string;
    };
    duration: string;
    playcount: string;
}

export interface LastfmTopTrack {
    name: string;
    duration: string;
    playcount: string;
    listeners: string;
    mbid: string;
    url: string;
    streamable: string;
    image: LastfmImage[];
    artist: LastfmArtistSummary;
    "@attr": {
        rank: string;
    };
}

export interface LastfmTopArtist {
    name: string;
    playcount: string;
    listeners: string;
    mbid: string;
    url: string;
    streamable: string;
    image: LastfmImage[];
    "@attr": {
        rank: string;
    };
}

export interface LastfmTopAlbum {
    name: string;
    playcount: string;
    mbid: string;
    url: string;
    image: LastfmImage[];
    artist: LastfmArtistSummary;
    "@attr": {
        rank: string;
    };
}

export interface GetRecentTracksResponse {
    recenttracks: {
        track: LastfmTrack[];
        "@attr": LastfmPagination;
    };
}

export interface GetTopTracksResponse {
    toptracks: {
        track: LastfmTopTrack[];
        "@attr": LastfmPagination;
    };
}

export interface GetTopArtistsResponse {
    topartists: {
        artist: LastfmTopArtist[];
        "@attr": LastfmPagination;
    };
}

export interface GetTopAlbumsResponse {
    topalbums: {
        album: LastfmTopAlbum[];
        "@attr": LastfmPagination;
    };
}