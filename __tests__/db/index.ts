require("dotenv").config()

import { HarperDB } from "../../src"

const url = process.env["DB_URL"] ?? ""
const username = process.env["DB_USERNAME"] ?? ""
const password = process.env["DB_PASSWORD"] ?? ""

describe("HarperDB class", () => {
  const harperDb = new HarperDB({
    url,
    username,
    password,
  })

  it("should be initialized without any error", () => {
    expect(harperDb).toBeInstanceOf(HarperDB)
  })

  it("should throw error if no token or username & password provided", () => {
    const fn = () => new HarperDB({ url })

    expect(fn).toThrowError("Either a set of username and password or a token is required to authenticate with HarperDB.")
  })

  it("should throw error if only username or only password is provided", () => {
    const fn = () => new HarperDB({ url, username })

    expect(fn).toThrowError("Both username and password are required to authenticate with HarperDB.")
  })

  it("should use the token if provided instead of username and password", () => {
    const harperDB = new HarperDB({ url, token: "some_token" })

    expect(harperDB.generatedToken).toBe("some_token")
  })

  describe("get auth", () => {
    it("should return the url, username and password.", () => {
      const expected = { url, username, password }

      expect(harperDb.auth).toStrictEqual(expected)
    })

    it("should return url and token if token provided instead of username and password", () => {
      const expected = { url, token: "some_token" }

      expect(new HarperDB(expected).auth).toStrictEqual(expected)
    })
  })
})
