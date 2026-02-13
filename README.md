# AI-Lib

## Using

code you see:

```js
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
