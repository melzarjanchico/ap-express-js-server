import { Router, Request, Response } from 'express';
import path from 'path';

export default class MainController {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.getServer);
    this.router.post('/echo', this.getEcho);
  }

  private getServer(req: Request, res: Response): void {
    const filePath = path.resolve('public', 'api.html');
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(500).send('Error loading documentation.');
        }
    });
}

  private getEcho(req: Request, res: Response) {
    res.status(200).json({
        message: 'You posted:',
        data: req.body
    })
  }
}
