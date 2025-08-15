import logoQR from "@/assets/logoQR.svg";

import type { Options } from "qr-code-styling/lib/types";

export const PORT = import.meta.env.VITE_PORT;
export const HOST = import.meta.env.VITE_HOST;
export const DEFAULT_AVATAR_URL = import.meta.env.VITE_DEFAULT_AVATAR_URL;

export const IS_PROD = import.meta.env.VITE_ENV === "production";
export const CLIENT_URL = `${IS_PROD ? "https" : "http"}://${HOST}${IS_PROD ? "" : `:${PORT}`}`;

export const PaginationLimitOptions = [
    { name: "1", value: "1" },
    { name: "10", value: "10" },
    { name: "20", value: "20" },
    { name: "50", value: "50" },
    { name: "100", value: "100" },
];

export const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png"];

/******************/
/******************/
/**     ENUM     **/
/******************/
/******************/
// API
export enum RESPONSE_CODE {
    SUCCESS = 0,
    UNAUTHORIZED = 1,
    FORBIDDEN = 3,
    NOT_FOUND = 4,
    BAD_REQUEST = 5,
    VALIDATION_ERROR = 8,
    TOO_MANY_REQUESTS = 9,

    SERVICE_UNAVAILABLE = 99,
    INTERNAL_SERVER_ERROR = 100,
}

export enum RESPONSE_MESSAGE {
    SUCCESS = "Operation completed successfully",
    UNAUTHORIZED = "Access denied! Please provide valid authentication",
    FORBIDDEN = "You don't have permission to access this resource",
    NOT_FOUND = "Resource not found! Please check your data",
    BAD_REQUEST = "The request could not be understood or was missing required parameters",
    VALIDATION_ERROR = "Input validation failed! Please check your data",
    TOO_MANY_REQUESTS = "Too many requests! Please try again later",

    SERVICE_UNAVAILABLE = "Service is temporarily unavailable! Please try again later",
    INTERNAL_SERVER_ERROR = "An unexpected error occurred! Please try again later.",
}

// WEBSOCKET
export enum WS_CLOSE_CODE {
    TIMEOUT = 1,
    EXPIRED = 2,
    FINGERPRINT_CANCELED = 3,
}

export enum WS_CLOSE_REASON {
    TIMEOUT = "Connection timeout",
    EXPIRED = "Connection expired",
    FINGERPRINT_CANCELED = "Fingerprint canceled",
}

export enum WS_RECEIVE_OPERATION {
    HELLO = "hello",
    HEARTBEAT = "heartbeat",
    PENDING_REMOTE_INIT = "pending_remote_init",
    PENDING_TICKET = "pending_ticket",
    PENDING_LOGIN = "pending_login",
    CANCEL = "cancel",
}

export enum WS_SEND_OPERATION {
    HEARTBEAT_ACK = "heartbeat_ack",
}

// USER
export enum USER_ROLE {
    ADMIN = 0,
    USER = 1,
    UNKNOWN = 99,
}

export enum USER_STATUS {
    ACTIVE = 0,
    INACTIVE = 1,
    BANNED = 2,
}

export enum SOCIAL_MEDIA_PROVIDER {
    GOOGLE = "google",
    DISCORD = "discord",
}

// PASSKEY
/** type AuthenticatorTransportFuture = 'ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb'*/
export enum PASSKEY_TRANSPORT {
    BLE = "ble",
    CABLE = "cable",
    HYBRID = "hybrid",
    INTERNAL = "internal",
    NFC = "nfc",
    SMART_CARD = "smart-card",
    USB = "usb",
}

export const QR_Options: Partial<Options> = {
    type: "canvas",
    margin: 0,
    width: 700,
    height: 700,
    image: logoQR,
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 1,
        imageSize: 0.5,
        hideBackgroundDots: false,
    },
    cornersDotOptions: {
        type: "rounded",
    },
    qrOptions: {
        errorCorrectionLevel: "Q",
    },
    dotsOptions: {
        color: "#1C1C1C",
        type: "extra-rounded",
    },
    backgroundOptions: {
        color: "#ECF0F1",
    },
    cornersSquareOptions: {
        type: "extra-rounded",
    },
};

// STAGE
export enum STAGE_STATUS {
    LIVE = 0,
    ENDED = 1,
}
