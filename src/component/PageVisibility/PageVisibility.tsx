import * as React from "react";

let hidden: string, visibilityChange: string;
if (typeof document.hidden !== "undefined") {
    // Opera 12.10 and Firefox 18 and later support
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof (document as any).msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof (document as any).webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

export interface PageVisibilityProps {
    onVisible?: () => any;
    onHidden?: () => any;
}

export class PageVisibility extends React.Component<PageVisibilityProps, {}> {
    private visibilityChange = () => {
        if (document[hidden]) {
            if (this.props.onHidden) {
                this.props.onHidden();
            }
        } else {
            if (this.props.onVisible) {
                this.props.onVisible();
            }
        }
    };

    constructor(args: PageVisibilityProps) {
        super(args);

        document.addEventListener(visibilityChange, this.visibilityChange);
    }

    componentWillUnmount() {
        document.removeEventListener(visibilityChange, this.visibilityChange);
    }

    render() {
        return null;
    }
}
