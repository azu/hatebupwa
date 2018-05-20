import { Serializer, ValueObject } from "ddd-base";
import { BookmarkDate } from "./BookmarkDate";

export const BookmarkItemConverter: Serializer<BookmarkItem, BookmarkItemJSON> = {
    fromJSON(json) {
        return new BookmarkItem({
            title: json.title,
            comment: json.comment,
            url: json.url,
            date: BookmarkDate.fromUnixTime(json.date)
        });
    },
    toJSON(entity) {
        return {
            title: entity.props.title,
            comment: entity.props.comment,
            url: entity.props.url,
            date: entity.props.date.unixTime
        };
    }
};

export interface BookmarkItemJSON {
    title: string;
    comment: string;
    url: string;
    date: number;
}

export interface BookmarkItemProps {
    title: string;
    comment: string;
    url: string;
    date: BookmarkDate;
}

export class BookmarkItem extends ValueObject<BookmarkItemProps> {}
