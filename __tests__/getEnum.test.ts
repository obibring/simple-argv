import { describe, expect, it } from "vitest"

import { getEnum } from "../src/getEnum"

describe("getEnum", () => {
  describe("when receiving multiple keys", () => {
    it("should return undefined if value doesn't match requirements and is optional", () => {
      const value = getEnum(["--hey", "-h"], ["a", "b"], "optional", [
        "--hey=c",
        "b",
      ])
      expect(value).toBe(undefined)
    })
    it("should throw if value doesn't match requirements and is required", () => {
      const value = () =>
        getEnum(["--hey", "-h"], ["a", "b"], "required", ["--hey=c", "b"])
      expect(value).toThrow()
    })
    it("should throw if not found and required", () => {
      const value = () =>
        getEnum(["--hey", "-h"], ["a", "b"], "required", ["a", "b"])
      expect(value).toThrow()
    })
    it("should return undefined if not found and optional", () => {
      const value = getEnum(["--hey", "-h"], ["a", "b"], "optional", ["a", "b"])
      expect(value).toBe(undefined)
    })
    it("should throw if an arg doesn't start with '-'", () => {
      expect(() =>
        getEnum(["hey", "-h"], ["a", "b"], undefined, ["a", "b"]),
      ).toThrow()
    })
    it("should skip keys when the following value also starts with a '-' or '--'", () => {
      const argv = ["node", "something", "--k", "-c", "d", "--key", "b"]
      const value = getEnum(["--key", "-k"], ["a", "b"], undefined, argv)
      expect(value).toBe("b")
    })
    it("should return the value separated by ' '", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key", "a"]
      const value = getEnum(["--key", "-k"], ["a", "b"], undefined, argv)
      expect(value).toBe("a")
    })
    it("should return the value separated by '='", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key=b"]
      const value = getEnum(["--key", "-k"], ["a", "b"], undefined, argv)
      expect(value).toBe("b")
    })
  })
  describe("when receiving a single key", () => {
    it("should throw if not found and required", () => {
      const value = () => getEnum("--hey", ["a", "b"], "required", ["a", "b"])
      expect(value).toThrow()
    })
    it("should return undefined if not found and optional", () => {
      const value = getEnum("--hey", ["a", "b"], "optional", ["a", "b"])
      expect(value).toBe(undefined)
    })
    it("should throw if an arg doesn't start with '-'", () => {
      expect(() => getEnum("hey", ["a", "b"], undefined, ["a", "b"])).toThrow()
    })
    it("should skip keys when the following value also starts with a '-' or '--'", () => {
      const argv = ["node", "something", "--k", "-c", "d", "--key", "b"]
      const value = getEnum("--key", ["a", "b"], undefined, argv)
      expect(value).toBe("b")
    })
    it("should return the value separated by ' '", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key", "a"]
      const value = getEnum("--key", ["a", "b"], undefined, argv)
      expect(value).toBe("a")
    })
    it("should return the value separated by '='", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key=b"]
      const value = getEnum("--key", ["a", "b"], undefined, argv)
      expect(value).toBe("b")
    })
  })
})
