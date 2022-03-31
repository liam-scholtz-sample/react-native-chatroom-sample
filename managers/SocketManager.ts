import { io, Socket } from "socket.io-client";
import { $GLOBAL } from "../$GLOBAL";
import { I_MessageEntry } from "../components/C_MessageEntry";
import { I_DataObject, I_UserEntry } from "../components/C_UserEntry";
import CS_LoadingIndicator from "../components/static/CS_LoadingIndicator";

export enum E_Events {
    RequestError = 'request-error',
    Connected = 'connected',
    Disconnect = 'disconnect',
    UserJoined = 'user-joined',
    UserLeft = 'user-left',
    ChatMessage = 'chat-message',
}

type T_Callbacks<T> = {
    [_ in E_Events]?: (s: T) => void
}

interface I_Error {
    ErrorMessage: string,
}

interface I_HandshakeParams {
    UserName: string,
    AuthToken: string,
}

const SCHEME: string = 'https';
const ADDRESS: string = 'node-js-chat-room-sample.herokuapp.com';

export class SocketManager {
    public static readonly SINGLETON: SocketManager = new SocketManager();
    private readonly CALLBACKS: T_Callbacks<any> = {};
    private SOCKET: Socket | null = null;

    public get IsConnected(): boolean {
        return this.SOCKET instanceof Socket && this.SOCKET !== null;
    }

    public SetCallback<T>(event: E_Events, callback: (s: T) => void) {
        this.CALLBACKS[event] = callback;
    }

    public async Connect(params: I_HandshakeParams): Promise<Socket | void> {
        if (this.SOCKET !== null) {
            return $GLOBAL.Dialog({
                Title: 'Info',
                Message: 'This socket is already connected to the server. Request aborted.',
            });
        }

        CS_LoadingIndicator.SetActive(true);

        await $GLOBAL.Delay(500);

        this.SOCKET = io(`${SCHEME}://${ADDRESS}`, { auth: params, reconnection: false });

        this.SOCKET.on('connect_error', (err) => {
            if (err instanceof Error) {
                $GLOBAL.Dialog({
                    Title: 'Error',
                    Message: err.message,
                });
            }
            else {
                $GLOBAL.Dialog({
                    Title: 'Fatal Error',
                    Message: 'An unknown error has occured. Please try again.',
                });
            }
            this.SOCKET = null;
            CS_LoadingIndicator.SetActive(false);
        });

        this.SOCKET.on(E_Events.RequestError, (data: I_Error) => {
            this.CALLBACKS[E_Events.RequestError]?.(data);
            $GLOBAL.Dialog({
                Title: 'Error',
                Message: data.ErrorMessage,
            });
        });

        this.SOCKET.on(E_Events.Connected, (data: I_DataObject) => {
            this.CALLBACKS[E_Events.Connected]?.(data);
            CS_LoadingIndicator.SetActive(false);
        });

        this.SOCKET.on(E_Events.Disconnect, () => {
            this.SOCKET = null;
            this.CALLBACKS[E_Events.Disconnect]?.(null);
            $GLOBAL.Dialog({
                Title: 'Info',
                Message: 'You have disconnected from the server.',
            });
        });

        this.SOCKET.on(E_Events.UserJoined, (data: I_UserEntry) => {
            this.CALLBACKS[E_Events.UserJoined]?.(data);
        });

        this.SOCKET.on(E_Events.UserLeft, (data: I_UserEntry) => {
            this.CALLBACKS[E_Events.UserLeft]?.(data);
        });

        this.SOCKET.on(E_Events.ChatMessage, (data: I_MessageEntry) => {
            this.CALLBACKS[E_Events.ChatMessage]?.(data);
        });

        return this.SOCKET;
    }

    public SendMessage(params: { MessageText: string }) {
        CS_LoadingIndicator.SetActive({ IsLazy: true });
        this.SOCKET?.emit(E_Events.ChatMessage, params);
    }
}
