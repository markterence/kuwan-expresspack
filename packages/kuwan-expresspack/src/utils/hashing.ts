import { createHash } from 'crypto' 

export function sha256(input: any): string | null {
    let stringInput: string;
    
    if (typeof input === 'string') {
        stringInput = input;
    } else {
        try {
            stringInput = JSON.stringify(input);
        } catch {
            stringInput = String(input);
        }
    }
    
    try {
        // Convert string to ArrayBuffer
        const encoder = new TextEncoder();
        const arrayBuffer = encoder.encode(stringInput);
        
        return createHash('sha256').update(arrayBuffer).digest('hex');
    } catch {
        return null;
    }
}