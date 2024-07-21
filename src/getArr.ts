import { assertValidKeys, isNamedCLIArg, quoteWrapAndJoin } from "./_utils"

/**
 * ie: --key "hey,there,bob" -> ["hey", "there", "bob"]
 */
function parseMaybeQuoteWrappedValue(argValue: string): string[] {
  if (argValue.startsWith(`"`) && argValue.endsWith(`"`)) {
    argValue = argValue.replace(/^"/, "").replace(/"$/, "")
    return argValue.split(",")
  }
  return [argValue]
}
/**
 * Parses `argv` for all values provided name. Values can take
 * the form `--key=value` | `-key=value` | `-k value` or `--key value`. Furthermore,
 * a comma separated string wrapped in quotes can be used to provide all values at once.
 *
 * ### `Example - parse an array of args`
 * ```ts
 * import { getArr } from "@obibring/node-args"
 *
 * const required_name = getArr("--name", "required") // Throws if --name not provided
 * const optional_name = getArr("--name") // Returns string or undefined.
 * const optional_name_2 = getArr("--name", "optional") // For clarity.
 * ```
 * ### `Example - parse one of several named args`
 * ```ts
 * import { getArr } from "@obibring/node-args"
 *
 * const arg_names =
 *   // The function will return the first named arg found from the list
 *   // below that points to a valid value. A valid value is any string
 *   // that doesn't begin with a '-'.
 *
 *
 * const required_name = getArr(["--name", "-n"], "required") // may throw
 * const optional_name = getArr(["--name", "-n"])
 * const optional_name_2 = getArr(["--name", "-n"], "optional") // same as above
 * ```
 *
 * @param argNameOrNames Either a string or array of strings that start with "-" or "--".
 * As an array, the first one found in `argv` will be used.
 * @param required If set to `"required"`, this function will throw if one of the
 * provided names does not exist in `argv`.
 * @param argv {optional} An array of string, defaults to `process.argv`.
 *
 * @returns All values that match one of the provided names. If `required` is
 * set to `"required"`, this function will throw if the argument was not provided.
 */
export function getArr(
  argNameOrNames: string | string[],
  required?: undefined | "optional",
  description?: string,
  argv?: ReadonlyArray<string>,
): string[] | undefined
export function getArr(
  argNameOrNames: string | string[],
  required: "required",
  description?: string,
  argv?: ReadonlyArray<string>,
): [string, ...string[]]
export function getArr(
  argNameOrNames: string | string[],
  required?: "required" | "optional" | undefined,
  description?: string,
  argv?: ReadonlyArray<string>,
): undefined | string[]
export function getArr(
  argNameOrNames: string | string[],
  required?: undefined | "required" | "optional",
  description?: string,
  _argv: ReadonlyArray<string> = process.argv,
): undefined | string[] {
  let argv = [..._argv]
  let values = [] as string[]
  const names = Array.isArray(argNameOrNames)
    ? argNameOrNames
    : [argNameOrNames]
  assertValidKeys("getArr()", names)
  for (const name of names) {
    for (let index = 1; index < argv.length; index += 1) {
      const arg_name = argv[index]
      if (arg_name !== name && !arg_name.startsWith(`${name}=`)) {
        continue
      }
      let value = arg_name === name ? argv[index + 1] : argv[index]
      if (value) {
        // We found a string of shape param=value
        if (arg_name === name) {
          if (!isNamedCLIArg(value) && typeof value === "string") {
            values.push(...parseMaybeQuoteWrappedValue(value))
          }
        } else {
          // We found a matching index.
          // First, check for `key=value` syntax
          const [, extractedValue] = value.split("=")
          values.push(...parseMaybeQuoteWrappedValue(extractedValue))
        }
      }
    }
  }
  // ! We didn't return a value, so throw or return undefined
  if (required === "required" && values.length < 1) {
    const msg =
      typeof argNameOrNames === "string"
        ? `Expected command line argument "${argNameOrNames}", but it wasn't set. ${description}`
        : `Expected one of the following command line arguments, but none were provided: ${quoteWrapAndJoin(
            argNameOrNames,
          )}. ${description}`
    throw new Error(msg)
  }
  return values.length > 0 ? values : undefined
}
