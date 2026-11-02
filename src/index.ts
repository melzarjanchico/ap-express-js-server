// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import SpotifyController from './components/controllers/spotify';
// import MainController from './components/controllers/main';
// import { SpotifyMainService } from './components/services/spotify/main';
// import { SpotifyAuthService } from './components/services/spotify/auth';
// import { SteamService } from './components/services/steam';
// import { LetterboxdService } from './components/services/letterboxd';
// import { LastfmService } from './components/services/lastfm';
// import LetterboxdController from './components/controllers/letterboxd';
// import SteamController from './components/controllers/steam';
// import LastfmController from './components/controllers/lastfm';
// import { VercelService } from './components/services/vercel';

// const main = async () => {
//   if (process.env.NODE_ENV !== 'production') {
//     dotenv.config();
//   }

//   const app = express();
//   const port = process.env.PORT || 3000;

//   const allowedOrigins = [
//     'http://localhost:5173',
//     'https://melzarjanchico-dev.vercel.app',
//     'https://melzarr-spotify-stats.vercel.app'
//   ];

//   app.use(cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('CORS not allowed'));
//       }
//     },
//     credentials: true
//   }));

//   app.use(express.json());

//   // Mount routes that don't depend on external services.
//   const mainController = new MainController();
//   app.use('/', mainController.router);

//   // Start the API server.
//   app.listen(port, () => {
//     console.log(`[Server] Melzar API running at http://127.0.0.1:${port}`);
//   });

//   // Initialize each service independently.
//   const initializeService = async (
//     name: string,
//     initialize: () => Promise<void> | void
//   ) => {
//     try {
//       await initialize();
//       console.log(`[${name}] Service initialized successfully.`);
//     } catch (error) {
//       console.error(`[${name}] Service initialization failed:`, error);
//     }
//   };

//   const vercelService = new VercelService();

//   await initializeService('Spotify', async () => {
//     const spotifyAuthService = new SpotifyAuthService();
//     await spotifyAuthService.createToken();

//     const spotifyMainService = new SpotifyMainService(spotifyAuthService);
//     const spotifyController = new SpotifyController(spotifyMainService, spotifyAuthService, vercelService);

//     app.use('/spotify', spotifyController.router);
//   });

//   await initializeService('Steam', () => {
//     const steamService = new SteamService();
//     const steamController = new SteamController(steamService);

//     app.use('/steam', steamController.router);
//   });

//   await initializeService('Letterboxd', () => {
//     const letterboxdService = new LetterboxdService();
//     const letterboxdController = new LetterboxdController(letterboxdService);

//     app.use('/letterboxd', letterboxdController.router);
//   });

//   await initializeService('Last.fm', () => {
//     const lastfmService = new LastfmService();
//     const lastfmController = new LastfmController(lastfmService);

//     app.use('/lastfm', lastfmController.router);
//   });
// };

// main().catch((error) => {
//   console.error('[Server] Failed to initialize:', error);
// });

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import SpotifyController from './components/controllers/spotify';
import MainController from './components/controllers/main';
import { SpotifyMainService } from './components/services/spotify/main';
import { SpotifyAuthService } from './components/services/spotify/auth';
import { SteamService } from './components/services/steam';
import { LetterboxdService } from './components/services/letterboxd';
import { LastfmService } from './components/services/lastfm';
import LetterboxdController from './components/controllers/letterboxd';
import SteamController from './components/controllers/steam';
import LastfmController from './components/controllers/lastfm';
import { VercelService } from './components/services/vercel';

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
  const vercelService = new VercelService();
  const spotifyAuthService = new SpotifyAuthService();
  await spotifyAuthService.createToken();

  const spotifyMainService = new SpotifyMainService(spotifyAuthService);
  const steamService = new SteamService();
  const letterboxdService = new LetterboxdService();
  const lastfmService = new LastfmService();

  // Instantiate and mount controllers
  const mainController = new MainController();
  const spotifyController = new SpotifyController(spotifyMainService, spotifyAuthService, vercelService);
  const steamController = new SteamController(steamService);
  const letterboxdController = new LetterboxdController(letterboxdService);
  const lastfmController = new LastfmController(lastfmService);

  app.use('/', mainController.router);
  app.use('/spotify', spotifyController.router);
  app.use('/steam', steamController.router);
  app.use('/letterboxd', letterboxdController.router);
  app.use('/lastfm', lastfmController.router);

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

}

main()
