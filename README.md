# `ts-simple-argv`

Simple tools for parsing CLI arguments. Well tested. Works w/ ESM or CommonJS.

## Installation

```sh
npmp install ts-simple-argv
yarn add ts-simple-argv
pnpm add ts-simple-argv
```

## Valid Arg Names
All arg names must start with `-` or `--`, followed by a letter of the alphabet. This requirement is enforced to prevent mistakes.

## API

### `getEnum()`
Returns the first string for one of the provided named arguments that matches an array of candidate strings. The first argument whose name matches one of the provided names will be used match against the array of candidates.
Arguments names must start with `-` or `--`.

```ts
import { getEnum } from "simple-argv";

// Retrieves an optional string argument.
const optional_age = getEnum(["--name"])

console.log(typeof optional_age) // "number" | "undefined"

try {
  // Pass "required" to throw if the value is missing.
  const mandatory_age = getEnum("--age", "required") // might throw

  console.log(typeof mandatory_age) // "number"
} catch {
  // Not a number
}
```

### `getNum()`
Returns the first valid numeric value that matches one of the provided named arguments.
Arguments names must start with `-` or `--`.

```ts
import { getNum } from "simple-argv";

// Retrieves an optional string argument.
const optional_age = getNum("--age" /* or an array ["--age", "-a"] */)

console.log(typeof optional_age) // "number" | "undefined"

try {
  // Pass "required" to throw if the value is missing.
  const mandatory_age = getNum("--age", "required") // might throw

  console.log(typeof mandatory_age) // "number"
} catch {
  // Not a number
}

const decimal_num = getNum("--exchange-rate", "optional", [
  // You don't have to pass this array, it defaults to process.argv, but is
  // used here for demonstration purposes.
  //
  // The string "15.5" will be parsed as a float.
  "--exchange-rate", "15.5"
])

console.log(typeof decimal_num, decimal_num) // "number", 15.5

// Negative numbers also work.
const negative_num = getNum("--acceleration", "optional", [
  // You don't have to pass this array, it defaults to process.argv, but is
  // used here for demonstration purposes.
  //
  // The string "15.5" will be parsed as a float.
  "--exchange-rate", "-155.81"
])

console.log(typeof decimal_num, decimal_num) // "number", -155.81

```

### `getStr()`
Returns the first valid string that matches one of the provided named arguments.
Arguments names must start with `-` or `--`.

```ts
import { getStr } from "simple-argv";

// Retrieves an optional string argument.
const optional_name = getStr("--name" /* or an array ["--name", "-n"] */)

try {
  // Pass "required" to throw if the value is missing.
  const mandatory_name = getStr("--name", "required") // might throw

  console.log(typeof mandatory_name) // "string"
} catch {
  // --name argument not provided as a valid string.
}
```

### `getBool()`
Returns true if one of several named cli argument exists. Expects arguments to __NOT__ contain values. The following cli argument will not return true: `my_program --my-string-arg=hey`. To determine whether a string param was received, use `typeof getStr("--my-string-arg") === "string"`.

Arguments names must start with `-` or `--`.

```ts
import { getBool } from "simple-argv";

// Pass an arra of argument names, if any of them match, `true` is returned.
const isProduction = getBool(["--production", "--prod", "-p"])

// Pass a single argument name, `true` is returned if it was set.
const isProduction = getBool("--production")

```

### `getArr()`
Returns an array of all arguments matching the given argument names. Values wrapped in quotes are split by commas and combined with all other occurrences of the matching keys, then returned as an array of strings. When `required` is set to true, the array will always contain at least one element.
Arguments names must start with `-` or `--`.

```ts
import { getArr } from "simple-argv";

// Retrieves an optional string argument.
const optional_name = getStr("--name" /* or an array ["--name", "-n"] */)

try {
  // Pass "required" to throw if the value is missing.
  const mandatory_names = getArr("--name", "required") // might throw

  console.log(mandatory_names) // ["bob"]
} catch {
  // --name argument not provided as a valid string.
}
```

## Getting Started

1. Clone the repo `git clone git@github.com:obibring/tsdx-boilerplate.git`
3. Rename references to `tsdx-boilerplate` from `package.json`.
4. Create the entrypoint file: `src/<your package name>.ts`. __NOTE__: Before this is done, the `build` script will fail since `src/index.ts` is ignored from the build because it is handled by `tsdx`.
5. You're done.
