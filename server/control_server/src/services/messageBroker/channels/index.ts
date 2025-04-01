import { ValidateError } from "mongooat";
import { MessageBroker } from "../index.js";
import { serverId } from "../../../core.js";
import handleServerMessage from "./self.js";
import { RESPONSE_CODE } from "../../../constants.js";

import BadRequestError from "../../../errors/BadRequestError.js";
import ServiceResponseError from "../../../errors/ServiceResponseError.js";

import type { BaseSubscriberEvent } from "../../../interfaces/messageBroker/index.js";

export default function onMessage(this: MessageBroker, channel: string, message: string): void {
    try {
        const parsedMessage = JSON.parse(message) as BaseSubscriberEvent;

        switch (channel) {
            case serverId:
                return handleServerMessage.call(this, parsedMessage);
            // case WS_BROADCAST_CHANNEL:
            //     return handleBroadcastMessage.call(this, parsedMessage);
            default:
                throw new Error(`Unknown channel: ${channel}`);
        }
    } catch (err) {
        this.emit("error", err);
    }
}

export function handleResponse<T>(context: string, response: any): T {
    const { data, error } = response;

    if (error) {
        if (error.code === RESPONSE_CODE.BAD_REQUEST) throw new BadRequestError(error.error);
        if (error.code === RESPONSE_CODE.VALIDATION_ERROR) throw new ValidateError("Invalid data", error.error);
        throw new ServiceResponseError(MessageBroker.name, context, error.error, response);
    }

    if (!data) throw new ServiceResponseError(MessageBroker.name, context, "No data received", response);

    return data;
}
