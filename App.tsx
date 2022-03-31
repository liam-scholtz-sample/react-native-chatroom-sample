import React from 'react';
import { FlatList, KeyboardAvoidingView, ListRenderItem, ListRenderItemInfo, Platform, SafeAreaView, StyleSheet, Text, TextInput, useWindowDimensions, View, StatusBar } from 'react-native';
import C_UserEntry, { I_DataObject, I_UserEntry } from './components/C_UserEntry';
import C_MessageEntry, { I_MessageEntry } from './components/C_MessageEntry';
import { C_ThemeProvider, E_Colors, THEME_COLORS, T_Theme } from './providers/C_ThemeProvider';
import CS_LoadingIndicator from './components/static/CS_LoadingIndicator';
import { $GLOBAL } from './$GLOBAL';
import { E_Events, SocketManager } from './managers/SocketManager';
import C_AuthView from './components/C_AuthView';
import C_Header from './components/C_Header';
import C_Footer from './components/C_Footer';
import C_Button from './components/C_Button';

type T_States = {
  readonly UserObject?: I_UserEntry,
  readonly UserList: Array<I_UserEntry>,
  readonly MessageList: Array<I_MessageEntry>,
  readonly MessageInputText: string,
};

export default function App() {
  const WINDOW = useWindowDimensions();
  // GLOBAL STATE
  const [theme, setTheme] = React.useState<T_Theme>('Dark');
  // APP STATE
  const [state, setState] = React.useState<T_States>({
    UserList: [], // <-- LOAD FROM SERVER
    MessageList: [], // <-- LOAD FROM SERVER
    MessageInputText: '',
  });
  const REFS = {
    ChatScroll: React.useRef<FlatList>(null),
  };
  function OnSubmitMessage() {
    if (CS_LoadingIndicator.IsActive) // <-- PREVENT UNWANTED INPUT
      return;
    const TEXT_VALUE = state.MessageInputText.trim();
    if (!(TEXT_VALUE)) { // <-- VALIDATE TEXT
      return $GLOBAL.Dialog({
        Title: 'Info',
        Message: 'You have entered an invalid message. Please try again.',
      });
    }
    SocketManager.SINGLETON.SendMessage({ MessageText: TEXT_VALUE });
  }
  // CALLBACK HANDLERS
  React.useEffect(() => {
    SocketManager.SINGLETON.SetCallback(E_Events.Connected, (data: I_DataObject) => {
      console.log('DATA OBJECT', data);
      setState({ ...state, ...data });
      CS_LoadingIndicator.SetActive(false);
    });
    SocketManager.SINGLETON.SetCallback(E_Events.Disconnect, () => {
      setState({ UserList: [], MessageList: [], UserObject: undefined, MessageInputText: '' });
      CS_LoadingIndicator.SetActive(false);
    });
    SocketManager.SINGLETON.SetCallback(E_Events.UserJoined, (data: I_UserEntry) => {
      setState({ ...state, UserList: [...state.UserList, data] });
      console.log('A USER HAS JOINED THE CHATROOM', data);
    });
    SocketManager.SINGLETON.SetCallback(E_Events.UserLeft, (data: I_UserEntry) => {
      setState({ ...state, UserList: state.UserList.filter(x => x.UserId !== data.UserId) });
    });
    SocketManager.SINGLETON.SetCallback(E_Events.ChatMessage, (data: I_MessageEntry) => {
      setState({ ...state, MessageList: [...state.MessageList, data], MessageInputText: '' });
      // REFS.ChatScroll.current?.scrollToIndex(({ index: (state.MessageList.length - 1), animated: true }));
      const IS_SELF: boolean = data.UserId === state.UserObject?.UserId;
      if (IS_SELF)
        CS_LoadingIndicator.SetActive(false);
    });
  });
  // LIST RENDER ITEMS
  const RENDER_USER: ListRenderItem<I_UserEntry> = (x: ListRenderItemInfo<I_UserEntry>) => (<C_UserEntry IsActive={true} Theme={theme} IsSelf={x.item.UserId === state.UserObject?.UserId} {...x.item} />);
  const RENDER_MESSAGE: ListRenderItem<I_MessageEntry> = (x: ListRenderItemInfo<I_MessageEntry>) => (<C_MessageEntry IsActive={true} Theme={theme} IsSelf={x.item.UserId === state.UserObject?.UserId} {...x.item} />);
  // RENDER APP
  return (
    <C_ThemeProvider value={theme}>

      <SafeAreaView style={[STYLE.Container, {
        maxHeight: WINDOW.height /* PREVENT PAGE OVERFLOW */, marginTop: StatusBar.currentHeight /* PREVENT CONTENT FROM FLOWING INTO THE STATUS BAR */, backgroundColor: THEME_COLORS.Background[theme]
      }]} >

        <C_Header IsActive={true} Theme={theme} HeaderText='Chatroom App (Sample) made by Liam Scholtz' OnThemeToggle={() => setTheme((theme === 'Light' ? 'Dark' : 'Light'))} />

        {/* <ScrollView style={{ width: '100%', maxWidth: 1280, paddingHorizontal: 30 }} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}> */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%', maxWidth: 1280, paddingHorizontal: 10, flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} >
          {
            !(SocketManager.SINGLETON.IsConnected)
              ? <C_AuthView IsActive={true} Theme={theme} />
              : <View style={STYLE.ContentView}>
                <View style={STYLE.UserWindow}>
                  <Text style={{ color: THEME_COLORS.Text[theme], fontSize: (WINDOW.width < 600 ? (WINDOW.width / 24) : 24) }}>Connected Users</Text>
                  <FlatList style={STYLE.UserPanel} contentContainerStyle={STYLE.UserPanelContent} horizontal={true} data={state.UserList}
                    renderItem={RENDER_USER} keyExtractor={x => x.UserId} />
                </View>
                <View style={STYLE.ChatWindow} >
                  <FlatList ref={REFS.ChatScroll} style={{ ...STYLE.ChatPanel, height: ((WINDOW.height * 0.95) - 300) }} contentContainerStyle={STYLE.ChatPanelContent} data={state.MessageList}
                    renderItem={RENDER_MESSAGE} keyExtractor={x => x.MessageId} />
                  <View style={{ flexDirection: 'row' }}>
                    <TextInput style={[STYLE.MessageInputText, { flexGrow: 1, color: (theme === 'Light' ? E_Colors.Black : E_Colors.White), borderColor: (theme === 'Light' ? E_Colors.Dodgerblue : E_Colors.PurpleBlue) }]} placeholder="Message ..." value={state.MessageInputText}
                      onChangeText={x => setState({ ...state, MessageInputText: x })} onSubmitEditing={OnSubmitMessage} blurOnSubmit={false} />
                    <C_Button style={{ justifyContent: 'center', width: 100, marginTop: 30, marginLeft: 10 }} onPress={OnSubmitMessage} IsActive={true} Theme={theme} Text={'Send'} />
                  </View>
                </View>
              </View>
          }
        </KeyboardAvoidingView>
        {/* </ScrollView> */}

        <C_Footer IsActive={true} Theme={theme} FooterText='DISCLAIMER: This app temporarily stores all messages sent via any chat room on a node.js server until a clean up maintenance is issued.' />

      </SafeAreaView>

      {/* STATIC COMPONENTS */}
      <CS_LoadingIndicator IsActive={false} Theme={theme} />

    </C_ThemeProvider >
  );
}

const STYLE = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ContentView: {
    flex: 1,
    width: '100%',
  },
  ChatWindow: {
    marginVertical: 10,
  },
  UserWindow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ChatPanel: {
    borderWidth: 1,
    borderColor: E_Colors.White,
  },
  UserPanel: {
    marginLeft: 20,
  },
  ChatPanelContent: {
    flexGrow: 1,
  },
  UserPanelContent: {

  },
  MessageInputText: {
    borderWidth: 1,
    marginTop: 30,
    paddingVertical: 20,
    textAlign: 'center',
  },
});
