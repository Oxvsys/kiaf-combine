export interface LoginResponse {
    refresh: string;
    access: string;
}

export interface ResendEmailVerificationLink {
    email_sent: boolean;
    message: string;
}

export interface ChangePasswordResponse {
    success: string | undefined;
    status: string;
    message: string;
    error: string;
}

export interface ForgotPasswordEmailResponse {
    success?: string;
    error?: string;
    email_sent?:boolean;
    message?:string;
}

export interface UpdatePasswordResponse {
    success: string;
    message: string;
    uidb64: string;
    token: string;
    error: string;
}

export interface UpdatePasswordConfirmResponse {
    success: string;
    message: string;
}