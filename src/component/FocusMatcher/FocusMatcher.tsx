import * as React from "react";
import { ReactNode } from "react";
import { browserHistory } from "../../infra/browser/browserHistory";
import { Route, Router } from "react-routing-resolver";

export interface FocusMatcherProps {
    matchPath: string;
    render: (isFocus: boolean) => ReactNode;
}

export const FocusMatcher = (props: FocusMatcherProps) => {
    return (
        <Router history={browserHistory}>
            <Route pattern={props.matchPath} render={() => props.render(true)} />
            <Route pattern={"*"} render={() => props.render(false)} />
        </Router>
    );
};
