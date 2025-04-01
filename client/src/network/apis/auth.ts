import { API } from ".";
import { Passkey, PasskeyJSON } from "@/models/passkey";

import type { IResLogin, IResPasskey, IResponse } from "@/interfaces/response";
import type { LoginRequest, SignUpRequest, ResetPasswordRequest } from "@/interfaces/request";

export async function login(data: LoginRequest): Promise<IResLogin> {
    return API.post<IResponse<IResLogin>>("/auth/login", data).then((res) => res.data.data!);
}

export function loginWithGoogle(): void {
    window.location.href = `${import.meta.env.VITE_ENTRYPOINT_URL}/auth/google`;
}

export function loginWithDiscord(): void {
    window.location.href = `${import.meta.env.VITE_ENTRYPOINT_URL}/auth/discord`;
}

export async function register(data: SignUpRequest): Promise<IResLogin> {
    const registerData = {
        ...data,
        phoneNumber: data.phoneNumber || undefined,
    };

    return API.post<IResponse<IResLogin>>("/auth/register", registerData).then((res) => res.data.data!);
}

export async function forgotPassword(email: string): Promise<void> {
    await API.post("/auth/forgot-password", { email });
}

export async function resetPassword(data: ResetPasswordRequest): Promise<void> {
    await API.post("/auth/reset-password", data);
}

export async function verify(): Promise<IResLogin> {
    return API.post<IResponse<IResLogin>>("/auth/verify").then((res) => res.data.data!);
}

export async function logout(): Promise<void> {
    await API.post("/auth/logout");
}

// Passkey
export async function loginWithPasskey(credential: PublicKeyCredential): Promise<IResLogin> {
    return await API.post("/auth/passkey/login", { credential: credential.toJSON() }).then((res) => res.data.data!);
}

export async function createPasskeyLoginOptions(userId: string): Promise<PublicKeyCredentialRequestOptionsJSON> {
    return API.post("/auth/passkey/login/options", { userId }).then((res) => res.data.data!);
}

export async function createPasskey(credential: PublicKeyCredential): Promise<IResPasskey> {
    return API.post("/auth/passkey", { credential: credential.toJSON() }).then((res) => new Passkey(res.data.data!));
}

export async function createPasskeyOptions(): Promise<PublicKeyCredentialCreationOptions> {
    return API.post("/auth/passkey/options").then((res) => res.data.data!);
}

export async function getPasskeys(): Promise<IResPasskey[]> {
    return API.get("/auth/passkey").then((res) => res.data.data!.map((passkey: PasskeyJSON) => new Passkey(passkey)));
}

export async function updatePasskey(data: { _id: string; name: string }): Promise<IResPasskey> {
    return API.put(`/auth/passkey/${data._id}`, { name: data.name }).then((res) => new Passkey(res.data.data!));
}

export async function deletePasskey(id: string): Promise<Passkey> {
    return API.delete(`/auth/passkey/${id}`).then((res) => new Passkey(res.data.data!));
}

// Fingerprint
export async function validateFingerprint(fingerprint: string): Promise<{ validated: boolean }> {
    return API.post("/auth/fp", { fingerprint }).then((res) => res.data.data!);
}

export async function acceptFingerprint(fingerprint: string): Promise<{ result: boolean }> {
    return API.post("/auth/fp/accept", { fingerprint }).then((res) => res.data.data!);
}

export async function declineFingerprint(fingerprint: string): Promise<{ result: boolean }> {
    return API.post("/auth/fp/decline", { fingerprint }).then((res) => res.data.data!);
}

export async function loginWithTicket(ticket: string): Promise<IResLogin> {
    return API.post("/auth/fp/ticket", { ticket }).then((res) => res.data.data!);
}
