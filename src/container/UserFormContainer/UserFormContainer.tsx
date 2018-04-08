import * as React from "react";
import { UserForm } from "../../component/UserForm/UserForm";
import { context } from "../../Context";
import { createCreateHatebuUserUseCase } from "../../use-case/CreateHatebuUserUseCase";
import { createFetchHatenaBookmarkUseCase } from "../../use-case/FetchHatenaBookmarkUseCase";
import { UserFormContainerState } from "./UserFormContainerStore";

export interface UserFormContainerProps {
    userFormContainer: UserFormContainerState;
}

export class UserFormContainer extends React.Component<UserFormContainerProps, {}> {
    private onSubmit = async (userName: string) => {
        try {
            await context.useCase(createCreateHatebuUserUseCase()).executor(useCase => useCase.execute(userName));
            await context.useCase(createFetchHatenaBookmarkUseCase()).executor(useCase => useCase.execute(userName));
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        return (
            <div className="UserFormContainer">
                <UserForm onSubmit={this.onSubmit} userName={this.props.userFormContainer.name} />
            </div>
        );
    }
}
