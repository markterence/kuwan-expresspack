
interface ExpresspackConfig extends Record<string, any> {
    features?: Record<string, any>;
}

export const DEFAULT_EXPRESSPACK_CONFIG: ExpresspackConfig = {
    features: {
    }
}
export function defineConfig(config?: ExpresspackConfig) {
    return {
        ...DEFAULT_EXPRESSPACK_CONFIG,
        ...config
    };
}