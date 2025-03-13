export class WebsocketManager {
    private static tokenMapper: Map<string, string> = new Map();

    public static async tokenValidate(requestorId: string, token: string): Promise<boolean> {
        const storedToken = this.tokenMapper.get(requestorId);
        if (storedToken !== token) return false;
        this.tokenMapper.delete(requestorId);

        return true;
    }

    public static async tokenGenerate(requestorId: string): Promise<string> {
        const token = crypto.randomUUID();
        this.tokenMapper.set(requestorId, token);

        console.log(this.tokenMapper, undefined, 2);

        return token;
    }
}
