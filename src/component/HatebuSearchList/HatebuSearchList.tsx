import * as React from "react";
import {
    FocusZone,
    FocusZoneDirection,
    FocusZoneTabbableElements,
    ITextField,
    Link,
    List,
    TextField
} from "office-ui-fabric-react";
import * as Comlink from "comlink";
import { HatebuSearchListItem } from "../../container/SearchContainer/SearchContainerStore";
import { KeyboardEvent } from "react";

const format = require("date-fns/format");
const debouncePromise = require("debounce-promise");
const Highlighter = require("react-highlight-words");

export interface HatebuSearchListProps {
    autoFocus: boolean;
    items: HatebuSearchListItem[];
}

export interface HatebuSearchListState {
    filterWords: string[];
    items: HatebuSearchListItem[];
    originalItems: HatebuSearchListItem[];
    refreshFlag: boolean;
}

export interface HatebuSearchListItemProps extends HatebuSearchListItem {
    filterWords: string[];
}

export const HatebuSearchListItemComponent = (item: HatebuSearchListItemProps) => {
    const onKeyPress = (event: KeyboardEvent<any>) => {
        if (event.key === "Enter") {
            window.open(item.props.url);
        }
    };

    return (
        <div className={"HatebuSearchListItem"} data-is-focusable={true} onKeyDown={onKeyPress}>
            <div className="HatebuSearchListItem-body">
                <div className={"HatebuSearchListItem-main"}>
                    <div className="HatebuSearchListItem-title">
                        <Link href={item.props.url} target={"_blank"} data-is-focusable={false}>
                            <Highlighter
                                highlightClassName="YourHighlightClass"
                                searchWords={item.filterWords}
                                autoEscape={true}
                                textToHighlight={item.props.title}
                            />
                        </Link>
                    </div>
                    <div className="HatebuSearchListItem-description">
                        <Highlighter
                            highlightClassName="YourHighlightClass"
                            searchWords={item.filterWords}
                            autoEscape={true}
                            textToHighlight={item.props.comment}
                        />
                    </div>
                </div>
                <div className="HatebuSearchListItem-timestamp">{format(item.props.date.date, "YYYY-MM-DD HH:mm")}</div>
            </div>
        </div>
    );
};

export class HatebuSearchList extends React.PureComponent<HatebuSearchListProps, HatebuSearchListState> {
    state = {
        filterWords: [],
        items: [],
        originalItems: [],
        refreshFlag: false
    };
    private filterWorker!: Worker;
    private isOnComposition!: boolean;
    private textFieldRef = React.createRef<ITextField>();
    private workerAPI!: Comlink.Remote<import("../../../workers/filter").WorkerAPI>;

    componentDidMount() {
        this.filterWorker = new Worker(process.env.PUBLIC_URL + "/workers/filter.js");
        this.workerAPI = Comlink.wrap<import("../../../workers/filter").WorkerAPI>(this.filterWorker);
        if (this.props.autoFocus) {
            this.focus();
        }
    }

    static getDerivedStateFromProps(nextProps: HatebuSearchListProps, state: HatebuSearchListState) {
        // props.items => originalItems
        if (nextProps.items !== state.originalItems) {
            return {
                refreshFlag: true,
                originalItems: nextProps.items
            };
        }
        return null;
    }

    componentDidUpdate(prevProps: HatebuSearchListProps) {
        // If no input and got new items, refresh worker
        const isEmptyItems = this.state.filterWords.length === 0;
        if (this.state.refreshFlag && isEmptyItems) {
            this.setState(
                {
                    refreshFlag: false,
                    items: this.state.originalItems
                },
                () => {
                    return this.workerAPI.init(this.state.originalItems);
                }
            );
        }
        if (this.props.autoFocus !== prevProps.autoFocus) {
            this.focus();
        }
    }

    public focus = () => {
        if (this.textFieldRef.current) {
            this.textFieldRef.current.focus();
        }
    };

    render() {
        const { originalItems, items } = this.state;
        const resultCountText =
            items.length === originalItems.length ? "" : ` (${items.length} of ${originalItems.length} shown)`;

        return (
            <FocusZone
                direction={FocusZoneDirection.vertical}
                handleTabKey={FocusZoneTabbableElements.all}
                className={"HatebuSearchList"}
            >
                <TextField
                    inputClassName={"HatebuSearchList-searchBoxInput"}
                    className={"HatebuSearchList-searchBox"}
                    autoFocus={this.props.autoFocus}
                    iconProps={{
                        iconName: "Filter"
                    }}
                    label={"Filter by words" + resultCountText}
                    onChange={this.onFilterChange}
                    onCompositionStart={this.onCompositionHandle}
                    onCompositionEnd={this.onCompositionHandle}
                />
                <List className={"HatebuSearchList-body"} items={items} onRenderCell={this.onRenderCell} />
            </FocusZone>
        );
    }

    // Based on https://github.com/LeoEatle/react-composition-input
    private onCompositionHandle = (event: React.CompositionEvent<HTMLInputElement>) => {
        if (event.type === "compositionstart") {
            this.isOnComposition = true;
        } else if (event.type === "compositionend") {
            this.isOnComposition = false;
            this.onFilterChanged(event.currentTarget.value);
        }
    };

    private onFilterChange = (event?: any, newValue?: string) => {
        if (newValue) {
            this.onFilterChanged(newValue);
        }
    };
    private onFilterChanged = debouncePromise((text: string) => {
        // ignore this change during commissioning
        if (this.isOnComposition) {
            return;
        }
        const filterWords = text.split(/\s/).filter(text => text.length > 0);
        return this.workerAPI
            .filter(filterWords)
            .then((items: HatebuSearchListItem[]) => {
                return new Promise(resolve => {
                    this.setState(
                        {
                            filterWords: filterWords,
                            items: items
                        },
                        resolve
                    );
                });
            })
            .catch((error: Error) => {
                console.log(error);
            });
    }, 100);

    private onRenderCell = (item: any, index: number | undefined): JSX.Element => {
        return <HatebuSearchListItemComponent {...item} filterWords={this.state.filterWords} />;
    };
}
