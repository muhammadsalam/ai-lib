import Groq from 'groq-sdk';
import 'dotenv/config'
import { checkIsFunctionExists, extractCodeBlock, generateHash, loadFunction } from './utils';
import { store } from './storage';
import ts from 'typescript';
import path from 'path';

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
    const hash = generateHash(prompt);
    const fileName = hash + '.js';
    let filePath: string;

    if (await checkIsFunctionExists(hash)) {
        filePath = path.join(process.cwd(), 'generated', fileName);

        return await loadFunction(filePath);
    }

    console.log('загрузка нового скрипта')
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

    filePath = await store.createFunction(fileName, compileTs(code))

    return await loadFunction(filePath)
}

// (async () => {
//     const button = await generate("function that returns HTML markup as a string with a styled button in a template literal (w:240; h:56; fsz24; text: Auth, green color)");
//     console.log(button())

//     const command2 = await generate("return all numbers from arguments");
//     console.log(command2(1, 2, 3, 'asd', 54))
// })()

function main() {
    const program = ts.createProgram({
        rootNames: [path.join(process.cwd(), '/generated/test.ts')],
        options: {
            module: ts.ModuleKind.NodeNext,
            target: ts.ScriptTarget.ES2020,
            strict: true,
            noImplicitAny: true,
            strictNullChecks: true,
            exactOptionalPropertyTypes: true,
            noUncheckedIndexedAccess: true,
            declaration: true,
            outDir: './generated'
        }
    })

    const code = 'export default function getStyledButton(): { a: string } {return `<button style="width: 240px;height: 56px;font-size: 24px;background-color: #008000;color: #ffffff;border: none;border-radius: 5px;cursor: pointer;">Auth</button>`;}'

    const sourceFile = ts.createSourceFile('test.ts', code, ts.ScriptTarget.ES2020)

    // const diagnostic = program.getSemanticDiagnostics().concat(program.getSyntacticDiagnostics());

    // if(diagnostic.length == 0) {
    //     const emit = program.emit();
    // }

    // const diagnostics = ts.getPreEmitDiagnostics(program).concat(emit.diagnostics);
    console.log(sourceFile);

}

main()