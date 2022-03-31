import React from "react";
import { View, Text, TextInput, StyleSheet, useWindowDimensions } from "react-native";
import { $GLOBAL } from "../$GLOBAL";
import { SocketManager } from "../managers/SocketManager";
import { E_Colors, THEME_COLORS } from "../providers/C_ThemeProvider";
import C_Button from "./C_Button";
import CS_LoadingIndicator from "./static/CS_LoadingIndicator";

type T_Props = $GLOBAL.I_UIComponentProps & {};

type T_States = $GLOBAL.I_UIComponentStates & {
    UserNameInputText: string,
    AuthTokenInputText: string,
};

export default function C_AuthView(props: T_Props) {
    const WINDOW = useWindowDimensions();
    const W_WIDTH = WINDOW.width <= 650 ? '90%' : 600;
    const [state, setState] = React.useState<T_States>({ IsActive: props.IsActive, UserNameInputText: '', AuthTokenInputText: '' });
    if (state.IsActive === false)
        return null;
    return (
        <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ textAlign: 'center', color: THEME_COLORS.Text[props.Theme], fontSize: 24 }}>Join a chat room</Text>
            <TextInput /* username-input */ style={[STYLE.MessageInputText, { color: (props.Theme === 'Light' ? E_Colors.Black : E_Colors.White), borderColor: (props.Theme === 'Light' ? E_Colors.Dodgerblue : E_Colors.PurpleBlue), padding: 30, width: W_WIDTH }]}
                placeholder="Username" value={state.UserNameInputText} onChangeText={x => setState({ ...state, UserNameInputText: x })} onSubmitEditing={x => {
                    if (CS_LoadingIndicator.IsActive) // <-- PREVENT UNWANTED INPUT
                        return;
                    const TEXT_VALUE = state.UserNameInputText.trim();
                    if (!(TEXT_VALUE)) { // <-- VALIDATE TEXT
                        return $GLOBAL.Dialog({
                            Title: 'Info',
                            Message: 'You have entered an invalid username. Please try again.',
                        });
                    }
                }} blurOnSubmit={false} />
            <TextInput /* auth-token-input */ style={[STYLE.MessageInputText, { color: (props.Theme === 'Light' ? E_Colors.Black : E_Colors.White), borderColor: (props.Theme === 'Light' ? E_Colors.Dodgerblue : E_Colors.PurpleBlue), padding: 30, width: W_WIDTH }]}
                placeholder="Room ID" value={state.AuthTokenInputText} onChangeText={x => setState({ ...state, AuthTokenInputText: x })} onSubmitEditing={x => {
                    if (CS_LoadingIndicator.IsActive) // <-- PREVENT UNWANTED INPUT
                        return;
                    const TEXT_VALUE = state.AuthTokenInputText.trim();
                    if (!(TEXT_VALUE)) { // <-- VALIDATE TEXT
                        return $GLOBAL.Dialog({
                            Title: 'Info',
                            Message: 'You have entered an invalid room id. Please try again.',
                        });
                    }
                }} blurOnSubmit={false} />
            <C_Button style={{ top: 40, width: W_WIDTH, padding: 30 }} IsActive={true} Theme={props.Theme} Text='Confirm' TextProps={{ style: { fontSize: 24 } }} onPress={async () => {
                SocketManager.SINGLETON.Connect({ UserName: state.UserNameInputText, AuthToken: state.AuthTokenInputText });
            }} />
        </View>
    );
}

const STYLE = StyleSheet.create({
    MessageInputText: {
        borderWidth: 1,
        marginTop: 40,
        paddingVertical: 20,
        paddingHorizontal: 40,
        fontSize: 24,
        textAlign: 'center',
    },
});