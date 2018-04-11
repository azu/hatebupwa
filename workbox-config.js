module.exports = {
    clientsClaim: true,
    navigateFallback: "/index.html",
    globDirectory: "build/",
    globPatterns: ["**/*.{json,ico,png,html,js,css}"],
    swDest: "build/sw.js"
};
