import { Context } from "almin";
import * as React from "react";

let StateContext: null | React.Context<any> = null;
// Provider
export type ProviderProps = {
    inject?: any;
    children: React.ReactNode;
};

// Consumer
export type ConsumerProps<T> = {
    children: (props: T) => React.ReactNode;
};

// Subscribe
export type SubscribeProps<T, K = any> = {
    query: (state: T) => K;
    children: (props: K) => React.ReactNode;
};

export function createContext<T>(alminContext: Context<T>) {
    const initialState = alminContext.getState();
    StateContext = React.createContext(initialState);

    // Provider
    class Provider extends React.PureComponent<ProviderProps> {
        state = initialState;
        private releaseHandler: () => void;

        constructor(props: ProviderProps) {
            super(props);
            this.releaseHandler = alminContext.onChange(this.onChange);
        }

        private onChange = () => {
            this.setState(alminContext.getState());
        };

        componentWillUnmount() {
            this.releaseHandler();
        }

        render() {
            if (StateContext === null) {
                return null;
            }
            return <StateContext.Provider value={this.state}>{this.props.children}</StateContext.Provider>;
        }
    }

    // Consumer
    class Consumer extends React.PureComponent<ConsumerProps<T>> {
        render() {
            if (StateContext === null) {
                throw new Error(
                    "You must wrap your <Subscribe> components with a <Provider> component.\n" +
                        "You can get <Provider> component via `createContext()` API."
                );
            }
            return (
                <StateContext.Consumer>
                    {value => {
                        return this.props.children(value);
                    }}
                </StateContext.Consumer>
            );
        }
    }

    class Subscribe extends React.PureComponent<SubscribeProps<T>> {
        render() {
            return (
                <Consumer>
                    {value => {
                        const stateValue = this.props.query(value);
                        return this.props.children(stateValue);
                    }}
                </Consumer>
            );
        }
    }

    return {
        Provider,
        Consumer,
        Subscribe
    };
}
