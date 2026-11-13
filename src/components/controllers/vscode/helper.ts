// ========================================================================================
// Credit: Utility function, language.json, and logo images from iCrawl/discord-vscode extension.
// ========================================================================================

import { basename } from "node:path";
import LANG from '../../../data/vscode/languages.json';

// TODO: Fetch the languages.json instead of putting it in /data in case new languages were added in iCrawl/discord-vscode repo.
export const KNOWN_EXTENSIONS: { [key: string]: { image: string } } = LANG.KNOWN_EXTENSIONS;
export const KNOWN_LANGUAGES: { image: string; language: string }[] = LANG.KNOWN_LANGUAGES;

export function resolveFileIcon(vsFilename: string, vsLangId: string) {
	const filename = basename(vsFilename);
	const findKnownExtension = Object.keys(KNOWN_EXTENSIONS).find((key) => {
		if (filename.endsWith(key)) {
			return true;
		}

		const match = /^\/(.*)\/([gimy]+)$/.exec(key);
		if (!match) {
			return false;
		}

		const regex = new RegExp(match[1] as string, match[2] as string);
		return regex.test(filename);
	});
	const findKnownLanguage = KNOWN_LANGUAGES.find((key) => key.language === vsLangId);
	const fileIcon = findKnownExtension
		? KNOWN_EXTENSIONS[findKnownExtension]
		: findKnownLanguage
			? findKnownLanguage.image
			: null;

	return typeof fileIcon === 'string' ? fileIcon : (fileIcon?.image ?? 'text');
}