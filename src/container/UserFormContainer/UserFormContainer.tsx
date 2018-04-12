import * as React from "react";
import { UserForm } from "../../component/UserForm/UserForm";
import { context } from "../../Context";
import { createCreateHatebuUserUseCase } from "../../use-case/CreateHatebuUserUseCase";
import { UserFormContainerState } from "./UserFormContainerStore";
import { createFetchInitialHatenaBookmarkUseCase } from "../../use-case/hatebu-api/InitializeWithNewHatenaBookmarkUseCase";
import { AppState } from "../AppStore";
import { createSwitchCurrentHatebuUserUseCase } from "../../use-case/SwitchCurrentHatebuUserUseCase";
import { FocusMatcher } from "../../component/FocusMatcher/FocusMatcher";

export interface UserFormContainerProps {
    app: AppState;
    userFormContainer: UserFormContainerState;
}

export class UserFormContainer extends React.Component<UserFormContainerProps, {}> {
    private onSubmit = async (userName: string) => {
        try {
            await context.useCase(createCreateHatebuUserUseCase()).executor(useCase => useCase.execute(userName));
            await context
                .useCase(createSwitchCurrentHatebuUserUseCase())
                .executor(useCase => useCase.execute(userName));
        } catch (error) {
            console.error(error);
        }
    };
    private onClickRebuild = async (userName: string) => {
        try {
            await context.useCase(createCreateHatebuUserUseCase()).executor(useCase => useCase.execute(userName));
            await context
                .useCase(createSwitchCurrentHatebuUserUseCase())
                .executor(useCase => useCase.execute(userName));
            await context
                .useCase(createFetchInitialHatenaBookmarkUseCase())
                .executor(useCase => useCase.execute(userName));
        } catch (error) {
            console.error(error);
        }
    };

    render() {
        return (
            <div className="UserFormContainer">
                <FocusMatcher
                    matchPath={"/"}
                    render={isFocus => (
                        <UserForm
                            isLocked={this.props.app.isFetching}
                            onSubmit={this.onSubmit}
                            onClickRebuild={this.onClickRebuild}
                            userName={this.props.userFormContainer.name}
                            autoFocus={isFocus}
                        />
                    )}
                />
            </div>
        );
    }
}
