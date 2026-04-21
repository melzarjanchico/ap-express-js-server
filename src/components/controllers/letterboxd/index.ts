import { Router, Request, Response } from 'express';
import { LetterboxdService } from '../../services/letterboxd';

export default class LetterboxdController {
  public router: Router;
  private service: LetterboxdService;

  constructor(service: LetterboxdService) {
    this.service = service;
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/recent', this.getRecentWatches.bind(this));
  }

  private async getRecentWatches(req: Request, res: Response) {
    const watches = await this.service.getRecentWatches();
    res.status(200).json(watches);
  }
}
