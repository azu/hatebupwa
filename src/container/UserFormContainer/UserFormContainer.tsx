import * as React from "react";
import { UserForm } from "../../component/UserForm/UserForm";

export class UserFormContainer extends React.Component<{}, {}> {
    private onSubmit = (...args: any[]) => {
        console.log(...args);
    };

    render() {
        return (
            <div className="UserFormContainer">
                <UserForm onSubmit={this.onSubmit} />
            </div>
        );
    }
}
