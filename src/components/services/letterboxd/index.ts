import axios from 'axios';
import { Film } from '../../../models/objects';
import { letterboxdErrorHandler } from './error';
import { formatDate } from './helper';

export class LetterboxdService {
  // RSS feed URL, set via env var or fallback to example
  private RSS_URL: string | undefined;

  constructor() {
      this.RSS_URL = process.env.LETTERBOXD_RSS_URL;
  }

  async getRecentWatches() {
    const url = this.RSS_URL || "";

    try {
      const response = await axios.get<string>(url);
      const xml = response.data;

      const items: Film[] = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match: RegExpExecArray | null;

      while ((match = itemRegex.exec(xml)) !== null) {
        const itemXml = match[1];

        const fullTitleTagMatch = /<title>([^<]*)<\/title>/i.exec(itemXml);
        const titleMatch = /<letterboxd:filmTitle>([^<]*)<\/letterboxd:filmTitle>/i.exec(itemXml);
        const ratingMatch = /<letterboxd:memberRating>([^<]*)<\/letterboxd:memberRating>/i.exec(itemXml);
        const watchedDateMatch = /<letterboxd:watchedDate>([^<]*)<\/letterboxd:watchedDate>/i.exec(itemXml);
        const yearMatch = /<letterboxd:filmYear>([^<]*)<\/letterboxd:filmYear>/i.exec(itemXml);
        const rewatchMatch = /<letterboxd:rewatch>([^<]*)<\/letterboxd:rewatch>/i.exec(itemXml);
        const likeMatch = /<letterboxd:memberLike>([^<]*)<\/letterboxd:memberLike>/i.exec(itemXml);
        const imgMatch = /<img\s+src="([^"]+)"/i.exec(itemXml);

        let stars = "";

        if (fullTitleTagMatch) {
          const fullTitleText = fullTitleTagMatch[1];
          const starsExtraction = /([★☆½]+)$/.exec(fullTitleText.trim());
          stars = starsExtraction ? starsExtraction[1] : "";
        }

        if (titleMatch && ratingMatch && watchedDateMatch && imgMatch && yearMatch && rewatchMatch && likeMatch) {
          items.push({
            title: titleMatch[1].trim(),
            year: yearMatch[1].trim(),
            isLiked: likeMatch[1].trim() === "Yes",
            isRewatched: rewatchMatch[1].trim() === "Yes",
            watchedDate: formatDate(watchedDateMatch[1].trim()) ?? watchedDateMatch[1].trim(),
            rating: parseFloat(ratingMatch[1]),
            stars: stars,
            imageUrl: imgMatch[1].trim(),
          });
        }
      }

      return items.slice(0, 10);
    } catch (error) {
      console.error('UNCAUGHT_GET_OWNED_GAME_ERROR', error);
      return letterboxdErrorHandler("UNCAUGHT_GET_PLAYER_SUMMARY_ERROR", error);
    }
  }
}
