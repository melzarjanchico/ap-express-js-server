import { Router, Request, Response } from 'express';

import { VSCodePresenceService } from '../../services/vscode';
import { authenticateVSCode } from '../../middlewares/vscode';
import { VSCodePresence } from '../../../models/objects';

export default class VSCodeController {

    public router: Router;

    constructor(
        private presenceSvc: VSCodePresenceService
    ) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            '/presence',
            authenticateVSCode,
            this.updatePresence
        );

        this.router.get(
            '/presence',
            this.getPresence
        );
    }

    private updatePresence = async (req: Request, res: Response) => {
        try {
            const presence = req.body as VSCodePresence;

            const validStatuses = ['coding', 'viewing', 'idle'];

            if (
                !presence ||
                typeof presence !== 'object' ||
                Array.isArray(presence) ||
                typeof presence.project !== 'string' ||
                typeof presence.workspace !== 'string' ||
                typeof presence.file !== 'string' ||
                typeof presence.language !== 'string' ||
                !validStatuses.includes(presence.status) ||
                !Number.isSafeInteger(presence.startedAtFile) ||
                !Number.isSafeInteger(presence.startedAtProject) ||
                !Number.isSafeInteger(presence.lastActivity)
            ) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid VS Code presence payload.'
                });

                return;
            }

            const updatedPresence: VSCodePresence = {
                project: presence.project.slice(0, 150),
                workspace: presence.workspace.slice(0, 150),
                file: presence.file.slice(0, 500),
                language: presence.language.slice(0, 50),
                status: presence.status,
                startedAtFile: presence.startedAtFile,
                startedAtProject: presence.startedAtProject,
                lastActivity: presence.lastActivity,
                updatedAt: Date.now()
            };

            await this.presenceSvc.updatePresence(updatedPresence);

            res.status(200).json({
                success: true,
                message: 'VS Code presence updated.',
                expiresIn: 90
            });

        } catch (error) {
            console.error('VSCODE_PRESENCE_UPDATE_ERROR:', error);

            res.status(500).json({
                success: false,
                message: 'Failed to update VS Code presence.'
            });
        }
    };

    private getPresence = async (_req: Request, res: Response) => {
        try {
            const presence = await this.presenceSvc.getPresence();

            if (!presence) {
                res.status(200).json({
                    status: 'offline',
                    presence: null
                });

                return;
            }

            res.status(200).json({
                status: 'online',
                presence
            });

        } catch (error) {
            console.error('VSCODE_PRESENCE_FETCH_ERROR:', error);

            res.status(500).json({
                success: false,
                message: 'Failed to retrieve VS Code presence.'
            });
        }
    };
}