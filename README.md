# @axvaich/ai-lib

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

const command = await generate("multiple all numbers in array and return it");
console.log(command([2, 1, 2, 3]));
```

generated code:

```js
/**
 * Перемножает все числа в массиве и возвращает результат.
 *
 * @param {number[]} numbers - Массив чисел для перемножения.
 * @returns {number} Результат перемножения всех чисел в массиве.
 */
export default function multiplyNumbers(numbers) {
    return numbers.reduce((acc, current) => acc * current, 1);
}
```

### example 2

code you see:

```js
const command2 = await generate("return all numbers from arguments");
console.log(command2(1, 2, 3, 54));
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
