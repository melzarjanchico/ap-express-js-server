import axios from 'axios';
import { LetterboxdWatch } from '../../../models/objects';

export class LetterboxdService {
  // RSS feed URL, set via env var or fallback to example
  private RSS_URL: string = process.env.LETTERBOXD_RSS_URL || 'https://letterboxd.com/razboi/rss';

  /**
   * Fetch the RSS feed and return a list of recent watches.
   */
  async getRecentWatches(): Promise<LetterboxdWatch[]> {
    try {
      const response = await axios.get<string>(this.RSS_URL);
      const xml = response.data;

      const items: LetterboxdWatch[] = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match: RegExpExecArray | null;
      while ((match = itemRegex.exec(xml)) !== null) {
        const itemXml = match[1];
        const titleMatch = /<letterboxd:filmTitle>([^<]*)<\/letterboxd:filmTitle>/i.exec(itemXml);
        const ratingMatch = /<letterboxd:memberRating>([^<]*)<\/letterboxd:memberRating>/i.exec(itemXml);
        const watchedDateMatch = /<letterboxd:watchedDate>([^<]*)<\/letterboxd:watchedDate>/i.exec(itemXml);
        const imgMatch = /<img\s+src="([^"]+)"/i.exec(itemXml);

        if (titleMatch && ratingMatch && watchedDateMatch && imgMatch) {
          items.push({
            title: titleMatch[1].trim(),
            rating: parseFloat(ratingMatch[1]),
            watchedDate: watchedDateMatch[1].trim(),
            imageUrl: imgMatch[1].trim(),
          });
        }
      }
      return items;
    } catch (error) {
      console.error('LETTERBOXD_FETCH_ERROR', error);
      return [];
    }
  }
}
