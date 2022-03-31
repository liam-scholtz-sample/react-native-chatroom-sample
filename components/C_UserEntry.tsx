import React, { memo } from "react";
import { View, Text } from "react-native";
import { $GLOBAL } from "../$GLOBAL";
import { E_Colors, THEME_COLORS } from "../providers/C_ThemeProvider";
import { I_MessageEntry } from "./C_MessageEntry";

export interface I_DataObject {
    readonly UserObject: I_UserEntry,
    readonly UserList: Array<I_UserEntry>,
    readonly MessageList: Array<I_MessageEntry>,
}

export interface I_UserEntry {
    readonly UserId: string,
    readonly UserName: string,
    readonly ConnectTimeStamp: Date,
}

type T_Props = $GLOBAL.I_UIComponentProps & I_UserEntry & {
    readonly IsSelf: boolean,
};

type T_States = $GLOBAL.I_UIComponentStates & {};

export default memo(function C_UserEntry(props: T_Props) {
    const [state, setState] = React.useState<T_States>({ IsActive: props.IsActive });
    if (state.IsActive === false)
        return null;
    return (
        <View>
            <Text style={{ color: (props.IsSelf ? THEME_COLORS.MessageSenderText[props.Theme] : THEME_COLORS.MessageText[props.Theme]), backgroundColor: THEME_COLORS.MessageBackground[props.Theme], padding: 10, marginRight: 10, fontSize: 18, textAlign: 'center' }}
                numberOfLines={1}>{props.UserName}</Text>
        </View>
    );
});