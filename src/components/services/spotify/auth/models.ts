export interface AccessTokenResponse {
    status: number,
    data: unknown,
    message: string
    type?: string
    date: Date
}

export interface AccessTokenSuccess {
    access_token: string,
    token_type: string,
    scope: string,
    expires_in: number,
    refresh_token?: string
}

export interface AccessTokenError {
    error: string,
    error_description: string
}