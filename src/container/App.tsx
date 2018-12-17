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
import { PageVisibility } from "../component/PageVisibility/PageVisibility";
import { Link } from "office-ui-fabric-react";
import { FocusFilterTextFieldUseCase } from "../use-case/FocusFilterTextFieldUseCase";

export interface AppState {
    isInitialized: boolean;
}

export class App extends React.PureComponent<{}, AppState> {
    state = {
        isInitialized: false,
        routeComponent: null
    };

    private onVisibleUserPage = async (args: { name: string }) => {
        // refresh on visible
        await context.useCase(createRefreshHatenaBookmarkUseCase()).executor(useCase => useCase.execute(args.name));
        await context.useCase(new FocusFilterTextFieldUseCase()).execute();
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
            await context.useCase(new FocusFilterTextFieldUseCase()).execute();
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
                    <Router history={browserHistory}>
                        <Route
                            pattern={"/user/:name"}
                            onMatch={this.onMatchUser}
                            render={(args: { name: string }) => {
                                return (
                                    <PageVisibility
                                        onVisible={() => {
                                            this.onVisibleUserPage(args);
                                        }}
                                    />
                                );
                            }}
                        />
                        <Route pattern={"/home/"} onMatch={this.onMatchHome} />
                        <Route pattern={"*"} onMatch={this.onMatchOther} />
                    </Router>
                ) : null}

                <div className="App">
                    <h1 className={"App-title"}>
                        <Link href={"/"}>はてなブックマーク検索</Link>
                    </h1>
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
