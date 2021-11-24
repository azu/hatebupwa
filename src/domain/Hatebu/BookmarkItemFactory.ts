import { BookmarkItem } from "./BookmarkItem";
import { BookmarkDate } from "./BookmarkDate";

export type RawHatenaBookmark = {
    title: string;
    comment: string;
    url: string;
    date: Date;
};

export const createBookmarkItemFromJSON = (itemJSON: RawHatenaBookmark) => {
    return new BookmarkItem({
        title: itemJSON.title,
        comment: itemJSON.comment,
        url: itemJSON.url,
        date: new BookmarkDate(itemJSON.date)
    });
};

export const convertItems = (items: RawHatenaBookmark[]) => items.map((item) => createBookmarkItemFromJSON(item));
