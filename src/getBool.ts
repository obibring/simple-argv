import { assertValidKeys } from "./_utils"

/**
 * Checks for the existence of a CLI argument and returns a boolean indicating whether
 * it was found.
 *
 * @param argNameOrNames Either a string or array of strings representing the named parameter
 * passed via to argv, ie: `["--name", "-n"]` or `"--name"`, or an index. If an array is
 * passed, then an arg that matches any of the names will satisfy the requirement.
 * @param argv The list of args to process, defaults to process.argv.
 *
 * @returns boolean Whether one of the values in `argv` were identical to one of the
 * key or keys provided.
 */
export function getBool(
  argNameOrNames: string | string[],
  argv: ReadonlyArray<string> = process.argv,
): boolean {
  const names = Array.isArray(argNameOrNames)
    ? argNameOrNames
    : [argNameOrNames]
  assertValidKeys("getBool()", names)
  return argv.some((value) => names.some((key) => key === value))
}
