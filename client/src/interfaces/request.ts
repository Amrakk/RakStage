export interface LoginRequest {
    emailOrPhone: string;
    password: string;
}

export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
}

export interface ResetPasswordRequest {
    email: string;
    otp: string;
    password: string;
}
