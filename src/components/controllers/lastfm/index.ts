import { Router, Request, Response } from 'express';
import { LastfmService } from '../../services/lastfm';

export default class LastfmController {
  public router: Router;

  constructor(
    private mainSvc: LastfmService
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Main
    this.router.get('/recent_track', this.getRecentTrack.bind(this));
    this.router.get('/top_tracks', this.getTopTracks.bind(this));
    this.router.get('/top_artists', this.getTopArtists.bind(this));
    this.router.get('/top_albums', this.getTopAlbums.bind(this));
  }

  private async getRecentTrack(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const response = await this.mainSvc.getRecentTrack(limit);
    res.status(200).json(response);
  }

  private async getTopTracks(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const period = req.query.period ? String(req.query.period) : undefined;

    const response = await this.mainSvc.getTopTracks(limit, period);
    res.status(200).json(response);
  }

  private async getTopArtists(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const period = req.query.period ? String(req.query.period) : undefined;

    const response = await this.mainSvc.getTopArtists(limit, period);
    res.status(200).json(response);
  }

  private async getTopAlbums(req: Request, res: Response) {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const period = req.query.period ? String(req.query.period) : undefined;

    const response = await this.mainSvc.getTopAlbums(limit, period);
    res.status(200).json(response);
  }
}
