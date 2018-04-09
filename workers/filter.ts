import { HatebuSearchListItem } from "../src/container/SearchContainer/SearchContainerStore";

const registerWebworker = require("webworker-promise/lib/register");
let currentItems: HatebuSearchListItem[] = [];
registerWebworker()
    .on("init", (items: HatebuSearchListItem[]) => {
        currentItems = items;
    })
    .operation("filter", (filterWords: string[]) => {
        const test = (text: string) => {
            return filterWords.some(word => {
                return text.toLowerCase().indexOf(word.toLowerCase()) !== -1;
            });
        };
        return currentItems.filter(item => {
            return test(item.comment) || test(item.title) || test(item.url);
        });
    });
