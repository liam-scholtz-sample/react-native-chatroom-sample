import React, { memo } from "react";
import { View, Text } from "react-native";
import { $GLOBAL } from "../$GLOBAL";
import { E_Colors, THEME_COLORS } from "../providers/C_ThemeProvider";

export interface I_MessageEntry {
    readonly UserId: string,
    readonly MessageId: string,
    readonly SenderName: string,
    readonly MessageText: string,
    readonly TimeStamp: Date,
}

type T_Props = $GLOBAL.I_UIComponentProps & I_MessageEntry & {
    readonly IsSelf: boolean,
};

type T_States = $GLOBAL.I_UIComponentStates & {};

export default memo(function C_MessageEntry(props: T_Props) {
    const [state, setState] = React.useState<T_States>({ IsActive: props.IsActive });
    if (state.IsActive === false)
        return null;
    return (
        <View style={{ backgroundColor: THEME_COLORS.MessageBackground[props.Theme], flex: 1, marginBottom: 10, padding: 10 }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                <Text style={{ color: (props.IsSelf ? THEME_COLORS.MessageSenderText[props.Theme] : THEME_COLORS.MessageText[props.Theme]), fontSize: 20 }} numberOfLines={1}>{props.SenderName}</Text>
                <Text style={{ color: THEME_COLORS.MessageText[props.Theme], fontSize: 18 }} numberOfLines={1}>{$GLOBAL.DateString(props.TimeStamp)}</Text>
            </View>
            <Text style={{ color: THEME_COLORS.MessageText[props.Theme], fontSize: 24 }}>{props.MessageText}</Text>
        </View>
    );
});