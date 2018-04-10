import * as React from "react";
import { FormEvent } from "react";
import { Label, PrimaryButton, TextField } from "office-ui-fabric-react";

export interface UserFormProps {
    userName?: string;
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
                    <TextField
                        inputClassName={"UserForm-textFieldInput"}
                        className={"UserForm-textField"}
                        value={this.props.userName}
                        autoComplete="off"
                        ref={c => (this.textField = c)}
                    />
                    <PrimaryButton
                        className={"UserForm-submitButton"}
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
                </div>
            </form>
        );
    }
}
