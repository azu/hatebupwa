import * as React from "react";
import "./App.css";
import { UserFormContainer } from "./UserFormContainer/UserFormContainer";
import { SearchContainer } from "./SearchContainer/SearchContainer";
import { Consumer, context } from "../Context";
import { createInitializeSystemUseCase } from "../use-case/InitializeSystemUseCase";
import { Route, Router } from "react-routing-resolver";
import { createRefreshHatenaBookmarkUseCase } from "../use-case/hatebu-api/RefreshHatenaBookmarkUseCase";
import { createSwitchCurrentHatebuUserUseCase } from "../use-case/SwitchCurrentHatebuUserUseCase";

export class App extends React.Component {
    state = {
        isInitialized: false
    };

    componentDidMount() {
        context
            .useCase(createInitializeSystemUseCase())
            .executor(useCase => useCase.execute())
            .then(() => {
                this.setState({
                    isInitialized: true
                });
            });
    }

    private onUserNameMatch = async (args: { name: string }) => {
        const userName = args.name;
        await context.useCase(createSwitchCurrentHatebuUserUseCase()).executor(useCase => useCase.execute(userName));
        await context.useCase(createRefreshHatenaBookmarkUseCase()).executor(useCase => useCase.execute(userName));
    };

    private onMatchOther = () => {};

    render() {
        return (
            <>
                {this.state.isInitialized ? (
                    <Router currentPath={location.pathname}>
                        <Route pattern={"/user/:name"} onMatch={this.onUserNameMatch} />
                        <Route pattern={"*"} onMatch={this.onMatchOther} />
                    </Router>
                ) : null}
                <div className="App">
                    <h1 className={"App-title"}>はてなブックマーク検索</h1>
                    <Consumer>
                        {state => {
                            return (
                                <>
                                    <UserFormContainer userFormContainer={state.userFormContainer} />
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
