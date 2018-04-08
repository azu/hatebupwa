import * as React from "react";
import { HatebuSearchList } from "../../component/HatebuSearchList/HatebuSearchList";
import { SearchContainerState } from "./SearchContainerStore";

export interface SearchContainerProps {
    searchContainer: SearchContainerState;
}

export class SearchContainer extends React.Component<SearchContainerProps, {}> {
    render() {
        return (
            <div className="SearchContainer">
                <HatebuSearchList items={this.props.searchContainer.items} />
            </div>
        );
    }
}
