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

  describe("get auth", () => {
    it("should return the url, username and password.", () => {
      const expected = { url, username, password }

      expect(harperDb.auth).toStrictEqual(expected)
    })
  })
})
