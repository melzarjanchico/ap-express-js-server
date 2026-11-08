import { Request, Response, NextFunction } from 'express';
import { timingSafeEqual } from 'crypto';

export const authenticateVSCode = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const apiToken = process.env.VSCODE_PRESENCE_API_TOKEN;
    const authorization = req.headers.authorization;

    if (!apiToken) {
        res.status(500).json({
            success: false,
            message: 'VS Code API authentication is not configured.'
        });

        return;
    }

    if (!authorization?.startsWith('Bearer ')) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized.'
        });

        return;
    }

    const token = authorization.slice(7);

    const providedToken = Buffer.from(token);
    const expectedToken = Buffer.from(apiToken);

    if (
        providedToken.length !== expectedToken.length ||
        !timingSafeEqual(providedToken, expectedToken)
    ) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized.'
        });

        return;
    }

    next();
};