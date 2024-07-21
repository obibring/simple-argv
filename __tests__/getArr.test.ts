import { describe, expect, it } from "vitest"

import { getArr } from "../src/getArr"

describe("getArr", () => {
  describe("when receiving an array of key", () => {
    it("should throw if not found and required", () => {
      const value = () => getArr(["--hey"], "required", "", ["a", "b"])
      expect(value).toThrow()
    })
    it("should return undefined if not found and optional", () => {
      const value = getArr(["--hey"], "optional", "", ["a", "b"])
      expect(value).toBe(undefined)
    })
    it("should throw if an arg doesn't start with '-'", () => {
      expect(() => getArr("hey", undefined, "", ["a", "b"])).toThrow()
    })
    it("should skip keys when the following value also starts with a '-' or '--'", () => {
      const argv = ["node", "something", "--k", "-c", "d", "--key", "value"]
      const value = getArr(["--key"], undefined, "", argv)
      expect(value).toMatchObject(["value"])
    })
    it("should return the value separated by ' '", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key", "value"]
      const value = getArr(["--key"], undefined, "", argv)
      expect(value).toMatchObject(["value"])
    })
    it("should return the value separated by '='", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key=value"]
      const value = getArr(["--key"], undefined, "", argv)
      expect(value).toMatchObject(["value"])
    })
  })
  describe("when receiving a single key", () => {
    it("should throw if not found and required", () => {
      const value = () => getArr("--hey", "required", "", ["a", "b"])
      expect(value).toThrow()
    })
    it("should return undefined if not found an doptional", () => {
      const value = getArr("--hey", "optional", "", ["a", "b"])
      expect(value).toBe(undefined)
    })
    it("should throw if an arg doesn't start with '-'", () => {
      expect(() => getArr("hey", undefined, "", ["a", "b"])).toThrow()
    })
    it("should skip keys when the following value also starts with a '-' or '--'", () => {
      const argv = ["node", "something", "--key", "-c", "d", "--key", "value"]
      const value = getArr("--key", undefined, "", argv)
      expect(value).toMatchObject(["value"])
    })
    it("should return the value separated by ' '", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key", "value"]
      const value = getArr("--key", undefined, "", argv)
      expect(value).toMatchObject(["value"])
    })
    it("should return the value separated by '='", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key=value"]
      const value = getArr("--key", undefined, "", argv)
      expect(value).toMatchObject(["value"])
    })
    // Multiple values
    it("should combine repeated keys", () => {
      const argv = [
        "node",
        "something",
        "--key",
        `"1,2,3"`,
        "k=v",
        "c",
        "d",
        '--key="a,b,c,d"',
      ]
      const value = getArr("--key", undefined, "", argv)
      expect(value).toMatchObject(["1", "2", "3", "a", "b", "c", "d"])
    })
    it("should separate comma separated values wrapped in quotes", () => {
      const argv = ["node", "something", "k=v", "c", "d", '--key="a,b,c,d"']
      const value = getArr("--key", undefined, "", argv)
      expect(value).toMatchObject(["a", "b", "c", "d"])
    })
  })
})
