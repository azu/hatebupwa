import * as React from "react";
import { FormEvent } from "react";
import { DefaultButton, Label, Spinner, SpinnerSize, TextField } from "office-ui-fabric-react";

export interface UserFormProps {
    userName?: string;
    autoFocus: boolean;
    // lock input and button
    isLocked: boolean;
    onSubmit: (name: string) => void;
    onClickRebuild: (name: string) => void;
}

export class UserForm extends React.PureComponent<UserFormProps, { value: string }> {
    state = {
        value: this.props.userName || ""
    };
    private onSubmit = (event: FormEvent<any>) => {
        event.preventDefault();
        this.props.onSubmit(this.state.value || "");
    };

    private onClick = () => {
        this.props.onSubmit(this.state.value || "");
    };

    private onClickRebuild = () => {
        this.props.onClickRebuild(this.state.value || "");
    };
    private onChangeTextField = (
        _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        newValue?: string
    ) => {
        this.setState({
            value: newValue || ""
        });
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
                            value={this.state.value}
                            placeholder={"hatenabookmark"}
                            autoComplete="off"
                            disabled={this.props.isLocked}
                            autoFocus={this.props.autoFocus}
                            onChange={this.onChangeTextField}
                        />
                    </div>
                    <div className="UserForm-right">
                        {this.props.isLocked ? (
                            <Spinner size={SpinnerSize.medium} />
                        ) : (
                            <DefaultButton
                                primary
                                text="取得"
                                onClick={this.onClick}
                                split={true}
                                menuProps={{
                                    items: [
                                        {
                                            key: "forceRefresh",
                                            name: "データの初期化",
                                            title: "指定アカウントのデータを初期化し再取得します",
                                            icon: "Refresh",
                                            onClick: this.onClickRebuild
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
