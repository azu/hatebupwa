const proxy = require("http-proxy-middleware");
module.exports = function (app) {
    app.use(
        proxy("/hatebu", {
            target: "https://b.hatena.ne.jp",
            pathRewrite: {
                "^/hatebu": ""
            },
            changeOrigin: true
        })
    );
    app.use(
        proxy("/user", {
            target: "http://localhost:3000/",
            pathRewrite: {
                "^/user/*": "/index.html"
            }
        })
    );
    app.use(
        proxy("/home", {
            target: "http://localhost:3000/",
            pathRewrite: {
                "^/home": "/index.html"
            }
        })
    );
};
