import { toSnakeCaseKeys } from "../../src/utils"

describe("toSnakeCaseKeys", () => {
  it("should transform the keys of object into snake case", () => {
    const object = {
      schema: "dev",
      table: "test",
      hashAttribute: "id",
    }

    const expectedObject = {
      schema: "dev",
      table: "test",
      hash_attribute: "id",
    }

    const result = toSnakeCaseKeys(object)

    expect(result).toStrictEqual(expectedObject)
  })
})
