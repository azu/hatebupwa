import { matchBookmarkItem } from "../BookmarkSearch.js";
import { BookmarkItem } from "../BookmarkItem.js";
import * as assert from "node:assert";
import { BookmarkDate } from "../BookmarkDate.js";

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
        it("should accept case-insensitive word", () => {
            const bookmark = createExampleBookmark();
            assert.ok(matchBookmarkItem(bookmark, ["TITLE"]));
            assert.ok(matchBookmarkItem(bookmark, ["COMMENT"]));
            assert.ok(matchBookmarkItem(bookmark, ["EXAMPLE.COM"]));
        });
        it("should return false if match the searchWords", () => {
            const bookmark = createExampleBookmark();
            assert.strictEqual(matchBookmarkItem(bookmark, ["nomatch"]), false);
            assert.strictEqual(matchBookmarkItem(bookmark, ["nomatch", "title"]), false);
        });
    });
});
