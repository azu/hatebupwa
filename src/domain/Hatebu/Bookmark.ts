import { Identifier, Serializer, ValueObject } from "ddd-base";
import { BookmarkItem, BookmarkItemConverter, BookmarkItemJSON } from "./BookmarkItem";
import { matchBookmarkItem } from "./BookmarkSearch";
import { BookmarkDate } from "./BookmarkDate";

export const BookmarkConverter: Serializer<Bookmark, BookmarkJSON> = {
    fromJSON(json) {
        return new Bookmark({
            items: json.items.map(item => BookmarkItemConverter.fromJSON(item)),
            lastUpdated: BookmarkDate.fromUnixTime(json.lastUpdated)
        });
    },
    toJSON(entity) {
        return {
            items: entity.props.items.map(item => BookmarkItemConverter.toJSON(item)),
            lastUpdated: entity.props.lastUpdated.unixTime
        };
    }
};

export interface BookmarkJSON {
    items: BookmarkItemJSON[];
    lastUpdated: number;
}

export class BookmarkIdentifier extends Identifier<string> {}

export interface BookmarkProps {
    items: BookmarkItem[];
    lastUpdated: BookmarkDate;
}

export class Bookmark extends ValueObject<BookmarkProps> {
    get totalCount() {
        return this.props.items.length;
    }

    /**
     * @param {string[]} searchWords searchWord is string-like pattern
     * @returns {BookmarkItem[]}
     */
    getMatchedItems(searchWords: string[]) {
        return this.findItemsByMatch(item => matchBookmarkItem(item, searchWords));
    }

    findItemsByMatch(predicate: (item: BookmarkItem) => boolean) {
        return this.props.items.filter(predicate);
    }

    updateBookmarkItems(items: BookmarkItem[], lastUpdated = new Date()) {
        return new Bookmark({
            ...this.props,
            items: items,
            lastUpdated: new BookmarkDate(lastUpdated)
        });
    }

    /**
     *
     * @param {BookmarkItem[]} items new is first
     * @param {Date} lastUpdated
     * @returns {Bookmark}
     */
    addBookmarkItems(items: BookmarkItem[], lastUpdated = new Date()) {
        if (items.length === 0) {
            return this;
        }
        return this.updateBookmarkItems(items.concat(this.props.items), lastUpdated);
    }
}
