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
    autoFocus: boolean;
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
        items: this.props.items
    };
    private filterWorker: Worker;
    private worker: any;
    private isOnComposition: boolean;
    private textFieldRef = React.createRef<TextField>();

    componentDidMount() {
        this.filterWorker = new Worker(process.env.PUBLIC_URL + "/workers/filter.js");
        this.worker = new WebworkerPromise(this.filterWorker);
        if (this.props.autoFocus) {
            this.focus();
        }
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
        if (this.props.autoFocus !== prevProps.autoFocus) {
            this.focus();
        }
    }

    public focus = () => {
        if (this.textFieldRef.current) {
            this.textFieldRef.current.focus();
        }
    };

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
                    autoFocus={this.props.autoFocus}
                    iconProps={{
                        iconName: "Filter"
                    }}
                    label={"Filter by words" + resultCountText}
                    onChanged={this.onFilterChanged}
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

    private onFilterChanged = debouncePromise((text: string) => {
        // ignore this change during commissioning
        if (this.isOnComposition) {
            return;
        }
        const filterWords = text.split(/\s/);
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
