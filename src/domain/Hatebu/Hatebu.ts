import { Entity, Identifier, Serializer } from "ddd-base";
import { Bookmark, BookmarkConverter, BookmarkJSON } from "./Bookmark.js";
import { BookmarkItem } from "./BookmarkItem.js";

export const HatebuConverter: Serializer<Hatebu, HatebuJSON> = {
    fromJSON(json) {
        return new Hatebu({
            id: new HatebuIdentifier(json.id),
            bookmark: BookmarkConverter.fromJSON(json.bookmark)
        });
    },
    toJSON(entity) {
        return {
            id: entity.props.id.toValue(),
            bookmark: BookmarkConverter.toJSON(entity.props.bookmark)
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

export interface Hatebu extends HatebuProps {}

export class Hatebu extends Entity<HatebuProps> implements HatebuProps {
    constructor(props: HatebuProps) {
        super(props);
        Object.assign(this, props);
    }

    get name() {
        return this.props.id.toValue();
    }

    get bookmarkItems() {
        return this.props.bookmark.props.items;
    }

    get bookmarkTotalCount() {
        return this.props.bookmark.totalCount;
    }

    addBookmarkItems(bookmarkItems: BookmarkItem[]) {
        return new Hatebu({
            ...this.props,
            bookmark: this.props.bookmark.addBookmarkItems(bookmarkItems)
        });
    }

    updateBookmarkItems(bookmarkItems: BookmarkItem[]) {
        return new Hatebu({
            ...this.props,
            bookmark: this.props.bookmark.updateBookmarkItems(bookmarkItems)
        });
    }
}
