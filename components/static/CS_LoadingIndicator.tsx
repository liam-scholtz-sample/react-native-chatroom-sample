import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { $GLOBAL } from '../../$GLOBAL';
import { E_Colors } from '../../providers/C_ThemeProvider';

export type T_Props = $GLOBAL.I_UIComponentProps & {};
export type T_States = $GLOBAL.I_UIComponentStates & {
    readonly IsLazy?: boolean,
};

export default class CS_LoadingIndicator extends React.Component<T_Props, T_States> {
    private static SINGLETON: CS_LoadingIndicator;

    private readonly LAZY_TIMER: number = 1000;
    public static get IsActive(): boolean {
        return CS_LoadingIndicator.SINGLETON.state.IsActive;
    }
    public static SetActive(state: boolean | { IsLazy: boolean }) {
        const SELF = CS_LoadingIndicator.SINGLETON;
        SELF.setState(typeof state === 'boolean' ? { IsActive: state } : { IsActive: true, IsLazy: state.IsLazy });
        if (typeof state !== 'boolean') {
            setTimeout(() => {
                if (SELF.state.IsLazy)
                    SELF.setState({ IsLazy: false });
            }, SELF.LAZY_TIMER);
        }
    }
    constructor(props: T_Props) {
        super(props);
        this.state = {
            IsActive: props.IsActive,
            IsLazy: false,
        };
        CS_LoadingIndicator.SINGLETON = this;
    }
    render() {
        if (this.state.IsActive === false)
            return null;
        return (
            <View style={[$GLOBAL.STYLES.AbsolutePosition, { opacity: (this.state.IsLazy ? 0 : 1), zIndex: 1000, justifyContent: 'center', alignItems: 'center' }]}>
                <View style={[$GLOBAL.STYLES.AbsolutePosition, { backgroundColor: 'black', opacity: 0.9, width: '100%', height: '100%' }]} />
                <ActivityIndicator style={$GLOBAL.STYLES.AbsolutePosition} size='large' color={'white'} />
                <Text style={[{ color: E_Colors.White, fontSize: 18, fontWeight: 'bold', position: 'absolute', marginTop: 110 }]}>Loading . . .</Text>
            </View>
        );
    }
}