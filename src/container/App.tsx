import * as React from "react";
import "./App.css";
import { UserFormContainer } from "./UserFormContainer/UserFormContainer";
import { SearchContainer } from "./SearchContainer/SearchContainer";
import { Consumer, context } from "../Context";
import { createInitializeSystemUseCase } from "../use-case/InitializeSystemUseCase";
import { Route, Router } from "react-routing-resolver";

export class App extends React.Component {
    private onUserNameMatch = (args: { name: string }) => {
        context.useCase(createInitializeSystemUseCase()).executor(useCase => useCase.execute(args.name));
    };

    private onMatchOther = () => {
        context.useCase(createInitializeSystemUseCase()).executor(useCase => useCase.execute());
    };

    render() {
        return (
            <>
                <Router currentPath={location.pathname}>
                    <Route pattern={"/user/:name"} onMatch={this.onUserNameMatch} />
                    <Route pattern={"*"} onMatch={this.onMatchOther} />
                </Router>
                <div className="App">
                    <h1 className={"App-title"}>はてなブックマーク検索</h1>
                    <Consumer>
                        {state => {
                            return (
                                <>
                                    <UserFormContainer />
                                    <SearchContainer searchContainer={state.searchContainer} />
                                </>
                            );
                        }}
                    </Consumer>
                </div>
            </>
        );
    }
}
