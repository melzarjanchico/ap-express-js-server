import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import SpotifyController from './components/controllers/spotify';
import MainController from './components/controllers/main';
import { SpotifyMainService } from './components/services/spotify/main';
import { SpotifyAuthService } from './components/services/spotify/auth';
import { SteamMainService } from './components/services/steam';
import { LetterboxdService } from './components/services/letterboxd';
import LetterboxdController from './components/controllers/letterboxd';
import SteamController from './components/controllers/steam';

const main = async () => {

  if (process.env.NODE_ENV !== 'production') {
      dotenv.config()
  }

  const app = express();
  const port = process.env.PORT || 3000;

  // TODO: Put this in env var.
  const allowedOrigins = [
    'http://localhost:5173',
    'https://melzarjanchico-dev.vercel.app',
    'https://melzarr-spotify-stats.vercel.app'
  ];

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

  const steamService = new SteamMainService();
  const letterboxdService = new LetterboxdService();

  // Instantiate and mount controllers
  const mainController = new MainController();
  const spotifyController = new SpotifyController(spotifyService);
  const steamController = new SteamController(steamService);
  const letterboxdController = new LetterboxdController(letterboxdService);

  app.use('/', mainController.router);
  app.use('/spotify', spotifyController.router);
  app.use('/steam', steamController.router);
  app.use('/letterboxd', letterboxdController.router);

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

}

main()
