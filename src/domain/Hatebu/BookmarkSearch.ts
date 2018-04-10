import { BookmarkItem } from "./BookmarkItem";

const memoize = require("micro-memoize").default;
const regexCombiner = require("regex-combiner");
const stringifyBookmarkItem = (bookmark: BookmarkItem): string => {
    return `${bookmark.title}\t${bookmark.url}\t${bookmark.comment}\t${bookmark.date.toString()}`;
};

const memorizedStringifyBookmarkItem = memoize(stringifyBookmarkItem);
const memoriezdRegexCombiner = memoize(regexCombiner);
export const matchBookmarkItem = (bookmark: BookmarkItem, searchWords: string[]): boolean => {
    const text = memorizedStringifyBookmarkItem(bookmark);
    const combined = memoriezdRegexCombiner(searchWords);
    if (!combined.test(text)) {
        return false;
    }
    if (searchWords.length === 1) {
        return true;
    }
    // multiple words as & search
    return searchWords.every(searchWord => {
        return text.indexOf(searchWord) !== -1;
    });
};
