import { assertValidKeys, isNamedCLIArg, quoteWrapAndJoin } from "./_utils"

/**
 * Parses `argv` for the first value matching one of the provided names. Values can take
 * the form `--key=value` | `-key=value` | `-k value` or `--key value`.
 *
 * ### `Example - parse a single named arg`
 * ```ts
 * import { getStr } from "@obibring/node-args"
 *
 * const required_name = getStr("--name", "required") // Throws if --name not provided
 * const optional_name = getStr("--name") // Returns string or undefined.
 * const optional_name_2 = getStr("--name", "optional") // For clarity.
 * ```
 * ### `Example - parse one of several named args`
 * ```ts
 * import { getStr } from "@obibring/node-args"
 *
 * const arg_names =
 *   // The function will return the first named arg found from the list
 *   // below that points to a valid value. A valid value is any string
 *   // that doesn't begin with a '-'.
 *
 *
 * const required_name = getStr(["--name", "-n"], "required") // may throw
 * const optional_name = getStr(["--name", "-n"])
 * const optional_name_2 = getStr(["--name", "-n"], "optional") // same as above
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
export function getStr(
  argNameOrNames: string | string[],
  required?: undefined | "optional",
  description?: string,
  argv?: ReadonlyArray<string>,
): string | undefined
export function getStr(
  argNameOrNames: string | string[],
  required: "required",
  description?: string,
  argv?: ReadonlyArray<string>,
): string
export function getStr(
  argNameOrNames: string | string[],
  required?: "required" | "optional" | undefined,
  description?: string,
  argv?: ReadonlyArray<string>,
): undefined | string
export function getStr(
  argNameOrNames: string | string[],
  required?: undefined | "required" | "optional",
  description?: string,
  _argv: ReadonlyArray<string> = process.argv,
): string | undefined {
  let argv = [..._argv]
  const names = Array.isArray(argNameOrNames)
    ? argNameOrNames
    : [argNameOrNames]
  assertValidKeys("getStr()", names)
  for (const name of names) {
    let index = argv.findIndex((value) => value.startsWith(name))
    while (index > -1) {
      let value = argv[index]
      if (value) {
        // We found a matching index.
        // First, check for `key=value` syntax
        if (value.includes("=")) {
          // We found a string of shape param=value
          const [, extractedValue] = value.split("=")
          return extractedValue
        } else if (value === name) {
          // We need to check the next argument in the array, making sure that it isn't
          // another param.
          value = argv[index + 1]
          if (!isNamedCLIArg(value) && typeof value === "string") {
            return value
          }
        }
      }
      argv = argv.slice(index + 1)
      index = argv.findIndex((value) => value.startsWith(name))
    }
  }
  // ! We didn't return a value, so throw or return undefined
  if (required === "required") {
    const msg =
      typeof argNameOrNames === "string"
        ? `Expected command line argument "${argNameOrNames}", but it wasn't set. ${description}`
        : `Expected one of the following command line arguments, but none were provided: ${quoteWrapAndJoin(
            argNameOrNames,
          )}. ${description}`
    throw new Error(msg)
  }
  return undefined
}
