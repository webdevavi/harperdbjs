import { HarperDB } from "../../../src"
import mockAxios from "jest-mock-axios"

const url = "/my/url"
const username = "username"
const password = "password"

afterEach(mockAxios.reset)

const harperDb = new HarperDB({ url, username, password })
const schema = "dev"
const table = "test"
const attribute = "name"
const value = "jane doe"

describe("searchByValue", () => {
  const params = { schema, table }

  it("should call axios with correct data", () => {
    const data = {
      operation: "search_by_value",
      schema,
      table,
      search_attribute: attribute,
      search_value: value,
      get_attributes: ["*"],
    }

    const headers = {
      Authorization: `Basic ${Buffer.from(username + ":" + password).toString("base64")}`,
      "Content-Type": "application/json",
    }

    harperDb.searchByValue(attribute, value, params)

    expect(mockAxios.post).toHaveBeenCalledWith(url, data, { headers })
  })

  it("should return array of records and 200 status on success", async () => {
    const promise = harperDb.searchByValue(attribute, value, params)

    const data = [{ id: 0 }]

    const response = { data, status: 200 }
    mockAxios.mockResponse(response)

    const result = await promise

    expect(result.status).toBe(200)
    expect(result.records).toBe(data)
  })

  it("should make request with only the attributes mentioned in 'get_attributes' if other than '*'", async () => {
    const data = {
      operation: "search_by_value",
      schema,
      table,
      search_attribute: attribute,
      search_value: value,
      get_attributes: ["name"],
    }

    const headers = {
      Authorization: `Basic ${Buffer.from(username + ":" + password).toString("base64")}`,
      "Content-Type": "application/json",
    }

    harperDb.searchByValue(attribute, value, { ...params, getAttributes: ["name"] })

    expect(mockAxios.post).toHaveBeenCalledWith(url, data, { headers })
  })
})
