import { Request, Response, NextFunction } from 'express';

export const protectRenewEndpoint = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith('Basic ')) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Spotify Renewal"');
        return res.status(401).send('Authentication required.');
    }

    const credentials = Buffer.from(auth.slice(6), 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    if (
        username !== process.env.SPOTIFY_RENEW_USERNAME ||
        password !== process.env.SPOTIFY_RENEW_PASSWORD
    ) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Spotify Renewal"');
        return res.status(401).send('Invalid credentials.');
    }

    next();
}