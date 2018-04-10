import { HatebuSearchListItem } from "../src/container/SearchContainer/SearchContainerStore";
import { matchBookmarkItem } from "../src/domain/Hatebu/BookmarkSearch";

const registerWebworker = require("webworker-promise/lib/register");
let currentItems: HatebuSearchListItem[] = [];
registerWebworker()
    .on("init", (items: HatebuSearchListItem[]) => {
        currentItems = items;
    })
    .operation("filter", (filterWords: string[]) => {
        return currentItems.filter(item => {
            return matchBookmarkItem(item, filterWords);
        });
    });
