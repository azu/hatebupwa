import * as React from "react";
import * as ReactDOM from "react-dom";
import { initializeIcons } from "@uifabric/icons";
import { App } from "./container/App";
import { Provider } from "./Context";

const cssFiles = import.meta.glob("./**/*.css");
for (const path in cssFiles) {
    cssFiles[path]();
}
// Register icons and pull the fonts from the default SharePoint cdn:

initializeIcons();

ReactDOM.render(
    <Provider>
        <App />
    </Provider>,
    document.getElementById("root") as HTMLElement
);
