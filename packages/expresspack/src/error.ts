const CUSTOM_ERROR_SYMBOL = Symbol('expresspackCustomError');

export class CustomError extends Error {

    status: number;
    code: string;
    statusCode: number;
    data: any;
    isOperational: boolean;

    readonly [CUSTOM_ERROR_SYMBOL] = true;

    constructor({
        message = 'An error occurred',
        code = 'INTERNAL_SERVER_ERROR',
        statusCode = 500,
        data = null,
        isOperational = true,
        sanitizeData = true,
    }) {
        super(message);
        this.name = 'CustomError';
        this.status = statusCode;
        this.code = code;
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        this.data = sanitizeData ? this.sanitizeDataForJSON(data) : data;

        Object.setPrototypeOf(this, CustomError.prototype);
    }

    static isCustomError(error: any): error is CustomError {
        return (
            error !== null &&
            typeof error === 'object' &&
            CUSTOM_ERROR_SYMBOL in error &&
            (error as any)[CUSTOM_ERROR_SYMBOL] === true
        );
    }

    public toJSON() {
        return {
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
            data: this.data,
            isOperational: this.isOperational,
        };
    }

    isOperationalError(): boolean {
        return this.isOperational;
    }

    /**
     * Sanitizes data for JSON serialization by handling circular references,
     * functions, symbols, and other non-serializable values
     */
    private sanitizeDataForJSON(data: unknown): unknown {
        try {
            // Quick check if data is already JSON-serializable
            JSON.stringify(data);
            return data;
        } catch {
            const seen = new WeakSet();

            const sanitize = (value: unknown): unknown => {
                // Handle primitives and null
                if (value === null || typeof value !== 'object') {
                    // Remove functions, symbols, and undefined
                    if (typeof value === 'function' || typeof value === 'symbol' || value === undefined) {
                        return null;
                    }
                    return value;
                }

                // Handle circular references
                if (seen.has(value as object)) {
                    return '[Circular Reference]';
                }
                seen.add(value as object);

                // Handle arrays
                if (Array.isArray(value)) {
                    return value.map(sanitize);
                }

                // Handle objects
                const sanitized: Record<string, unknown> = {};
                for (const [key, val] of Object.entries(value)) {
                    // Skip symbol keys and non-enumerable properties
                    if (typeof key === 'string') {
                        sanitized[key] = sanitize(val);
                    }
                }
                return sanitized;
            };

            return sanitize(data);
        }
    }
}

// Exported the symbol just in-case it needs to be used elsewhere
export {
    CUSTOM_ERROR_SYMBOL
}