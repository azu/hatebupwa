import { BookmarkItem } from "./BookmarkItem";

const memoize = require("micro-memoize").default;
const regexCombiner = require("regex-combiner");

const stringifyBookmarkItem = (bookmark: BookmarkItem): string => {
    return `${bookmark.props.title}\t${bookmark.props.url}\t${
        bookmark.props.comment
    }\t${bookmark.props.date.toString()}`
        .toString()
        .toLowerCase();
};

const memorizedStringifyBookmarkItem = memoize(stringifyBookmarkItem);
const memoriezdRegexCombiner = memoize((searchWord: string[]) => {
    const pattern = regexCombiner(searchWord);
    return new RegExp(pattern.source, "i");
});
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
    return searchWords.every((searchWord) => {
        return text.indexOf(searchWord.toLowerCase()) !== -1;
    });
};
