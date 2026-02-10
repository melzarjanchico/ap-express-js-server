import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import SpotifyController from './components/controllers/spotify';
import MainController from './components/controllers/main';
import { SpotifyMainService } from './components/services/spotify/main';
import { SpotifyAuthService } from './components/services/spotify/auth';

const main = async () => {

  if (process.env.NODE_ENV !== 'production') {
      dotenv.config()
  }

  const app = express();
  const port = process.env.PORT || 3000;

  const allowedOrigins = ['http://localhost:5173', 'https://my-app.vercel.app'];

  app.use(cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS not allowed'));
      }
    },
    credentials: true
  }));

  // Add this middleware to enable JSON body parsing
  app.use(express.json());

  // Instantiate and mount services
  const spotifyAuthService = new SpotifyAuthService();
  await spotifyAuthService.createToken();

  const spotifyService = new SpotifyMainService(spotifyAuthService);

  // Instantiate and mount controllers
  const mainController = new MainController();
  const spotifyController = new SpotifyController(spotifyService);

  app.use('/', mainController.router);
  app.use('/spotify', spotifyController.router);

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

}

main()