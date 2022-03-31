import React from "react";
import { Pressable, useWindowDimensions } from "react-native";
import { View, Text, Image } from "react-native";
import { $GLOBAL } from "../$GLOBAL";
import { E_Colors, THEME_COLORS } from "../providers/C_ThemeProvider";
import C_Button from "./C_Button";

type T_Props = $GLOBAL.I_UIComponentProps & {
    FooterText: string,
};

type T_States = $GLOBAL.I_UIComponentStates & {};

export default function C_Footer(props: T_Props) {
    const WINDOW = useWindowDimensions();
    const [state, setState] = React.useState<T_States>({ IsActive: props.IsActive });
    if (state.IsActive === false)
        return null;
    return (
        <View style={{ width: '100%', marginTop: 20, marginBottom: 10, flexShrink: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
            <Text style={{ fontSize: (WINDOW.width < 700 ? (WINDOW.width / 24) : 24), color: (props.Theme === 'Light' ? E_Colors.Black : E_Colors.White) }}>{props.FooterText}</Text>
        </View>
    );
}