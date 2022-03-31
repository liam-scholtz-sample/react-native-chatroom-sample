import React from 'react';
import { View, Text } from 'react-native';
import { $GLOBAL } from '../../$GLOBAL';

export type T_Props = $GLOBAL.I_UIComponentProps & {};
export type T_States = $GLOBAL.I_UIComponentStates & {};

export default class C_Template extends React.Component<T_Props, T_States> {
    private static SINGLETON: C_Template;
    public static SetActive(state: boolean) {
        C_Template.SINGLETON.setState({ IsActive: state });
    }
    constructor(props: T_Props) {
        super(props);
        this.state = {
            IsActive: props.IsActive,
        };
        C_Template.SINGLETON = this;
    }
    render() {
        if (this.state.IsActive == false)
            return null;
        return (
            <View style={[$GLOBAL.STYLES.AbsolutePosition, { zIndex: 1000, justifyContent: 'center', alignItems: 'center' }]}>
                {/* CHILDREN */}
            </View>
        );
    }
}