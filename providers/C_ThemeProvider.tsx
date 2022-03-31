import React from "react";

export type T_Theme = 'Light' | 'Dark';
type T_ThemeColors = {
    readonly Background: { [value in T_Theme]: E_Colors },
    readonly MessageBackground: { [value in T_Theme]: E_Colors },
    readonly MessageSenderText: { [value in T_Theme]: E_Colors },
    readonly MessageText: { [value in T_Theme]: E_Colors },
    readonly Text: { [value in T_Theme]: E_Colors },
    readonly Button: { [value in T_Theme]: E_Colors },
    readonly ButtonText: { [value in T_Theme]: E_Colors },
};

export enum E_Colors {
    White = '#FFFFFF',
    Black = '#000000',
    Yellow = '#FFFF00',
    Blue = '#0000FF',
    Cyan = '#00FFFF',
    Red = '#FF0000',
    LightBlack = '#1C1C1C',
    Dodgerblue = '#1E90FF',
    PurpleBlue = '#471AC0',
}

export const THEME_COLORS: T_ThemeColors = {
    Background: { Light: E_Colors.White, Dark: E_Colors.LightBlack },
    MessageBackground: { Light: E_Colors.Blue, Dark: E_Colors.PurpleBlue },
    MessageSenderText: { Light: E_Colors.Red, Dark: E_Colors.Cyan },
    MessageText: { Light: E_Colors.White, Dark: E_Colors.White },
    Text: { Light: E_Colors.LightBlack, Dark: E_Colors.White },
    Button: { Light: E_Colors.Blue, Dark: E_Colors.PurpleBlue },
    ButtonText: { Light: E_Colors.White, Dark: E_Colors.White },
};

export const THEME_CONTEXT = React.createContext<T_Theme>('Light');
export const C_ThemeProvider = THEME_CONTEXT.Provider;

export default THEME_CONTEXT;