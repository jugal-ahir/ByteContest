class ApiError extends Error {
    statusCode: number;
    data: any;
    success: boolean;
    errors: Array<any>;
    message: string;
    serverTime: string;

    constructor(
        statusCode: number,
        message: string = "",
        errors: Array<any> = [],
        stack: string = "",
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;
        this.message = message;
        this.serverTime = new Date().toISOString();
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            data: { ok: false },
            success: this.success,
            errors: this.errors,
            message: this.message,
            serverTime: this.serverTime,
        };
    }
}

export { ApiError };