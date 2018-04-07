import * as React from "react";
import "./App.css";
import { UserFormContainer } from "./UserFormContainer/UserFormContainer";
import { SearchContainer } from "./SearchContainer/SearchContainer";
import { Consumer } from "../Context";

export class App extends React.Component {
    render() {
        return (
            <div className="App">
                <h1 className={"App-title"}>はてなブックマーク検索</h1>
                <Consumer>
                    {state => {
                        console.log(state);
                        return (
                            <>
                                <UserFormContainer />
                                <SearchContainer />
                            </>
                        );
                    }}
                </Consumer>
            </div>
        );
    }
}
