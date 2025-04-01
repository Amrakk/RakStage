import EventEmitter from "events";
import { WSMessageData } from "@/interfaces/socket";
import { WS_CLOSE_CODE, WS_RECEIVE_OPERATION, WS_SEND_OPERATION } from "@/constants";

const socketUrl = import.meta.env.VITE_SOCKET_URL;

export type SocketEvents = {
    error: [error: any];
    [WS_RECEIVE_OPERATION.PENDING_LOGIN]: [data: WSMessageData<WS_RECEIVE_OPERATION.PENDING_LOGIN>];
    [WS_RECEIVE_OPERATION.PENDING_TICKET]: [data: WSMessageData<WS_RECEIVE_OPERATION.PENDING_TICKET>];
    [WS_RECEIVE_OPERATION.PENDING_REMOTE_INIT]: [data: WSMessageData<WS_RECEIVE_OPERATION.PENDING_REMOTE_INIT>];
};

export default class WebSocketManager extends EventEmitter<SocketEvents> {
    private socket: WebSocket | null = null;
    private reconnectDelay = 1000;
    public static instance: WebSocketManager;

    constructor() {
        super();
        this.connect();
    }

    public static getInstance() {
        if (!this.instance) this.instance = new WebSocketManager();
        return this.instance;
    }

    private connect() {
        this.socket = new WebSocket(socketUrl);

        this.socket.onopen = () => {
            console.log("Connected to server");
        };

        this.socket.onmessage = (event) => {
            const { op, ...data } = JSON.parse(event.data);

            switch (op) {
                case WS_RECEIVE_OPERATION.HEARTBEAT:
                    this.socket?.send(JSON.stringify({ op: WS_SEND_OPERATION.HEARTBEAT_ACK, timestamp: Date.now() }));
                    break;
                case WS_RECEIVE_OPERATION.PENDING_LOGIN:
                case WS_RECEIVE_OPERATION.PENDING_TICKET:
                case WS_RECEIVE_OPERATION.PENDING_REMOTE_INIT:
                    this.emit(op, data);
                    break;
                default:
                    break;
            }
        };

        this.socket.onclose = (event) => {
            if (event.code === WS_CLOSE_CODE.EXPIRED || event.code === WS_CLOSE_CODE.FINGERPRINT_CANCELED) {
                setTimeout(() => this.connect(), this.reconnectDelay);
            }
        };

        this.socket.onerror = (error) => {
            console.error("Error:", error);
        };
    }

    public resetWS() {
        if (this.socket) {
            this.socket.onclose = null;
            this.socket.close();
        }

        this.connect();
    }

    public send(data: object) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }
}
