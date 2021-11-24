import { expose, Remote } from "comlink";
import { HatebuSearchListItem } from "../src/container/SearchContainer/SearchContainerStore";
import { matchBookmarkItem } from "../src/domain/Hatebu/BookmarkSearch";

let currentItems: HatebuSearchListItem[] = [];
const WorkerAPI = {
    init(items: HatebuSearchListItem[]) {
        currentItems = items;
    },
    filter(filterWords: string[]) {
        return currentItems.filter((item) => {
            return matchBookmarkItem(item, filterWords);
        });
    }
};
export type WorkerAPI = Remote<typeof WorkerAPI>;
expose(WorkerAPI);
