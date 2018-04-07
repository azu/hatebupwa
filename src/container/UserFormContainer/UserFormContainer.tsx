import * as React from "react";
import { UserForm } from "../../component/UserForm/UserForm";

export class UserFormContainer extends React.Component<{}, {}> {
    private onSubmit = (...args: any[]) => {
        console.log(...args);
    };

    render() {
        return (
            <div className="UserFormContainer">
                <h1 className={"UserFormContainer-title"}>はてなブックマーク検索</h1>
                <UserForm onSubmit={this.onSubmit} />
            </div>
        );
    }
}
