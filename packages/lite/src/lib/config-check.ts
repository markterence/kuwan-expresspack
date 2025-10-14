/**
 * key should be camelCase of the topic
 */
const configList = {

};

/**
 * Checks if the loaded config matches the expected signature
 * This is applicable for certain config that require a specific structure.
 * Not all config are required to be verified.
 * So we maintain a list of topics that require verification.
 */
export function verifyConfigSignature(fn: unknown, topic: string, configPath: string): void {
    const config = configList[topic] as ((fn: unknown, configPath: string) => { isCorrect: (fn: unknown) => void }) | undefined;

    if (!config) { 
        return;
    }
   
    const { isCorrect } = config(fn, configPath);

    isCorrect(fn);
}
