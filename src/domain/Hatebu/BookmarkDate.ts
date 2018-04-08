export class BookmarkDate {
    date: Date;

    constructor(date: Date) {
        this.date = date;
    }

    static fromUnixTime(value: number) {
        return new BookmarkDate(new Date(value));
    }

    get unixTime() {
        return this.date.getTime();
    }

    toUTCString() {
        return this.date.toUTCString();
    }
}
