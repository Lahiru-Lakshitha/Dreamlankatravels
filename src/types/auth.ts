export interface AuthResult {
    success: boolean;
    message?: string;
    error?: string;
    redirectUrl?: string; // For redirecting after successful action (e.g. to OTP verify page)
}
