import crypto from 'node:crypto';
import ts from 'typescript'

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

export function getFunctionName(code: string): string {
    const source = ts.createSourceFile(
        'temp.ts',
        code,
        ts.ScriptTarget.Latest,
        true
    );

    let name = '';

    source.forEachChild(node => {
        if (ts.isFunctionDeclaration(node) && node.name) {
            name = node.name.text;
        }
    });

    if (!name) {
        throw new Error('No named function found');
    }

    return name;
}

export async function loadFunction(filePath: string) {
    const module = await import(`file://${filePath}`);
    return module.default;
}