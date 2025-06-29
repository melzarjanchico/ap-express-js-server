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
    this.router.get('/tracks', this.getTopTracks.bind(this));
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

  private async getTopTracks(req: Request, res: Response) {
    const timeRange = req.query.time_range as string;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;

    const topTracks = await this.mainSvc.getCurrentTrack(timeRange, limit, offset);
    res.status(topTracks.status).json(topTracks);
  }
}