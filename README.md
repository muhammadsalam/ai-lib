# @axvaich/ai-lib

AI-powered TypeScript function generator with strict typing and zero side effects.

## Installation

```bash
npm install @axvaich/ai-lib
```

Create a `.env` file by copying `.env.example`:

```bash
cp .env.example .env
```

Then set your GROQ API key from [console.groq.com/keys](https://console.groq.com/keys):

```env
GROQ_API_KEY=your_api_key_here
```

## Using

### example 1

code you see:

```js
import { generate } from "@axvaich/ai-lib";

async function main() {
    const command2 = await generate("return all numbers from arguments");
    console.log(command2(1, 2, 3, "asd", 54));
}

main(); // output [ 1, 2, 3, 54 ]
```

generated code:

```js
/**
 * Returns all numbers from the given arguments.
 *
 * @param args A variable number of arguments of any type.
 * @returns An array of numbers.
 */
export default function getNumbers(...args) {
    return args.filter((arg) => typeof arg === "number");
}
```

### example 2

code you see:

```js
import { generate } from "@axvaich/ai-lib";

async function main() {
    const button = await generate(
        "function that returns HTML markup as a string with a styled button in a template literal",
    );
    console.log(button());
}

main();
```

generated code:

```js
/**
 * Returns HTML markup as a string with a styled button.
 *
 * @returns {string} The HTML markup with a styled button.
 */
export default function getStyledButton() {
    return `
        <button style="background-color: #4CAF50; color: #fff; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
            Click me
        </button>
    `;
}
```

## Performance

Functions are cached by prompt hash. Existing functions are reused without additional API requests.
