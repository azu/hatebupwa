import { matchBookmarkItem } from "../BookmarkSearch";
import { BookmarkItem } from "../BookmarkItem";
import * as assert from "assert";
import { BookmarkDate } from "../BookmarkDate";

const createExampleBookmark = () => {
    return new BookmarkItem({
        title: "title",
        url: "http://example.com",
        comment: "comment",
        date: new BookmarkDate(new Date())
    });
};
describe("BookmarkSearch", () => {
    describe("matchBookmarkItem", () => {
        it("should return true if match the searchWords", () => {
            const bookmark = createExampleBookmark();
            assert.ok(matchBookmarkItem(bookmark, ["title"]));
            assert.ok(matchBookmarkItem(bookmark, ["comment"]));
            assert.ok(matchBookmarkItem(bookmark, ["example.com"]));
        });
        it("should return false if match the searchWords", () => {
            const bookmark = createExampleBookmark();
            assert.strictEqual(matchBookmarkItem(bookmark, ["nomatch"]), false);
            assert.strictEqual(matchBookmarkItem(bookmark, ["nomatch", "title"]), false);
        });
    });
});
