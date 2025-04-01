import type { IUserSimplify } from "@/models/user.js";
import type { WS_RECEIVE_OPERATION, WS_SEND_OPERATION } from "../../constants.js";

export type WSMessage<T extends WS_RECEIVE_OPERATION | WS_RECEIVE_OPERATION> = WSMessageData<T> & { op: T };

export type WSMessageData<T extends WS_RECEIVE_OPERATION | WS_RECEIVE_OPERATION> = T extends WS_RECEIVE_OPERATION.HELLO
    ? { timeout: number; heartbeatInterval: number }
    : T extends WS_RECEIVE_OPERATION.HEARTBEAT | WS_SEND_OPERATION.HEARTBEAT_ACK
    ? { timestamp: number }
    : T extends WS_RECEIVE_OPERATION.PENDING_REMOTE_INIT
    ? { fingerprint: string }
    : T extends WS_RECEIVE_OPERATION.PENDING_TICKET
    ? { user: IUserSimplify }
    : T extends WS_RECEIVE_OPERATION.PENDING_LOGIN
    ? { ticket: string }
    : T extends WS_RECEIVE_OPERATION.CANCEL
    ? {}
    : never;
