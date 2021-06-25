import { HarperDB } from "../../src"
import mockAxios from "jest-mock-axios"

const url = "/my/url"
const username = "username"
const password = "password"

afterEach(mockAxios.reset)

const harperDb = new HarperDB({ url, username, password })
const schema = "dev"
const table = "test"
const hashAttribute = "id"

const params = { schema, table, hashAttribute }

describe("create table", () => {
  it("should call axios with correct data", () => {
    const data = JSON.stringify({
      operation: "create_table",
      schema,
      table,
      hash_attribute: hashAttribute,
    })

    const headers = {
      Authorization: `Basic ${Buffer.from(username + ":" + password).toString("base64")}`,
      "Content-Type": "application/json",
    }

    harperDb.createTable(params)

    expect(mockAxios.post).toHaveBeenCalledWith(url, { data }, { headers })
  })

  it("should return response message and 200 status on success", async () => {
    const promise = harperDb.createTable(params)

    const message = `table '${table}' successfully created.`

    const response = { data: { message }, status: 200 }
    mockAxios.mockResponse(response)

    const result = await promise

    expect(result.status).toBe(200)
    expect(result.message).toBe(message)
  })

  it("should return response error and status other than 200 on failure", async () => {
    const promise = harperDb.createTable(params)

    const error = `table '${table}' already exists`

    const response = { data: { error }, status: 500 }
    mockAxios.mockResponse(response)

    const result = await promise

    expect(result.status).not.toBe(200)
    expect(result.error).toBe(error)
  })
})
