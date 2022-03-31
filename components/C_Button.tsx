import React from "react";
import { Pressable, PressableProps, TextProps } from "react-native";
import { $GLOBAL } from "../$GLOBAL";
import { Text } from 'react-native';
import { THEME_COLORS, T_Theme } from "../providers/C_ThemeProvider";

type T_Props = PressableProps & $GLOBAL.I_UIComponentProps & {
    readonly Text: string,
    readonly TextProps?: TextProps,
};

type T_States = $GLOBAL.I_UIComponentStates & {};

export default function C_Button(props: T_Props) {
    const [state, setState] = React.useState<T_States>({ IsActive: true });
    if (state.IsActive === false)
        return null;
    return (
        <Pressable {...props} style={[{ backgroundColor: THEME_COLORS.Button[props.Theme] }, { ...props.style as {} }]}>
            <Text selectable={false} {...props.TextProps} style={[{ color: THEME_COLORS.ButtonText[props.Theme], textAlign: 'center' }, { ...props.TextProps?.style as {} }]}>{props.Text}</Text>
        </Pressable>
    );
}