import { BookmarkItem } from "./BookmarkItem";

const { findChunks } = require("highlight-words-core");
export const stringifyBookmarkItem = (bookmark: BookmarkItem): string => {
    return `${bookmark.title}\t${bookmark.url}\t${bookmark.comment}\t${bookmark.date.toUTCString()}`;
};

export const matchBookmarkItem = (bookmark: BookmarkItem, searchWords: string[]) => {
    const text = stringifyBookmarkItem(bookmark);
    return (
        findChunks({
            textToHighlight: text,
            searchWords: searchWords,
            autoEscape: true,
            caseSensitive: true
        }).length > 0
    );
};
