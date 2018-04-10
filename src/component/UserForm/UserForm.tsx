import * as React from "react";
import { FormEvent } from "react";
import { Label, PrimaryButton, Spinner, SpinnerSize, TextField } from "office-ui-fabric-react";

export interface UserFormProps {
    userName?: string;
    // lock input and button
    isLocked: boolean;
    onSubmit: (name: string) => void;
    onClickInitializeButton: (name: string) => void;
}

export class UserForm extends React.Component<UserFormProps, {}> {
    private textField: TextField | null;
    private onSubmit = (event: FormEvent<any>) => {
        event.preventDefault();
        if (this.textField) {
            this.props.onSubmit(this.textField.value || "");
        }
    };

    private onClickInitialize = () => {
        if (this.textField) {
            this.props.onClickInitializeButton(this.textField.value || "");
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
                            autoComplete="off"
                            disabled={this.props.isLocked}
                            ref={c => (this.textField = c)}
                        />
                    </div>
                    <div className="UserForm-right">
                        {this.props.isLocked ? (
                            <Spinner className={"UserForm-right"} size={SpinnerSize.medium} />
                        ) : (
                            <PrimaryButton
                                className={"UserForm-submitButton UserForm-right"}
                                type="submit"
                                data-automation-id="test"
                                text="決定"
                                split={true}
                                style={{ height: "35px" }}
                                menuProps={{
                                    items: [
                                        {
                                            key: "initialize",
                                            name: "データの再構築",
                                            icon: "Refresh",
                                            onClick: this.onClickInitialize
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
