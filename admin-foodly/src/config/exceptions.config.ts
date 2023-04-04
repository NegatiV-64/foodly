export class ServerError extends Error {
    constructor(
        public message: string,
        public code: number,
        public reason?: string
    ) {
        super(message);
    }
}