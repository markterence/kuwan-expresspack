
interface ExpresspackConfig extends Record<string, any> {
    features?: {
        /**
         * Enable or disable the authentication feature.
         */
        auth: boolean;
    }
}

export const DEFAULT_EXPRESSPACK_CONFIG: ExpresspackConfig = {
    features: {
        auth: true
    }
}
export function defineConfig(config?: ExpresspackConfig) {
    return {
        ...DEFAULT_EXPRESSPACK_CONFIG,
        ...config
    };
}