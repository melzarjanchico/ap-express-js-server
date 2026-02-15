import { Router, Request, Response } from 'express';
import { SteamMainService } from '../../services/steam';

export default class SteamController {
  public router: Router;

  constructor(
    private mainSvc: SteamMainService
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Main
    this.router.get('/owned_games', this.getOwnedGames.bind(this));
    this.router.get('/current_game', this.getCurrentGame.bind(this));
  }

  private async getOwnedGames(req: Request, res: Response) {
    const ownedGames = await this.mainSvc.getOwnedGames();
    res.status(200).json(ownedGames);
  }

  private async getCurrentGame(req: Request, res: Response) {
    const currentGame = await this.mainSvc.getCurrentGame();
    res.status(200).json(currentGame);
  }
}
