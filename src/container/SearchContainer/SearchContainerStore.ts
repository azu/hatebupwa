import { Payload, Store } from "almin";

export interface HatebuSearchListItem {
    tag: string;
    description: string;
    timeStamp: string;
}

export interface SearchContainerState {
    items: HatebuSearchListItem[];
    totalCount: number;
}

export class SearchContainerStore extends Store<SearchContainerState> {
    state: SearchContainerState;

    constructor() {
        super();
        this.state = {
            totalCount: 0,
            items: []
        };
    }

    getState(): SearchContainerState {
        return this.state;
    }

    receivePayload(payload: Payload): void {}
}
