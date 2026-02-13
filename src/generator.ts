import Groq from 'groq-sdk';
import 'dotenv/config'
import fs from 'fs-extra';
import path from 'path';
import { extractCodeBlock, getFunctionName, loadFunction } from './utils';
import { store } from './storage';
import ts from 'typescript';

const SYSTEM_PROMPT = `Ты генератор TypeScript функций. Строгие правила:
- Одна функция с export default
- Строгая типизация всех параметров и return type
- Обязательно возвращает значение
- JSDoc комментарий с описанием
- Pure функция, без side-effects
- Только код, с небольшим объяснением
- Никаких импортов (только встроенные типы TS)
- Если в пользовательском запросе нет явных аргументов — функция не должна принимать параметры, просто возвращает результат
- Следуй строго за инструкциями пользователя`;

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
    const fileName = getFunctionName(code)

    const filePath = await store.createFunction(fileName, compileTs(code))

    return await loadFunction(filePath)
}

// (async () => {
//     const command = await generate('перемножить все числа с массива в аргументе и вернуть результат');
//     console.log(command([2, 1, 2, 3]))
// })()