import { Router, Request, Response } from 'express';
import { SpotifyMainService } from '../../services/spotify/main';

export default class SpotifyController {
  public router: Router;

  constructor(
    private mainSvc: SpotifyMainService
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Main
    this.router.get('/user', this.getUser.bind(this));
    this.router.get('/current_track', this.getCurrentTrack.bind(this));
    this.router.get('/tracks', this.getTopTracks.bind(this));
    this.router.get('/artists', this.getTopArtists.bind(this));
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