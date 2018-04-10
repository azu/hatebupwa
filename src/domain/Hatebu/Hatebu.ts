import { Entity, Identifier, Serializer } from "ddd-base";
import { Bookmark, BookmarkConverter, BookmarkJSON } from "./Bookmark";
import { BookmarkItem } from "./BookmarkItem";

export const HatebuConverter: Serializer<Hatebu, HatebuJSON> = {
    fromJSON(json) {
        return new Hatebu({
            id: new HatebuIdentifier(json.id),
            bookmark: BookmarkConverter.fromJSON(json.bookmark)
        });
    },
    toJSON(entity) {
        return {
            id: entity.id.toValue(),
            bookmark: BookmarkConverter.toJSON(entity.bookmark)
        };
    }
};

export class HatebuIdentifier extends Identifier<string> {}

export interface HatebuJSON {
    readonly id: string;
    readonly bookmark: BookmarkJSON;
}

export interface HatebuProps {
    readonly id: HatebuIdentifier;
    readonly bookmark: Bookmark;
}

export class Hatebu extends Entity<HatebuIdentifier> implements HatebuProps {
    readonly bookmark: Bookmark;

    constructor(args: HatebuProps) {
        super(args.id);
        this.bookmark = args.bookmark;
    }

    get name() {
        return this.id.toValue();
    }

    addBookmarkItems(bookmarkItems: BookmarkItem[]) {
        return new Hatebu({
            ...(this as HatebuProps),
            bookmark: this.bookmark.addBookmarkItems(bookmarkItems)
        });
    }

    updateBookmarkItems(bookmarkItems: BookmarkItem[]) {
        return new Hatebu({
            ...(this as HatebuProps),
            bookmark: this.bookmark.updateBookmarkItems(bookmarkItems)
        });
    }
}
