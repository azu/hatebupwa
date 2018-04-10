export class BookmarkDate {
    date: Date;

    constructor(date: Date) {
        this.date = date;
    }

    static fromUnixTime(value: number) {
        return new BookmarkDate(new Date(value));
    }

    /**
     * Create oldest Date
     * @returns {BookmarkDate}
     */
    static createInitialDate() {
        return new BookmarkDate(new Date(0));
    }

    get isInitialDate() {
        return this.date.getTime() === 0;
    }

    get unixTime() {
        return this.date.getTime();
    }

    toUTCString() {
        return this.date.toUTCString();
    }
}
