import { getRedis } from '../../../config/redis';
import { VSCodePresence } from '../../../models/objects';

const PRESENCE_KEY = 'vscode:presence';
const PRESENCE_TTL = 90;

export class VSCodePresenceService {

    public async updatePresence(presence: VSCodePresence): Promise<void> {
        const redis = getRedis();

        await redis.set(
            PRESENCE_KEY,
            presence,
            { ex: PRESENCE_TTL }
        );
    }

    public async getPresence(): Promise<VSCodePresence | null> {
        const redis = getRedis();

        return await redis.get<VSCodePresence>(PRESENCE_KEY);
    }

}