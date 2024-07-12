import { describe, expect, it } from "vitest"

import { getBool } from "../src/getBool"

describe("getBool", () => {
  describe("when receiving an array of key", () => {
    it("should return true if any of them exist", () => {
      expect(getBool(["--a", "--b", "-c"], ["hello", "world", "-c"])).toBe(true)
    })
    it("should return false if none of them exist", () => {
      expect(getBool(["--a", "--b", "-c"], ["hello", "world", "c"])).toBe(false)
    })
  })
  describe("when receiving a single key", () => {
    it("should return true if it exists", () => {
      expect(getBool("--a", ["hello", "world", "--a"])).toBe(true)
    })
    it("should return false if it doesn't exist", () => {
      expect(getBool("--a", ["hello", "world", "-a"])).toBe(false)
    })
  })
})
