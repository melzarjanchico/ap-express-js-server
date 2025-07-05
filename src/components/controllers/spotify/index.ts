import { Router, Request, Response } from 'express';
import { SpotifyMainService } from '../../services/spotify/main';
import { SpotifyAuthService } from '../../services/spotify/auth';

export default class SpotifyController {
  public router: Router;

  constructor(
    private authSvc: SpotifyAuthService,
    private mainSvc: SpotifyMainService
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Auth
    this.router.get('/refresh_token', this.postRefreshToken.bind(this))

    // Main
    this.router.get('/user', this.getUser.bind(this));
    this.router.get('/current_track', this.getCurrentTrack.bind(this));
    this.router.get('/tracks', this.getTopTracks.bind(this));
    this.router.get('/artists', this.getTopArtists.bind(this));
  }

  private async postRefreshToken(req: Request, res: Response) {
    const refreshToken = req.query.refresh_token as string;
    let updatedAccessToken;

    try {
      updatedAccessToken = await this.authSvc.updateToken(refreshToken);
    } catch (e) {
      res.status(500).json({
        status: 500,
        message: 'Something went wrong while updating the refresh token.'
      })
    }

    res.status(200).json({
      status: 200,
      data: updatedAccessToken,
      message: 'Refresh token updated.'
    })
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

}