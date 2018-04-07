import { ComponentType, PureComponent, ReactNode } from "react";
import * as React from "react";
import { Context } from "almin";
// TODO: extends https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24780
declare namespace ReactModified {
    // Context Api
    type ReactContextProvider<T> = ComponentType<{ value: T }>;
    type ReactContextConsumer<T> = ComponentType<{ children: (value: T) => ReactNode }>;

    interface ReactContext<T> {
        Provider: ReactContextProvider<T>;
        Consumer: ReactContextConsumer<T>;
    }

    function createContext<T>(value: T): ReactContext<T>;
}

/**
 * $PropertyType
 * @desc get the type of property of an object at a given key `K`
 * @see https://flow.org/en/docs/types/utilities/#toc-propertytype
 */
export type $PropertyType<T, K extends keyof T> = T[K];

let StateContext: null | ReactModified.ReactContext<any> = null;
// Provider
export type ProviderProps = {
    inject?: any;
    children: ReactNode;
};
// Consumer
export type ConsumerProps<T> = {
    children: (props: T) => ReactNode;
};

// Subscribe
export type SubscribeProps<T, StateName> = {
    to: StateName;
    children: (props: T) => ReactNode;
};

export function createContext<T>(context: Context<T>) {
    const initialState = context.getState();
    StateContext = (React as any).createContext(initialState);

    // Provider
    class Provider extends PureComponent<ProviderProps> {
        state = initialState;
        private releaseHandler: () => void;

        constructor(props: ProviderProps) {
            super(props);
            this.releaseHandler = context.onChange(this.onChange);
        }

        private onChange = () => {
            this.setState(context.getState());
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
    class Consumer extends PureComponent<ConsumerProps<T>> {
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

    // TODO: Subscribe wont work
    class Subscribe<Key extends keyof T> extends PureComponent<SubscribeProps<$PropertyType<T, Key>, Key>> {
        render() {
            return (
                <Consumer>
                    {value => {
                        const stateValue = value[this.props.to];
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
