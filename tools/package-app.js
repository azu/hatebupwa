const path = require("path");
const nativefier = require("nativefier").default;
const projectRoot = path.join(__dirname, "..");
// possible options, defaults unless specified otherwise
const options = {
    name: "HatebuPWA", // will be inferred if not specified
    targetUrl: "https://hatebupwa.netlify.com/home/", // required
    version: require("../package").version,
    out: path.join(projectRoot, "dist"),
    overwrite: true,
    icon: path.join(projectRoot, "public/img/hatenabookmark/hatenabookmark-logomark.png")
};

nativefier(options, function(error, appPath) {
    if (error) {
        console.error(error);
        return;
    }
    console.log("App has been nativefied to", appPath);
});
