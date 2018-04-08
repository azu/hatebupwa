import * as React from "react";
import "./App.css";
import { UserFormContainer } from "./UserFormContainer/UserFormContainer";
import { SearchContainer } from "./SearchContainer/SearchContainer";
import { Consumer, context } from "../Context";
import { createInitializeSystemUseCase } from "../use-case/InitializeSystemUseCase";
import { Route, Router } from "react-routing-resolver";

export class App extends React.Component {
    private onUserNameMatch = (args: { name: string }) => {
        console.log(args);
    };

    componentDidMount() {
        context.useCase(createInitializeSystemUseCase()).executor(useCase => useCase.execute());
    }

    render() {
        return (
            <>
                <Router currentPath={location.pathname}>
                    <Route pattern={"/"} onMatch={this.onUserNameMatch} />
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
