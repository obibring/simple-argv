import { assertValidKeys, quoteWrapAndJoin } from "./_utils"
import { getStr } from "./getStr"

/**
 * Parses `argv` for the first value matching one of the provided names, and attempts
 * parses its value as a valid number. Values can be provided using one of these forms:
 * `--key=value` | `-key=value` | `-k value` or `--key value`.
 *
 * ### `Example - parse a single named arg`
 * ```ts
 * import { getNum } from "@obibring/node-args"
 *
 * const required_age = getNum("--age", "required") // may throw
 * const optional_age = getNum("--age") // Doesn't throw, -> number | undefined.
 * const optional_age_2 = getNum("--age", "optional") // same as above
 * ```
 * ### `Example - parse one of several named args`
 * ```ts
 * import { getNum } from "@obibring/node-args"
 *
 * const required_age = getNum(["--age", "-a"], "required") // may throw
 * const optional_age = getNum(["--age", "-a"]) // doesn't throw, -> number | undefined.
 * const optional_age_2 = getNum(["--age", "-a"], "optional") // same as above
 * ```
 *
 * @param argNameOrNames Either a string or array of strings that start with "-" or "--".
 * As an array, the first one found in `argv` will be used.
 * @param required If set to `"required"`, this function will throw if one of the
 * provided names does not exist in `argv`.
 * @param argv {optional} An array of string, defaults to `process.argv`.
 *
 * @returns The first value that matches one of the provided names. If `required` is
 * set to `"required"`, this functino will throw if the argument was not provided.
 */
export function getNum(
  argNameOrNames: string | string[],
  required?: undefined | "optional",
  description?: string,
  argv?: ReadonlyArray<string>,
): number | undefined
export function getNum(
  argNameOrNames: string | string[],
  required: "required",
  description?: string,
  argv?: ReadonlyArray<string>,
): number
export function getNum(
  argNameOrNames: string | string[],
  required?: "required" | "optional" | undefined,
  description?: string,
  argv?: ReadonlyArray<string>,
): undefined | number
export function getNum(
  argNameOrNames: string | string[],
  required?: undefined | "required" | "optional",
  description?: string,
  argv: ReadonlyArray<string> = process.argv,
): number | undefined {
  const names = Array.isArray(argNameOrNames)
    ? argNameOrNames
    : [argNameOrNames]
  assertValidKeys("getNum()", names)
  const value = getStr(argNameOrNames, required, description, argv)
  if (value) {
    const num = parseFloat(value)
    if (isNaN(num)) {
      if (required === "required") {
        const msg =
          typeof argNameOrNames === "string"
            ? `Expected CLI argument "${argNameOrNames}" to be a valid number, but got: "${value}" ${description}`
            : `Expected CLI argument matching one of ${quoteWrapAndJoin(
                argNameOrNames,
              )} to be a valid number, but got "${value}". ${description}`
        throw new Error(msg)
      }
      return undefined
    }
    return num
  }
  return undefined
}
