import { Router, Request, Response, NextFunction } from 'express';
import { SpotifyMainService } from '../../services/spotify/main';
import { WrappedPlaylists } from '../../../data/wrapped';
import { spotifyErrorHandler } from '../../services/spotify/error';
import { SpotifyAuthService } from '../../services/spotify/auth';
import { VercelService } from '../../services/vercel';
import { AccessTokenResponse, AccessTokenSuccess } from '../../services/spotify/auth/models';

export default class SpotifyController {
  public router: Router;
  private ENV_VARIABLE_ID: string;
  private ENV_VARIABLE_KEY: string;

  constructor(
    private mainSvc: SpotifyMainService,
    private authSvc: SpotifyAuthService,
    private vercelSvc: VercelService
  ) {
    this.ENV_VARIABLE_ID = process.env.VERCEL_SPOTIFY_REFRESH_TOKEN_ENV_ID!;
    this.ENV_VARIABLE_KEY = process.env.VERCEL_SPOTIFY_REFRESH_TOKEN_ENV_KEY!;

    if (
        !this.ENV_VARIABLE_ID ||
        !this.ENV_VARIABLE_KEY
    ) {
        throw new Error("Missing required Spotify environment variables.");
    }

    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Auth
    this.router.get('/renew/callback', this.renewRefreshTokenCallback.bind(this));
    this.router.get('/renew', this.protectRenewEndpoint.bind(this), this.renewRefreshToken.bind(this));

    // Main
    this.router.get('/user', this.getUser.bind(this));
    this.router.get('/current_track', this.getCurrentTrack.bind(this));
    this.router.get('/tracks', this.getTopTracks.bind(this));
    this.router.get('/artists', this.getTopArtists.bind(this));
    this.router.get('/wrapped/:year', this.getWrappedByYear.bind(this));
  }

  private async getUser(req: Request, res: Response) {
    const userProfile = await this.mainSvc.getCurrentUser();
    res.status(userProfile.status).json(userProfile);
  }

  private async getCurrentTrack(req: Request, res: Response) {
    const currentTrack = await this.mainSvc.getCurrentTrack();
    res.status(currentTrack.status).json(currentTrack);
  }

  private async getTopTracks(req: Request, res: Response) {
    const timeRange = req.query.time_range as string;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;

    const topTracks = await this.mainSvc.getTopTracks(timeRange, limit, offset);
    res.status(topTracks.status).json(topTracks);
  }

  private async getTopArtists(req: Request, res: Response) {
    const timeRange = req.query.time_range as string;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;

    const topArtists = await this.mainSvc.getTopArtists(timeRange, limit, offset);
    res.status(topArtists.status).json(topArtists);
  }

  private async getWrappedByYear(req: Request, res: Response) {
    const year = req.params.year as string;
    const wrappedPlaylist = WrappedPlaylists[year];

    if (!wrappedPlaylist) {
      const error = spotifyErrorHandler("WRAPPED_INVALID_YEAR_ERROR")
      return res.status(error.status).json(error);
    }

    const match = wrappedPlaylist.match(/playlist\/([a-zA-Z0-9]+)/);
    const playlistId = match ? match[1] : null;

    if (!playlistId) {
      const error = spotifyErrorHandler("WRAPPED_PLAYLIST_ID_ERROR")
      return res.status(error.status).json(error);
    }

    const wrapped = await this.mainSvc.getPlaylist(playlistId!);
    res.status(200).json(wrapped);
  }

  private async renewRefreshToken(req: Request, res: Response) {
      const authUrl = this.authSvc.handleLogin();
      return res.redirect(authUrl);
  }

  private async renewRefreshTokenCallback(req: Request, res: Response) {
      const code = req.query.code as string;
      const state = req.query.state as string;
      const ubi = req.query.ubi as string;
      const accessToken = await this.authSvc.handleCallback(code, state, ubi);
      const refreshToken = (accessToken?.data as AccessTokenSuccess).refresh_token;

      if (accessToken && refreshToken) {
        await this.vercelSvc.updateEnvVariable(this.ENV_VARIABLE_ID, this.ENV_VARIABLE_KEY, refreshToken);
        await this.vercelSvc.createNewDeployment();
      }

      return res.redirect(process.env.SPOTIFY_CLIENT_URL || "http://127.0.0.1:3000");
  }

  private protectRenewEndpoint(
      req: Request,
      res: Response,
      next: NextFunction
  ) {
      const auth = req.headers.authorization;

      if (!auth || !auth.startsWith('Basic ')) {
          res.setHeader('WWW-Authenticate', 'Basic realm="Spotify Renewal"');
          return res.status(401).send('Authentication required.');
      }

      const credentials = Buffer.from(auth.slice(6), 'base64').toString('utf-8');
      const [username, password] = credentials.split(':');

      if (
          username !== process.env.SPOTIFY_RENEW_USERNAME ||
          password !== process.env.SPOTIFY_RENEW_PASSWORD
      ) {
          res.setHeader('WWW-Authenticate', 'Basic realm="Spotify Renewal"');
          return res.status(401).send('Invalid credentials.');
      }

      next();
  }
}
