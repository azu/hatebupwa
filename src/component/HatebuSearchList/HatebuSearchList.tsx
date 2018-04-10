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
import { KeyboardEvent } from "react";

const format = require("date-fns/format");
const debouncePromise = require("debounce-promise");
const Highlighter = require("react-highlight-words");
const WebworkerPromise = require("webworker-promise");

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

export const HatebuSearchListItemComponent = (item: HatebuSearchListItemProps) => {
    const onKeyPress = (event: KeyboardEvent<any>) => {
        if (event.key === "Enter") {
            window.open(item.url);
        }
    };

    return (
        <div className={"HatebuSearchListItem"} data-is-focusable={true} onKeyDown={onKeyPress}>
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
                <div className="HatebuSearchListItem-timestamp">{format(item.date.date, "YYYY-MM-DD HH:mm:ss")}</div>
            </div>
        </div>
    );
};

export class HatebuSearchList extends React.Component<HatebuSearchListProps, HatebuSearchListState> {
    state = {
        filterWords: [],
        items: this.props.items
    };
    private filterWorker: Worker;
    private disableWorker: boolean = false;
    private worker: any;

    componentDidMount() {
        this.filterWorker = new Worker(process.env.PUBLIC_URL + "/workers/filter.js");
        this.filterWorker.addEventListener("error", error => {
            console.error("Worker Error", error);
            this.disableWorker = true;
        });
        this.worker = new WebworkerPromise(this.filterWorker);
    }

    static getDerivedStateFromProps(nextProps: HatebuSearchListProps, prevState: HatebuSearchListState) {
        if (nextProps.items !== prevState.items) {
            return {
                items: nextProps.items
            };
        }
        return null;
    }

    componentDidUpdate(prevProps: HatebuSearchListProps) {
        if (this.props.items !== prevProps.items) {
            this.worker.emit("init", this.state.items);
        }
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
                    inputClassName={"HatebuSearchList-searchBoxInput"}
                    className={"HatebuSearchList-searchBox"}
                    iconProps={{
                        iconName: "Filter"
                    }}
                    label={"Filter by words" + resultCountText}
                    onBeforeChange={this.onFilterChanged}
                />
                <List className={"HatebuSearchList-body"} items={items} onRenderCell={this.onRenderCell} />
            </FocusZone>
        );
    }

    private onFilterChanged = debouncePromise((text: string) => {
        const filterWords = text.split(/\s/);
        console.log("this.disableWorker", this.disableWorker);
        return this.worker
            .exec("filter", filterWords)
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
