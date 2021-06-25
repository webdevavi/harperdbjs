import { HarperDB } from "../../src"
import mockAxios from "jest-mock-axios"

const url = "/my/url"
const username = "username"
const password = "password"

afterEach(mockAxios.reset)

const harperDb = new HarperDB({ url, username, password })
const schema = "dev"

describe("create schema", () => {
  it("should call axios with correct data", () => {
    const data = JSON.stringify({
      operation: "create_schema",
      schema,
    })

    const headers = {
      Authorization: `Basic ${Buffer.from(username + ":" + password).toString("base64")}`,
      "Content-Type": "application/json",
    }

    harperDb.createSchema(schema)

    expect(mockAxios.post).toHaveBeenCalledWith(url, { data }, { headers })
  })

  it("should return response from harperdb", async () => {
    const promise = harperDb.createSchema(schema)

    const message = `schema '${schema}' successfully created`

    const response = { data: { message } }
    mockAxios.mockResponse(response)

    const result = await promise

    expect(result).toBe(message)
  })
})

describe("drop schema", () => {
  it("should call axios with correct data", () => {
    const data = JSON.stringify({
      operation: "drop_schema",
      schema,
    })

    const headers = {
      Authorization: `Basic ${Buffer.from(username + ":" + password).toString("base64")}`,
      "Content-Type": "application/json",
    }

    harperDb.dropSchema(schema)

    expect(mockAxios.post).toHaveBeenCalledWith(url, { data }, { headers })
  })

  it("should return response from harperdb", async () => {
    const promise = harperDb.dropSchema(schema)

    const message = `successfully deleted schema '${schema}'`

    const response = { data: { message } }
    mockAxios.mockResponse(response)

    const result = await promise

    expect(result).toBe(message)
  })
})
