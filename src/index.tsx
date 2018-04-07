import * as React from "react";
import * as ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import { initializeIcons } from "@uifabric/icons";
import { App } from "./container/App";
// Register icons and pull the fonts from the default SharePoint cdn:
initializeIcons();

// require all css files
function requireAll(r: any) {
    r.keys().forEach(r);
}

requireAll((require as any).context("./", true, /\.css$/));

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
