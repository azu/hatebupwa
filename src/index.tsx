import * as React from "react";
import * as ReactDOM from "react-dom";
import { initializeIcons } from "@uifabric/icons";
import { App } from "./container/App";
import { Provider } from "./Context";

const cssFiles = import.meta.glob("./**/*.css");
const promises: Promise<void>[] = Object.entries(cssFiles).map(([path, loader]) => {
    return loader();
});

// Register icons and pull the fonts from the default SharePoint cdn:

initializeIcons();

Promise.all(promises).then(() => {
    ReactDOM.render(
        <Provider>
            <App />
        </Provider>,
        document.getElementById("root") as HTMLElement
    );
});
