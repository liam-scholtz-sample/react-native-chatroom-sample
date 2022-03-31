import React from "react";
import { Pressable, useWindowDimensions } from "react-native";
import { View, Text, Image } from "react-native";
import { $GLOBAL } from "../$GLOBAL";
import { E_Colors, THEME_COLORS } from "../providers/C_ThemeProvider";
import C_Button from "./C_Button";

type T_Props = $GLOBAL.I_UIComponentProps & {
    HeaderText: string,
    OnThemeToggle: () => void
};

type T_States = $GLOBAL.I_UIComponentStates & {};

export default function C_Header(props: T_Props) {
    const WINDOW = useWindowDimensions();
    const [state, setState] = React.useState<T_States>({ IsActive: props.IsActive });
    if (state.IsActive === false)
        return null;
    return (
        <View style={{ width: '100%', marginBottom: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, backgroundColor: (props.Theme === 'Light' ? E_Colors.Blue : E_Colors.PurpleBlue) }}>
            <Text style={{ fontSize: (WINDOW.width < 700 ? (WINDOW.width / 20) : 32), color: E_Colors.White }} numberOfLines={1}>{props.HeaderText}</Text>
            <Pressable style={{ position: 'absolute', right: '1%' }} onPress={props.OnThemeToggle}>
                <Image style={{ width: 32, height: 32, marginBottom: 5 }} source={(props.Theme === 'Light' ? require('../resources/icons/theme_light.png') : require('../resources/icons/theme_dark.png'))} />
                {WINDOW.width > 700
                    && <Text style={{ fontSize: 16, color: E_Colors.White }} numberOfLines={1} selectable={false}>{props.Theme}</Text>}
            </Pressable>
        </View>
    );
}