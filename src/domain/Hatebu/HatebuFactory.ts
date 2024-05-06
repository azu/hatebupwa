import { Hatebu, HatebuIdentifier } from "./Hatebu.js";
import { Bookmark } from "./Bookmark.js";
import { BookmarkDate } from "./BookmarkDate.js";

export const createHatebu = (userName: string) => {
    if (userName.length === 0) {
        throw new Error("userName should not be empty");
    }
    return new Hatebu({
        id: new HatebuIdentifier(userName),
        bookmark: new Bookmark({
            items: [],
            lastUpdated: BookmarkDate.createInitialDate()
        })
    });
};
