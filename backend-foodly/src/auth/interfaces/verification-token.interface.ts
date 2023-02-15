export interface VerificationTokenPayload {
    code: number;
    email: string;
}

export interface VerificationTokenDecoded extends VerificationTokenPayload {
    iat: number;
    exp: number;
}
