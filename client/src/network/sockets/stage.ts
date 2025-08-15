import EventEmitter from "events";
import { io, Socket } from "socket.io-client";

type StageSocketEvents = {
    error: [error: any];
};

export default class StageSocketManager extends EventEmitter<StageSocketEvents> {
    private socket: Socket | null = null;
    public static instance: StageSocketManager;

    constructor() {
        super();
    }

    public static getInstance() {
        if (!this.instance) this.instance = new StageSocketManager();
        return this.instance;
    }

    public connect(url: string) {
        console.log("Connecting to stage server:", url);

        this.socket = io(url);

        this.socket.on("connect", () => {
            console.log("Connected to stage server");
        });

        this.socket.on("error", (error) => {
            console.error("Error:", error);
            this.emit("error", error);
        });
    }
}
