import { describe, expect, it } from "vitest"

import { getStr } from "../src/getStr"

describe("getStr", () => {
  describe("when receiving an array of key", () => {
    it("should throw if not found and required", () => {
      const value = () => getStr(["--hey"], "required", ["a", "b"])
      expect(value).toThrow()
    })
    it("should return undefined if not found an doptional", () => {
      const value = getStr(["--hey"], "optional", ["a", "b"])
      expect(value).toBe(undefined)
    })
    it("should throw if an arg doesn't start with '-'", () => {
      expect(() => getStr("hey", undefined, ["a", "b"])).toThrow()
    })
    it("should skip keys when the following value also starts with a '-' or '--'", () => {
      const argv = ["node", "something", "--k", "-c", "d", "--key", "value"]
      const value = getStr(["--key"], undefined, argv)
      expect(value).toBe("value")
    })
    it("should return the value separated by ' '", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key", "value"]
      const value = getStr(["--key"], undefined, argv)
      expect(value).toBe("value")
    })
    it("should return the value separated by '='", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key=value"]
      const value = getStr(["--key"], undefined, argv)
      expect(value).toBe("value")
    })
  })
  describe("when receiving a single key", () => {
    it("should throw if not found and required", () => {
      const value = () => getStr("--hey", "required", ["a", "b"])
      expect(value).toThrow()
    })
    it("should return undefined if not found an doptional", () => {
      const value = getStr("--hey", "optional", ["a", "b"])
      expect(value).toBe(undefined)
    })
    it("should throw if an arg doesn't start with '-'", () => {
      expect(() => getStr("hey", undefined, ["a", "b"])).toThrow()
    })
    it("should skip keys when the following value also starts with a '-' or '--'", () => {
      const argv = ["node", "something", "--key", "-c", "d", "--key", "value"]
      const value = getStr("--key", undefined, argv)
      expect(value).toBe("value")
    })
    it("should return the value separated by ' '", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key", "value"]
      const value = getStr("--key", undefined, argv)
      expect(value).toBe("value")
    })
    it("should return the value separated by '='", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key=value"]
      const value = getStr("--key", undefined, argv)
      expect(value).toBe("value")
    })
  })
})
