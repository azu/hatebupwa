// https://developers.google.com/web/tools/workbox/guides/configure-workbox
module.exports = {
    clientsClaim: true,
    // For routing
    navigateFallback: "/index.html",
    globDirectory: "build/",
    globPatterns: ["**/*.{json,ico,png,html,js,css}"],
    swDest: "build/sw.js",
    runtimeCaching: [
        {
            // Match any request ends with .png, .jpg, .jpeg or .svg.
            urlPattern: /\.(?:png|jpg|jpeg|svg|woff|woff2)$/,
            // Apply a cache-first strategy.
            handler: "cacheFirst",
            options: {
                // Only cache 10 images.
                expiration: {
                    maxEntries: 10,
                    cacheName: "hatebu-pwa-external-resource-cache"
                }
            }
        }
    ]
};
