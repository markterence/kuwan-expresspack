import type { RequestHandler } from "express";
import { timingSafeCompare } from "../../utils/time-safe-compare";
import consola from "consola";

type BearerAuthTokenOptions = | {
    token: string | string[];
    authScheme?: string;
    authHeaderName?: string;
    noAuthenticationHeaderMessage?: string | object
    invalidAuthenticationHeaderMessage?: string | object
    invalidTokenMessage?: string | object
} | {
    verifyTokenFn: (token: string) => boolean | Promise<boolean>;
    authScheme?: string;
    authHeaderName?: string;
    noAuthenticationHeaderMessage?: string | object
    invalidAuthenticationHeaderMessage?: string | object
    invalidTokenMessage?: string | object
}

// Bearer Auth is usually: `Authorization: Bearer <token>`
// but some APIs use `Authorization: <token>` or sometimes `Authorization api-key <token>` 
const AUTH_SCHEME = 'Bearer';
const AUTH_HEADER = 'Authorization';
// https://datatracker.ietf.org/doc/html/rfc6750#section-2.1
const AUTH_HEADER_PATTERN = '[A-Za-z0-9._~+/-]+=*';

export const bearerAuthToken = (options: BearerAuthTokenOptions): RequestHandler => {
    if (!('token' in options || 'verifyTokenFn' in options)) {
        throw new Error('BearerAuthToken "token" or "verifyTokenFn" must be provided.');
    }

    if (options.authScheme === undefined ) {
        options.authScheme = AUTH_SCHEME;
    }

    const bearerName = options.authScheme === '' ? '' : `${options.authScheme} +`;
 
        const regex = new RegExp(`^${bearerName}(${AUTH_HEADER_PATTERN}) *$`);
   
 

    return async (req, res, next) => {
        const token = req.header(options.authHeaderName || AUTH_HEADER);

        if(!token) { 
            return res.status(401).json(options.noAuthenticationHeaderMessage || 'Unauthorized');
        } else {
            const tokenMatches = regex.exec(token);

            if(!tokenMatches) {
                return res.status(400).json(options.invalidAuthenticationHeaderMessage || 'Invalid authentication header format');
            } else {
                if (tokenMatches[1] === undefined) {
                    consola.error('Token parser failed to extract token from header:', token);
                    return res.status(400).json(options.invalidAuthenticationHeaderMessage || 'Invalid authentication header format');
                }
                const match = tokenMatches[1];
                let isValid = false
                if ('verifyTokenFn' in options) {
                    isValid = await options.verifyTokenFn(match);
                }
                else if (typeof options.token === 'string' || (Array.isArray(options.token) && options.token.length === 1)) {
                    const tokens = Array.isArray(options.token) ? options.token : [options.token];
                    isValid = tokens.some(t => timingSafeCompare(t, match));
                }

                if (!isValid) {
                    return res.status(401).json(options.invalidTokenMessage || 'Invalid token');
                } 
            }

            await Promise.resolve(next());
        }
    }
}