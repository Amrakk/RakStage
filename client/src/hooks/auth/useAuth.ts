import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/stores/user.store";
import { useMutation } from "@tanstack/react-query";
import { WSMessageData } from "@/interfaces/socket";
import WebSocketManager from "@/network/sockets/auth";
import { CLIENT_URL, WS_RECEIVE_OPERATION } from "@/constants";
import {
    login,
    logout,
    verify,
    register,
    resetPassword,
    forgotPassword,
    loginWithGoogle,
    loginWithDiscord,
    loginWithPasskey,
    getPasskeys,
    updatePasskey,
    deletePasskey,
    createPasskey,
    createPasskeyOptions,
    createPasskeyLoginOptions,
    loginWithTicket,
    acceptFingerprint,
    declineFingerprint,
    validateFingerprint,
} from "@/network/apis/auth";

import type { IUserSimplify, UserDetail } from "@/models/user";

interface IResLogin {
    user: UserDetail;
}

type Props = {
    onErrorCallback?: (error: any) => void;
    onSuccessCallback?: (data: UserDetail) => void;
};

export function useAuthActions(props?: Props) {
    const setUser = useUserStore((state) => state.setUser);
    const setLastUserId = useUserStore((state) => state.setLastUserId);

    function onSuccess(data: IResLogin) {
        const { user } = data;

        setUser(user);
        setLastUserId(user._id);
        if (props?.onSuccessCallback) props.onSuccessCallback(user);
    }

    function onError(error: any) {
        setUser();
        if (props?.onErrorCallback) props.onErrorCallback(error);
    }

    const registerAction = useMutation({
        mutationKey: ["register"],
        mutationFn: register,
        onSuccess: onSuccess,
        onError: onError,
    });

    const loginAction = useMutation({
        mutationKey: ["login"],
        mutationFn: login,
        onSuccess: onSuccess,
        onError: onError,
    });

    const logoutAction = useMutation({
        mutationKey: ["logout"],
        mutationFn: logout,
        onSuccess: () => setUser(),
        onError: onError,
    });

    const verifyAction = useMutation({
        mutationKey: ["verify"],
        mutationFn: verify,
        onSuccess: onSuccess,
        onError: onError,
    });

    const forgotPasswordAction = useMutation({
        mutationKey: ["forgotPassword"],
        mutationFn: forgotPassword,
    });

    const resetPasswordAction = useMutation({
        mutationKey: ["resetPassword"],
        mutationFn: resetPassword,
    });

    const loginWithGoogleAction = loginWithGoogle;
    const loginWithDiscordAction = loginWithDiscord;

    return {
        loginAction,
        logoutAction,
        verifyAction,
        registerAction,
        resetPasswordAction,
        forgotPasswordAction,
        loginWithGoogleAction,
        loginWithDiscordAction,
    };
}

export function usePasskeyActions() {
    const getPasskeysAction = useMutation({
        mutationKey: ["getPasskeys"],
        mutationFn: getPasskeys,
    });

    const updatePasskeyAction = useMutation({
        mutationKey: ["updatePasskey"],
        mutationFn: updatePasskey,
    });

    const deletePasskeyAction = useMutation({
        mutationKey: ["deletePasskey"],
        mutationFn: deletePasskey,
    });

    const loginPasskeyAction = useMutation({
        mutationKey: ["loginPasskey"],
        mutationFn: loginWithPasskey,
    });

    const createPasskeyLoginOptionAction = useMutation({
        mutationKey: ["createPasskeyLoginOptions"],
        mutationFn: createPasskeyLoginOptions,
    });

    const createPasskeyAction = useMutation({
        mutationKey: ["createPasskey"],
        mutationFn: createPasskey,
    });

    const createPasskeyOptionsAction = useMutation({
        mutationKey: ["createPasskeyOptions"],
        mutationFn: createPasskeyOptions,
    });

    return {
        getPasskeysAction,
        updatePasskeyAction,
        deletePasskeyAction,
        loginPasskeyAction,
        createPasskeyAction,
        createPasskeyOptionsAction,
        createPasskeyLoginOptionAction,
    };
}

export function useQRCodeActions() {
    const validateFingerprintAction = useMutation({
        mutationKey: ["validateFingerprint"],
        mutationFn: validateFingerprint,
    });

    const acceptFingerprintAction = useMutation({
        mutationKey: ["acceptFingerprint"],
        mutationFn: acceptFingerprint,
    });

    const declineFingerprintAction = useMutation({
        mutationKey: ["declineFingerprint"],
        mutationFn: declineFingerprint,
    });

    return {
        acceptFingerprintAction,
        declineFingerprintAction,
        validateFingerprintAction,
    };
}

export function useAuthSocket() {
    const navigate = useNavigate();
    const resetQRCodeRef = useRef<(() => void) | undefined>(undefined);
    const [user, setUser] = useState<IUserSimplify | undefined>(undefined);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | undefined>(undefined);

    const setUserStore = useUserStore((state) => state.setUser);
    const setLastUserId = useUserStore((state) => state.setLastUserId);

    useEffect(() => {
        const socketManager = WebSocketManager.getInstance();

        resetQRCodeRef.current = () => {
            socketManager.resetWS();
        };

        const onPendingRemoteInit = ({ fingerprint }: WSMessageData<WS_RECEIVE_OPERATION.PENDING_REMOTE_INIT>) => {
            console.log(fingerprint);
            setUser(undefined);
            setQrCodeUrl(`${CLIENT_URL}/qr/${fingerprint}`);
        };

        const onPendingTicket = ({ user }: WSMessageData<WS_RECEIVE_OPERATION.PENDING_TICKET>) => {
            setUser(user);
            setQrCodeUrl(undefined);
        };

        const onPendingLogin = async ({ ticket }: WSMessageData<WS_RECEIVE_OPERATION.PENDING_LOGIN>) => {
            await loginWithTicket(ticket).then(async (data) => {
                setUserStore(data.user);
                setLastUserId(data.user._id);

                await navigate("/home");
            });

            setUser(undefined);
        };

        socketManager.on(WS_RECEIVE_OPERATION.PENDING_LOGIN, onPendingLogin);
        socketManager.on(WS_RECEIVE_OPERATION.PENDING_TICKET, onPendingTicket);
        socketManager.on(WS_RECEIVE_OPERATION.PENDING_REMOTE_INIT, onPendingRemoteInit);

        return () => {
            socketManager.off(WS_RECEIVE_OPERATION.PENDING_LOGIN, onPendingLogin);
            socketManager.off(WS_RECEIVE_OPERATION.PENDING_TICKET, onPendingTicket);
            socketManager.off(WS_RECEIVE_OPERATION.PENDING_REMOTE_INIT, onPendingRemoteInit);
        };
    }, []);

    const resetQRCode = useCallback(() => {
        resetQRCodeRef.current?.();
    }, []);

    return { qrCodeUrl, user, resetQRCode };
}
