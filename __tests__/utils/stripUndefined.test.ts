import { stripUndefined } from "../../src/utils"

describe("stripUndefined", () => {
  it("should remove undefined values from an object", () => {
    const object = {
      name: "jane doe",
      age: 28,
      location: undefined,
      email: "jane@doe.com",
      contact: undefined,
    }

    const expectedObject = {
      name: "jane doe",
      age: 28,
      email: "jane@doe.com",
    }

    expect(stripUndefined(object)).toStrictEqual(expectedObject)
  })

  it("should not remove falsy values other than undefined", () => {
    const object = {
      name: "jane doe",
      age: 28,
      location: undefined,
      email: "jane@doe.com",
      contact: null,
      friends: [],
      experience: 0,
    }

    const expectedObject = {
      name: "jane doe",
      age: 28,
      email: "jane@doe.com",
      contact: null,
      friends: [],
      experience: 0,
    }

    expect(stripUndefined(object)).toStrictEqual(expectedObject)
  })
})
