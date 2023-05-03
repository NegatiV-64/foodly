export class ResponseError extends Error {
    constructor(public code: number, public ok: boolean, public data: unknown, public error: unknown) {
        super(typeof error === 'string' ? error : JSON.stringify(error));
    }
}