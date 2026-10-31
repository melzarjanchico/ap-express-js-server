
import axios from "axios";

export class VercelService {
    public API_URL = "https://api.vercel.com";

    private VERCEL_TOKEN: string;
    private PROJECT_ID: string;
    private DEPLOY_HOOK_URL: string;

    constructor() {
        this.VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
        this.PROJECT_ID = process.env.VERCEL_PROJECT_ID!;
        this.DEPLOY_HOOK_URL = process.env.VERCEL_DEPLOY_HOOK_URL!;

        if (
            !this.VERCEL_TOKEN ||
            !this.PROJECT_ID ||
            !this.DEPLOY_HOOK_URL
        ) {
            throw new Error("Missing required Vercel environment variables.");
        }
    }

    private get headers() {
        return {
            Authorization: `Bearer ${this.VERCEL_TOKEN}`,
            "Content-Type": "application/json",
        };
    }

    // =======================================
    // Update environment variable from Melzarr API
    // =======================================
    async updateEnvVariable(envId: string, envKey: string, envValue: string) {
        const url = `${this.API_URL}/v9/projects/${this.PROJECT_ID}/env/${envId}`;
        console.log("[VercelService][updateEnvVariable][url]:", url, envId, envKey, envValue);

        const response = await axios.patch(
            url,
            {
                key: envKey,
                value: envValue,
            },
            {
                headers: this.headers,
            }
        );

        return response.data;
    }

    // =======================================
    // Create new deployment for Melzarr API
    // =======================================
    async createNewDeployment() {
        const response = await axios.post(
            this.DEPLOY_HOOK_URL
        );

        return response.data;
    }
}
