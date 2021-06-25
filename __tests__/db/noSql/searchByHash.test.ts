import { HarperDB } from "../../../src"
import mockAxios from "jest-mock-axios"

const url = "/my/url"
const username = "username"
const password = "password"

afterEach(mockAxios.reset)

const harperDb = new HarperDB({ url, username, password })
const schema = "dev"
const table = "test"
const hashValues = [0, 1]

describe("searchByHash", () => {
  const params = { schema, table }

  it("should call axios with correct data", () => {
    const data = {
      operation: "search_by_hash",
      schema,
      table,
      hash_values: hashValues,
      get_attributes: ["*"],
    }

    const headers = {
      Authorization: `Basic ${Buffer.from(username + ":" + password).toString("base64")}`,
      "Content-Type": "application/json",
    }

    harperDb.searchByHash(hashValues, params)

    expect(mockAxios.post).toHaveBeenCalledWith(url, data, { headers })
  })

  it("should return array of records and 200 status on success", async () => {
    const promise = harperDb.searchByHash(hashValues, params)

    const data = [{ id: 0 }, { id: 1 }]

    const response = { data, status: 200 }
    mockAxios.mockResponse(response)

    const result = await promise

    expect(result.status).toBe(200)
    expect(result.records).toBe(data)
  })
})
