/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ENV: string;
    readonly VITE_PORT: number;
    readonly VITE_HOST: string;
    readonly VITE_SOCKET_URL: string;
    readonly VITE_ENTRYPOINT_URL: string;

    readonly VITE_DEFAULT_AVATAR_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
