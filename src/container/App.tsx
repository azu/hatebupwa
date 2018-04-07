import * as React from "react";
import "./App.css";
import { UserFormContainer } from "./UserFormContainer/UserFormContainer";
import { SearchContainer } from "./SearchContainer/SearchContainer";

export class App extends React.Component {
    render() {
        return (
            <div className="App">
                <UserFormContainer />
                <SearchContainer />
            </div>
        );
    }
}
