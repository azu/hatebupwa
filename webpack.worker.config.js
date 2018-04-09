const path = require("path");
module.exports = {
    target: "webworker",
    entry: "./workers/filter.js",
    output: {
        filename: "filter.js",
        path: path.join(__dirname, "/public/workers/")
    }
};
