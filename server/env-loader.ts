// env-loader.ts - Load environment variables synchronously before anything else
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

try {
    const envFile = readFileSync(resolve(process.cwd(), '.env'), 'utf-8');
    envFile.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...valueParts] = trimmed.split('=');
            if (key) {
                process.env[key.trim()] = valueParts.join('=').trim();
            }
        }
    });
    console.log('✓ Environment variables loaded from .env');
} catch (error) {
    console.warn('⚠ .env file not found, using system environment variables');
}

// Export a dummy value to make this a module
export const envLoaded = true;
