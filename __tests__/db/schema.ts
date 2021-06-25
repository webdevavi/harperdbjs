import { HarperDB } from "../../src"
import mockAxios from "jest-mock-axios"

const url = "/my/url"
const username = "username"
const password = "password"

afterEach(mockAxios.reset)

describe("create schema", () => {
  const harperDb = new HarperDB({ url, username, password })
  const schema = "dev"

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

  it("should return true if success", async () => {
    const promise = harperDb.createSchema(schema)

    const response = { data: { message: `Schema '${schema}' created successfully` } }
    mockAxios.mockResponse(response)

    const result = await promise

    expect(result).toBe(true)
  })

  it("should return false if not success", async () => {
    const promise = harperDb.createSchema(schema)

    const response = { data: { message: `Schema '${schema}' not created successfully` } }
    mockAxios.mockResponse(response)

    const result = await promise

    expect(result).toBe(false)
  })
})
