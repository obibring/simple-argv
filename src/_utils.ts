export type NamedCLIArg = `-${string}`

export function quoteWrapAndJoin(strings: ReadonlyArray<string>): string {
  return strings
    .filter((s) => typeof s === "string")
    .map((s) => `"${s}"`)
    .join(", ")
}

/**
 * Tests whether the given value is a string starting with '-' or '--'
 */
export function isNamedCLIArg(arg: unknown): arg is NamedCLIArg {
  return typeof arg === "string" && /^--?[a-zA-Z]+/.test(arg)
}
/**
 * Returns true if the named cli arg has a valid value.
 */
export function isValidNamedCLIArg(arg: NamedCLIArg): boolean {
  return !arg.includes("=")
}

export function assertValidKeys(
  method: string,
  keys: string[],
): asserts keys is NamedCLIArg[] {
  keys.forEach((key) => {
    const exit = (): never => {
      const msg = `${method} received an invalid key. Keys must start with '-' or '--', followed by a letter of the alphabet, and can not include an equal sign "=". Got: ${key}`
      throw new Error(msg)
    }
    if (!isNamedCLIArg(key)) {
      exit()
    } else if (!isValidNamedCLIArg(key)) {
      exit()
    }
  })
}
