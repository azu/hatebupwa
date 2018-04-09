const path = require("path");
module.exports = {
    target: "webworker",
    entry: "./workers/filter.ts",
    output: {
        filename: "filter.js",
        path: path.join(__dirname, "/public/workers/")
    },
    resolve: {
        extensions: [".mjs", ".web.ts", ".ts", ".web.tsx", ".tsx", ".web.js", ".js", ".json", ".web.jsx", ".jsx"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: require.resolve("ts-loader"),
                    options: {
                        transpileOnly: true
                    }
                }
            }
        ]
    }
};
