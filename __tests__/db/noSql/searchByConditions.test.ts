import { HarperDB } from "../../../src"
import mockAxios from "jest-mock-axios"
import { SearchByConditionParams, SearchCondition } from "../../../src/types"

const url = "/my/url"
const username = "username"
const password = "password"

afterEach(mockAxios.reset)

const harperDb = new HarperDB({ url, username, password })
const schema = "dev"
const table = "test"
const conditions: SearchCondition[] = [
  {
    searchAttribute: "name",
    searchType: "contains",
    searchValue: "jane",
  },
]

describe("searchByConditions", () => {
  const params: SearchByConditionParams = { schema, table, offset: 1, limit: 10, operator: "and" }

  it("should call axios with correct data", () => {
    const data = {
      operation: "search_by_conditions",
      schema,
      table,
      operator: "and",
      offset: 1,
      limit: 10,
      get_attributes: ["*"],
      conditions: [
        {
          search_attribute: "name",
          search_type: "contains",
          search_value: "jane",
        },
      ],
    }

    const headers = {
      Authorization: `Basic ${Buffer.from(username + ":" + password).toString("base64")}`,
      "Content-Type": "application/json",
    }

    harperDb.searchByConditions(conditions, params)

    expect(mockAxios.post).toHaveBeenCalledWith(url, data, { headers })
  })

  it("should return array of records and 200 status on success", async () => {
    const promise = harperDb.searchByConditions(conditions, params)

    const data = [{ id: 0 }, { id: 1 }]

    const response = { data, status: 200 }
    mockAxios.mockResponse(response)

    const result = await promise

    expect(result.status).toBe(200)
    expect(result.records).toBe(data)
  })

  it("should make request with only the attributes mentioned in 'get_attributes' if other than '*'", async () => {
    const data = {
      operation: "search_by_conditions",
      schema,
      table,
      operator: "and",
      offset: 1,
      limit: 10,
      get_attributes: ["age"],
      conditions: [
        {
          search_attribute: "name",
          search_type: "contains",
          search_value: "jane",
        },
      ],
    }

    const headers = {
      Authorization: `Basic ${Buffer.from(username + ":" + password).toString("base64")}`,
      "Content-Type": "application/json",
    }

    harperDb.searchByConditions(conditions, { ...params, getAttributes: ["age"] })

    expect(mockAxios.post).toHaveBeenCalledWith(url, data, { headers })
  })
})
