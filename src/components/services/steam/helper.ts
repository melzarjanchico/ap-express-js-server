export const getSteamImages = (appid: number, iconHash: string) => {
    return {
        imgIconUrl: `https://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${iconHash}.jpg`,
        imgHeroCapsuleUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/hero_capsule.jpg`,
        imgSmallCapsuleUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/capsule_231x87.jpg`,
        imgBigCapsuleUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/capsule_616x353.jpg`,
        imgHeaderUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/header.jpg`,
    }
}

export const minutesToReadable = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;

    return `${hours}h ${mins}m`;
};

export const convertPlaytime = (unixSeconds?: number): string | null => {
    if (!unixSeconds) return null;

    return new Date(unixSeconds * 1000).toLocaleString("en-PH", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};
