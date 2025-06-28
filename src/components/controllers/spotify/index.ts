import { Router, Request, Response } from 'express';
import { SpotifyMainService } from '../../services/spotify/main';

export default class SpotifyController {
  public router: Router;

  constructor(
    private svc: SpotifyMainService
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/tracks', this.getTopTracks.bind(this));
  }

  private async getTopTracks(req: Request, res: Response) {
    const token = req.query.token as string;
    const timeRange = req.query.time_range as string;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;

    const topTracks = await this.svc.getCurrentTrack(token, timeRange, limit, offset);
    res.status(topTracks.status).json(topTracks);
  }
}