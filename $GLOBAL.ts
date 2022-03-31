import { Alert, Platform, StyleSheet } from 'react-native';
import { T_Theme } from './providers/C_ThemeProvider';

export namespace $GLOBAL {
    /* -------------------- ENUMS -------------------- */

    /* -------------------- TYPES -------------------- */

    /* -------------------- INTERFACES -------------------- */
    export interface I_UIComponentProps {
        readonly IsActive: boolean,
        readonly Theme: T_Theme,
    }

    export interface I_UIComponentStates {
        readonly IsActive: boolean,
    }

    /* -------------------- VARS -------------------- */
    export const STYLES = StyleSheet.create({
        AbsolutePosition: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
    });

    /* -------------------- FUNCTIONS -------------------- */
    export async function Delay(TimeInMs: number) {
        return await new Promise(resolve => setTimeout(resolve, TimeInMs));
    }

    export function Dialog(params: { Title: string, Message: string, OnConfirm?: { ButtonText: string, Callback: () => void } }) {
        if (Platform.OS === 'web')
            alert(params.Message);
        else
            Alert.alert(params.Title, params.Message, [
                ...params.OnConfirm ? [{
                    text: params.OnConfirm.ButtonText,
                    onPress: params.OnConfirm.Callback,
                }] : [],
                { text: (params.OnConfirm ? 'Cancel' : 'Ok') },
            ]);
    }

    export function DateString(date: Date) {
        const VALUE: Date = (typeof date === 'string' ? new Date(Date.parse(date)) : date);
        return `${VALUE.toLocaleDateString()}, ${VALUE.toLocaleTimeString()}`;
    }
}