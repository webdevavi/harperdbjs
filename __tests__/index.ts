import { returnTrue } from "../src"

describe("smoke test", () => {
  it("should be true", () => {
    expect(returnTrue()).toBe(true)
  })
})
