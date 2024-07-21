import { describe, expect, it } from "vitest"

import { getNum } from "../src/getNum"

describe("getNum", () => {
  describe("when receiving an array of key", () => {
    it("should throw if not found and required", () => {
      const value = () => getNum(["--hey"], "required", "", ["a", "b"])
      expect(value).toThrow()
    })
    it("should return undefined if not found and optional", () => {
      const value = getNum(["--hey"], "optional", "", ["a", "b"])
      expect(value).toBe(undefined)
    })
    it("should throw if an arg doesn't start with '-'", () => {
      expect(() => getNum("hey", undefined, "", ["a", "b"])).toThrow()
    })
    it("should skip keys when the following value also starts with a '-' or '--'", () => {
      const argv = ["node", "something", "--k", "-c", "d", "--key", "123"]
      const value = getNum(["--key"], undefined, "", argv)
      expect(value).toBe(123)
    })
    it("should return the value separated by ' '", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key", "123"]
      const value = getNum(["--key"], undefined, "", argv)
      expect(value).toBe(123)
    })
    it("should return the value separated by '='", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key=123"]
      const value = getNum(["--key"], undefined, "", argv)
      expect(value).toBe(123)
    })
  })
  describe("when receiving a single key", () => {
    it("should throw if not found and required", () => {
      const value = () => getNum("--hey", "required", "", ["2", "1"])
      expect(value).toThrow()
    })
    it("should return undefined if not found and optional", () => {
      const value = getNum("--hey", "optional", "", ["1", "2"])
      expect(value).toBe(undefined)
    })
    it("should throw if an arg doesn't start with '-'", () => {
      expect(() => getNum("hey", undefined, "", ["a", "b"])).toThrow()
    })
    it("should skip keys when the following value also starts with a '-' or '--'", () => {
      const argv = ["node", "something", "--k", "-c", "d", "--key", "123"]
      const value = getNum("--key", undefined, "", argv)
      expect(value).toBe(123)
    })
    it("should return undefined when optional and key matches an invalid number", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key=test"]
      const value = getNum("--key", undefined, "", argv)
      expect(value).toBe(undefined)
    })
    it("should return negative fractional values separated by '='", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key=-123.55"]
      const value = getNum("--key", undefined, "", argv)
      expect(value).toBe(-123.55)
    })
    it("should return negative fractional values separated by ' '", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key", "-123.55"]
      const value = getNum("--key", undefined, "", argv)
      expect(value).toBe(-123.55)
    })
    it("should return fractional values separated by '='", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key=123.55"]
      const value = getNum("--key", undefined, "", argv)
      expect(value).toBe(123.55)
    })
    it("should return fractional values separated by ' '", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key", "123.55"]
      const value = getNum("--key", undefined, "", argv)
      expect(value).toBe(123.55)
    })
    it("should return the value separated by ' '", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key", "123"]
      const value = getNum("--key", undefined, "", argv)
      expect(value).toBe(123)
    })
    it("should return the value separated by '='", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key=123"]
      const value = getNum("--key", undefined, "", argv)
      expect(value).toBe(123)
    })
    it("should return negative numbers separated by ' '", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key", "-123"]
      const value = getNum("--key", undefined, "", argv)
      expect(value).toBe(-123)
    })
    it("should return negative numbers separated by '='", () => {
      const argv = ["node", "something", "k=v", "c", "d", "--key=-123"]
      const value = getNum("--key", undefined, "", argv)
      expect(value).toBe(-123)
    })
  })
})
