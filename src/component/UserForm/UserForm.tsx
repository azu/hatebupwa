import * as React from "react";
import { FormEvent } from "react";
import { DefaultButton, Label, Spinner, SpinnerSize, TextField } from "office-ui-fabric-react";

export interface UserFormProps {
    userName?: string;
    // lock input and button
    isLocked: boolean;
    onSubmit: (name: string) => void;
    onClickRebuild: (name: string) => void;
}

export class UserForm extends React.Component<UserFormProps, {}> {
    private textFieldRef = React.createRef<TextField>();
    private onSubmit = (event: FormEvent<any>) => {
        event.preventDefault();
        if (this.textFieldRef.current) {
            this.props.onSubmit(this.textFieldRef.current.value || "");
        }
    };

    private onClick = () => {
        if (this.textFieldRef.current) {
            this.props.onSubmit(this.textFieldRef.current.value || "");
        }
    };

    private onClickRebuild = () => {
        if (this.textFieldRef.current) {
            this.props.onClickRebuild(this.textFieldRef.current.value || "");
        }
    };

    render() {
        return (
            <form onSubmit={this.onSubmit} className="UserForm">
                <Label className={"UserForm-label"}>Input your hatena user name</Label>
                <div className={"UserForm-body"}>
                    <div className="UserForm-left">
                        <TextField
                            inputClassName={"UserForm-textFieldInput"}
                            className={"UserForm-textField"}
                            value={this.props.userName}
                            placeholder={"hatenabookmark"}
                            autoComplete="off"
                            disabled={this.props.isLocked}
                            ref={this.textFieldRef}
                        />
                    </div>
                    <div className="UserForm-right">
                        {this.props.isLocked ? (
                            <Spinner size={SpinnerSize.medium} />
                        ) : (
                            <DefaultButton
                                primary
                                text="データ取得"
                                onClick={this.onClick}
                                split={true}
                                style={{ height: "35px" }}
                                menuProps={{
                                    items: [
                                        {
                                            key: "forceRefresh",
                                            name: "データの初期化",
                                            title: "指定アカウントのデータを初期化し再取得します",
                                            icon: "Refresh",
                                            onclick: this.onClickRebuild
                                        }
                                    ]
                                }}
                            />
                        )}
                    </div>
                </div>
            </form>
        );
    }
}
