import express from 'express';
import dotenv from 'dotenv';
import SpotifyController from './components/controllers/spotify';
import MainController from './components/controllers/main';
import { SpotifyMainService } from './components/services/spotify/main';

const main = async () => {

  if (process.env.NODE_ENV !== 'production') {
      dotenv.config()
  }

  const app = express();
  const port = process.env.PORT || 5000;

  // Add this middleware to enable JSON body parsing
  app.use(express.json());

  // Instantiate and mount services
  const spotifyService = new SpotifyMainService();

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