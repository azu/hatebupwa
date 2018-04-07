import * as React from "react";
import { FocusZone, FocusZoneDirection, List, TextField } from "office-ui-fabric-react";

export interface HatebuSearchListProps {
    items: any[];
}

export interface HatebuSearchListState {
    filterText?: string;
    items?: any[];
}

export interface HatebuSearchListItemProps {
    tag: string;
    description: string;
    timeStamp: string;
}

export const HatebuSearchListItem = (item: HatebuSearchListItemProps) => {
    return (
        <div className={"HatebuSearchListItem"} data-is-focusable={true}>
            <div className="HatebuSearchListItem-body">
                <div className="HatebuSearchListItem-description">{item.description}</div>
                <div className="HatebuSearchListItem-tag">{item.tag}</div>
                <div className="HatebuSearchListItem-timestamp">{item.timeStamp}</div>
            </div>
        </div>
    );
};

export class HatebuSearchList extends React.Component<HatebuSearchListProps, HatebuSearchListState> {
    state = {
        filterText: undefined,
        items: this.props.items
    };

    public render() {
        const { items: originalItems } = this.props;
        const { items } = this.state;
        const resultCountText =
            items.length === originalItems.length ? "" : ` (${items.length} of ${originalItems.length} shown)`;

        return (
            <FocusZone direction={FocusZoneDirection.vertical} allowTabKey={true} className={"HatebuSearchList"}>
                <TextField
                    className={"HatebuSearchList-searchBox"}
                    iconProps={{
                        iconName: "Filter"
                    }}
                    label={"Filter by name" + resultCountText}
                    onBeforeChange={this.onFilterChanged}
                />
                <List className={"HatebuSearchList-body"} items={items} onRenderCell={this.onRenderCell} />
            </FocusZone>
        );
    }

    private onFilterChanged = (text: string) => {
        const { items } = this.props;

        this.setState({
            filterText: text,
            items: text ? items.filter(item => item.description.toLowerCase().indexOf(text.toLowerCase()) >= 0) : items
        });
    };

    private onRenderCell = (item: any, index: number | undefined): JSX.Element => {
        return <HatebuSearchListItem {...item} />;
    };
}
