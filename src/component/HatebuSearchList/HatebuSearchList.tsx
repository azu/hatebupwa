import * as React from "react";
import {
    FocusZone,
    FocusZoneDirection,
    FocusZoneTabbableElements,
    Link,
    List,
    TextField
} from "office-ui-fabric-react";
import { HatebuSearchListItem } from "../../container/SearchContainer/SearchContainerStore";

const debouncePromise = require("debounce-promise");

const Highlighter = require("react-highlight-words");
// const greenlet = require("greenlet").default;

type FilterItemsType = (filterWords: string[], items: HatebuSearchListItem[]) => Promise<HatebuSearchListItem[]>;
const filterItems: FilterItemsType = async (filterWords: string[], items: HatebuSearchListItem[]) => {
    const test = (text: string): boolean => {
        return filterWords.some(word => {
            return text.toLowerCase().indexOf(word.toLowerCase()) !== -1;
        });
    };
    return items.filter(item => {
        return test(item.comment) || test(item.title) || test(item.url);
    });
};

export interface HatebuSearchListProps {
    items: HatebuSearchListItem[];
}

export interface HatebuSearchListState {
    filterWords: string[];
    items: HatebuSearchListItem[];
}

export interface HatebuSearchListItemProps extends HatebuSearchListItem {
    filterWords: string[];
}

export const HatebuSearchListItemC = (item: HatebuSearchListItemProps) => {
    return (
        <div className={"HatebuSearchListItem"} data-is-focusable={true}>
            <div className="HatebuSearchListItem-body">
                <div className={"HatebuSearchListItem-main"}>
                    <div className="HatebuSearchListItem-title">
                        <Link href={item.url} data-is-focusable={false}>
                            <Highlighter
                                highlightClassName="YourHighlightClass"
                                searchWords={item.filterWords}
                                autoEscape={true}
                                textToHighlight={item.title}
                            />
                        </Link>
                    </div>
                    <div className="HatebuSearchListItem-description">
                        <Highlighter
                            highlightClassName="YourHighlightClass"
                            searchWords={item.filterWords}
                            autoEscape={true}
                            textToHighlight={item.comment}
                        />
                    </div>
                </div>
                <div className="HatebuSearchListItem-timestamp">{item.date.date.toUTCString()}</div>
            </div>
        </div>
    );
};

export class HatebuSearchList extends React.Component<HatebuSearchListProps, HatebuSearchListState> {
    state = {
        filterWords: [],
        items: this.props.items
    };

    static getDerivedStateFromProps(nextProps: HatebuSearchListProps, prevState: HatebuSearchListState) {
        if (nextProps.items !== prevState.items) {
            return {
                items: nextProps.items
            };
        }
        return null;
    }

    public render() {
        const { items: originalItems } = this.props;
        const { items } = this.state;
        const resultCountText =
            items.length === originalItems.length ? "" : ` (${items.length} of ${originalItems.length} shown)`;

        return (
            <FocusZone
                direction={FocusZoneDirection.vertical}
                handleTabKey={FocusZoneTabbableElements.all}
                className={"HatebuSearchList"}
            >
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

    private onFilterChanged = debouncePromise((text: string) => {
        const { items } = this.props;
        const filterWords = text.split(/\s/);
        return filterItems(filterWords, items).then(items => {
            return new Promise(resolve => {
                this.setState(
                    {
                        filterWords: filterWords,
                        items: items
                    },
                    resolve
                );
            });
        });
    }, 100);

    private onRenderCell = (item: any, index: number | undefined): JSX.Element => {
        return <HatebuSearchListItemC {...item} filterWords={this.state.filterWords} />;
    };
}
