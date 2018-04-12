import * as React from "react";
import { HatebuSearchList } from "../../component/HatebuSearchList/HatebuSearchList";
import { SearchContainerState } from "./SearchContainerStore";
import { FocusMatcher } from "../../component/FocusMatcher/FocusMatcher";

export interface SearchContainerProps {
    searchContainer: SearchContainerState;
}

export class SearchContainer extends React.Component<SearchContainerProps, {}> {
    render() {
        return (
            <div className="SearchContainer">
                <FocusMatcher
                    matchPath={"/user/:name"}
                    render={isFocus => (
                        <HatebuSearchList items={this.props.searchContainer.items} autoFocus={isFocus} />
                    )}
                />
            </div>
        );
    }
}
