import * as React from "react";
import { HatebuSearchList } from "../../component/HatebuSearchList/HatebuSearchList";

export class SearchContainer extends React.Component<{}, {}> {
    render() {
        return (
            <div className="SearchContainer">
                <HatebuSearchList
                    items={Array.from(new Array(100000).fill(0), (_e, i) => i).map(item => {
                        return {
                            tag: "tag " + item,
                            description: `text ${item}`,
                            timeStamp: "date"
                        };
                    })}
                />
            </div>
        );
    }
}
