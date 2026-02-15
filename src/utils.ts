import crypto from 'node:crypto';
import fs from 'fs';
import path from 'path';

export function generateHash(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
}

export function extractCodeBlock(text: string): string {
    const match = text.match(/```(?:typescript|ts)?\s*([\s\S]*?)```/);

    if (!match) {
        throw new Error('No code block found in LLM response');
    }

    return match[1].trim();
}

export async function loadFunction(filePath: string) {
    const module = await import(`file://${filePath}`);
    return module.default;
}

export async function checkIsFunctionExists(fileHash: string) {
    try {
        await fs.promises.access(path.join(process.cwd(), 'generated', fileHash + '.js'));
        return true;
    } catch (error) {
        return false;
    }
}