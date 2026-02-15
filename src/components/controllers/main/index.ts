import { Router, Request, Response } from 'express';

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
    res.send('Hello from TypeScript Express!');
  }

  private getEcho(req: Request, res: Response) {
    res.status(200).json({
        message: 'You posted:',
        data: req.body
    })
  }
}
