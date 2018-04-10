import { Hatebu, HatebuIdentifier } from "./Hatebu";
import { Bookmark } from "./Bookmark";
import { BookmarkDate } from "./BookmarkDate";

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
