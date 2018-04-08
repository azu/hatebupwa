import { EventEmitter } from "events";

export class InlineWorker extends EventEmitter {
    private worker: Worker;

    constructor(workerFunction: Function) {
        super();
        const functionBodyMatch = workerFunction
            .toString()
            .trim()
            .match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/);
        if (!functionBodyMatch) {
            throw new Error("func should be function" + workerFunction);
        }
        const functionBody = functionBodyMatch[1];
        this.worker = new Worker(URL.createObjectURL(new Blob([functionBody], { type: "text/javascript" })));
        this.worker.onmessage = (event: MessageEvent) => {
            this.emit("message", event.data);
        };
    }

    onMessage = (handler: (data: any) => void) => {
        this.on("message", handler);
    };

    postMessage = (data: any) => {
        this.worker.postMessage({ data: data });
    };
}
