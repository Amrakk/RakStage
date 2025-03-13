import { Redis } from "ioredis";
import EventEmitter from "events";
import { serverId } from "../core.js";
import { INTERACTION_EVENTS, REDIS_URI, RESPONSE_CODE } from "../constants.js";

import { ValidateError } from "mongooat";
import BadRequestError from "../errors/BadRequestError.js";
import ServiceResponseError from "../errors/ServiceResponseError.js";

import type { ObjectId } from "mongodb";
import type { IStage } from "../interfaces/external/stage.js";

type BaseEvent<T extends Record<string, unknown>> = {
    actionId: string;
    data: T;
};

type BaseSubscriberEvent = BaseEvent<Record<string, unknown>> & {
    event: INTERACTION_EVENTS;
    error?: any;
};

export type PublishEvents = {
    [INTERACTION_EVENTS.STAGE_CREATE]: { title: string; hostId: ObjectId };
    [INTERACTION_EVENTS.STAGE_JOIN]: { code: string; joinId: ObjectId };
};

export type StageSubscriberEvent = BaseEvent<{ stage: IStage; token: string }>;

export type SubscriberEvents = {
    error: [error: any];
    [INTERACTION_EVENTS.STAGE_CREATE]: [data: StageSubscriberEvent];
    [INTERACTION_EVENTS.STAGE_JOIN]: [data: StageSubscriberEvent];
};

class MessageBroker extends EventEmitter<SubscriberEvents> {
    private name = "MessageBroker";
    public static instance: MessageBroker;

    private publisher: Redis;
    private subscriber: Redis;

    private constructor() {
        super();
        this.publisher = new Redis(REDIS_URI, { lazyConnect: true });
        this.subscriber = new Redis(REDIS_URI, { lazyConnect: true });
        this.setMaxListeners(Infinity);
    }

    public static getInstance(): MessageBroker {
        if (!this.instance) this.instance = new MessageBroker();
        return this.instance;
    }

    public async publish<T extends keyof PublishEvents>(
        targetServerId: string,
        event: T,
        message: BaseEvent<PublishEvents[T]>
    ): Promise<void> {
        const messageData = {
            ...message,
            event,
            reqServerId: serverId,
        };

        await this.publisher.publish(targetServerId, JSON.stringify(messageData));
    }

    public async start(): Promise<void> {
        await Promise.all([this.publisher.connect(), this.subscriber.connect()]);

        await this.subscriber.subscribe(serverId, (err, count) => {});

        this.subscriber.on("error", (err) => this.emit("error", err));

        this.subscriber.on("message", (_, message) => {
            try {
                const { event, actionId, data, error } = JSON.parse(message) as BaseSubscriberEvent;

                const refinedData = this.handleResponse(event, { data, error });

                if (event === INTERACTION_EVENTS.STAGE_CREATE || event === INTERACTION_EVENTS.STAGE_JOIN) {
                    this.emit(event, { actionId, data: refinedData } as StageSubscriberEvent);
                }
            } catch (err) {
                this.emit("error", err);
            }
        });
    }

    public async stop(): Promise<void> {
        await Promise.all([this.publisher.quit(), this.subscriber.quit()]);
    }

    public createListener<T extends keyof SubscriberEvents>(
        listener: (...args: SubscriberEvents[T]) => void
    ): (...args: SubscriberEvents[T]) => void {
        return listener;
    }

    private handleResponse<T>(context: string, response: any): T {
        const { data, error } = response;

        if (error) {
            if (error.code === RESPONSE_CODE.BAD_REQUEST) throw new BadRequestError(error.error);
            if (error.code === RESPONSE_CODE.VALIDATION_ERROR) throw new ValidateError("Invalid data", error.error);
            throw new ServiceResponseError(this.name, context, error.error, response);
        }

        if (!data) throw new ServiceResponseError(this.name, context, "No data received", response);

        return data;
    }
}

const messageBroker = MessageBroker.getInstance();
export default messageBroker;
