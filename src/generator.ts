import Groq from 'groq-sdk';
import 'dotenv/config'
import { extractCodeBlock, generateHash, loadFunction } from './utils';
import { store } from './storage';
import ts from 'typescript';

const SYSTEM_PROMPT = `You are a TypeScript function generator. Strict rules:
- Exactly one function with export default
- Strict typing for all parameters and the return type
- Must always return a value
- Include a JSDoc comment with a description
- Pure function, no side effects
- Only code, with a brief explanation
- No imports (only built-in TypeScript types)
- If the user request does not explicitly specify arguments, the function must not accept any parameters and should simply return the result
- Follow the user's instructions strictly`;

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export function compileTs(code: string): string {
    const result = ts.transpileModule(code, {
        compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2020,
            strict: true
        }
    });

    return result.outputText;
}

export async function generate(prompt: string) {
    const result = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt }
        ],
        temperature: 0,
        max_completion_tokens: 1024
    })

    const content = result.choices[0]?.message?.content || '';
    const code = extractCodeBlock(content);
    const fileName = generateHash(prompt);

    const filePath = await store.createFunction(fileName, compileTs(code))

    return await loadFunction(filePath)
}