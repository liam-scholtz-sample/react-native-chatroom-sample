import React from "react";
import { View, Text } from "react-native";
import { $GLOBAL } from "../$GLOBAL";

type T_Props = $GLOBAL.I_UIComponentProps & {};

type T_States = $GLOBAL.I_UIComponentStates & {};

export default function C_Template(props: T_Props) {
    const [state, setState] = React.useState<T_States>({ IsActive: props.IsActive });
    if (state.IsActive === false)
        return null;
    return (
        <View>
            {/* CHILDREN */}
        </View>
    );
}