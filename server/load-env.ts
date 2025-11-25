// Simple .env loader for ESM
import { readFileSync } from 'fs';
import { resolve } from 'path';

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
} catch (error) {
    console.warn('.env file not found or could not be read');
}
