const registerWebworker = require("webworker-promise/lib/register");
let currentItems = [];
registerWebworker()
    .on("init", items => {
        currentItems = items;
    })
    .operation("filter", filterWords => {
        const test = text => {
            return filterWords.some(word => {
                return text.toLowerCase().indexOf(word.toLowerCase()) !== -1;
            });
        };
        return currentItems.filter(item => {
            return test(item.comment) || test(item.title) || test(item.url);
        });
    });
