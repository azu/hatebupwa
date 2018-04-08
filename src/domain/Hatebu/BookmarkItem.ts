import { Serializer } from "ddd-base";
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
            title: entity.title,
            comment: entity.comment,
            url: entity.url,
            date: entity.date.unixTime
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

export class BookmarkItem implements BookmarkItemProps {
    comment: string;
    date: BookmarkDate;
    title: string;
    url: string;

    constructor(props: BookmarkItemProps) {
        this.title = props.title;
        this.comment = props.comment;
        this.url = props.url;
        this.date = props.date;
    }
}
