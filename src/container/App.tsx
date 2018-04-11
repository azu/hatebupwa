import * as React from "react";
import { UserFormContainer } from "./UserFormContainer/UserFormContainer";
import { SearchContainer } from "./SearchContainer/SearchContainer";
import { Consumer, context } from "../Context";
import { createInitializeSystemUseCase } from "../use-case/InitializeSystemUseCase";
import { Route, Router } from "react-routing-resolver";
import { createRefreshHatenaBookmarkUseCase } from "../use-case/hatebu-api/RefreshHatenaBookmarkUseCase";
import { createSwitchCurrentHatebuUserUseCase } from "../use-case/SwitchCurrentHatebuUserUseCase";
import { createRestoreLastSessionUseCase } from "../use-case/RestoreLastSessionUseCase";
import { browserHistory } from "../infra/browser/browserHistory";

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

    private onMatchUser = async (args: { name: string }) => {
        const userName = args.name;
        try {
            await context
                .useCase(createSwitchCurrentHatebuUserUseCase())
                .executor(useCase => useCase.execute(userName));
            await context.useCase(createRefreshHatenaBookmarkUseCase()).executor(useCase => useCase.execute(userName));
        } catch (error) {
            console.error(error);
        }
    };

    private onMatchOther = () => {};
    private onMatchHome = async () => {
        await context.useCase(createRestoreLastSessionUseCase()).executor(useCase => useCase.execute());
    };

    render() {
        return (
            <>
                {this.state.isInitialized ? (
                    <Router currentPath={browserHistory.location.pathname} history={browserHistory}>
                        <Route pattern={"/user/:name"} onMatch={this.onMatchUser} />
                        <Route pattern={"/home/"} onMatch={this.onMatchHome} />
                        <Route pattern={"*"} onMatch={this.onMatchOther} />
                    </Router>
                ) : null}
                <div className="App">
                    <h1 className={"App-title"}>はてなブックマーク検索</h1>
                    <Consumer>
                        {state => {
                            return (
                                <>
                                    <UserFormContainer app={state.app} userFormContainer={state.userFormContainer} />
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
