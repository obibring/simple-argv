import { assertValidKeys, quoteWrapAndJoin } from "./_utils"
import { getStr } from "./getStr"

/**
 * Checks the process arguments for a value matching one of the provided
 * string literals.
 *
 * ### `Example`
 *
 * ```ts
 * import { getEnum } from "@obibring/node-args"
 *
 * // The --name CLI arg is required and must match either "bob", "bill" or "ben".
 * // If the arg doesn't exist or it doesn't exactly match "bob", "bill", or "ben",
 * // the function will throw.
 * const value = getEnum("--name", ["bob", "bill", "ben"], "required");
 *
 * // The --name CLI arg is optional, but must match either "bob", "bill" or "ben".
 * const optional_value = getEnum("--name", ["bob", "bill", "ben"]);

 * console.log(value) // "bob" | "bill" | "ben"
 * console.log(optional_value) // undefined | "bob" | "bill" | "ben"
 * ```
 */
export function getEnum<T extends string>(
  argNameOrNames: string | string[],
  allowedValues: ReadonlyArray<T>,
  onError?: undefined | "optional",
  description?: string,
  argv?: ReadonlyArray<string>,
): T | undefined
export function getEnum<T extends string>(
  argNameOrNames: string | string[],
  allowedValues: ReadonlyArray<T>,
  onError: "required",
  description?: string,
  argv?: ReadonlyArray<string>,
): T
export function getEnum<T extends string>(
  argNameOrNames: string | string[],
  allowedValues: ReadonlyArray<T>,
  onError?: "required" | undefined | "optional",
  description?: string,
  argv?: ReadonlyArray<string>,
): undefined | T
export function getEnum<T extends string>(
  argNameOrNames: string | string[],
  allowedValues: ReadonlyArray<T>,
  onError?: "required" | undefined | "optional",
  description?: string,
  argv: ReadonlyArray<string> = process.argv,
): T | undefined {
  const names = Array.isArray(argNameOrNames)
    ? argNameOrNames
    : [argNameOrNames]
  assertValidKeys("getEnum()", names)
  const value = getStr(argNameOrNames, onError, description, argv)
  const isAllowedValue = (value: string): value is T => {
    return allowedValues.includes(value as T)
  }
  if (typeof value === "string") {
    if (isAllowedValue(value)) {
      return value
    } else if (onError === "required") {
      const msg =
        typeof argNameOrNames === "string"
          ? `Expected CLI argument "${argNameOrNames}" to be one of: ${quoteWrapAndJoin(
              allowedValues,
            )}, but got: "${value}". ${description}`
          : `Expected CLI argument matching ${quoteWrapAndJoin(
              argNameOrNames,
            )}. ${description}`
      throw new Error(msg)
    }
  }
  return undefined
}
