import * as React from "react";
import { Label, PrimaryButton, TextField } from "office-ui-fabric-react";
import { FormEvent } from "react";

export interface UserFormProps {
    onSubmit: (name: string) => void;
}

export class UserForm extends React.Component<UserFormProps, {}> {
    private textField: TextField | null;
    private onSubmit = (event: FormEvent<any>) => {
        event.preventDefault();
        if (this.textField) {
            this.props.onSubmit(this.textField.value || "");
        }
    };

    render() {
        return (
            <form onSubmit={this.onSubmit} className="UserForm">
                <Label className={"UserForm-label"}>Input your hatena user name</Label>
                <div className={"UserForm-body"}>
                    <TextField
                        className={"UserForm-textField"}
                        name="example"
                        autoComplete="off"
                        ref={c => (this.textField = c)}
                    />
                    <PrimaryButton className={"UserForm-submitButton"} type="submit">
                        決定
                    </PrimaryButton>
                </div>
            </form>
        );
    }
}
