import { HarperDB } from "../../../src"
import mockAxios from "jest-mock-axios"

const url = "/my/url"
const username = "username"
const password = "password"

afterEach(mockAxios.reset)

const harperDb = new HarperDB({ url, username, password })
const schema = "dev"
const table = "test"
const records = [
  { id: 0, name: "john doe", age: 28 },
  { id: 1, name: "jane doe", age: 27 },
]

describe("updateMany", () => {
  const params = { schema, table }

  it("should call axios with correct data", () => {
    const data = {
      operation: "update",
      schema,
      table,
      records,
    }

    const headers = {
      Authorization: `Basic ${Buffer.from(username + ":" + password).toString("base64")}`,
      "Content-Type": "application/json",
    }

    harperDb.updateMany(records, params)

    expect(mockAxios.post).toHaveBeenCalledWith(url, data, { headers })
  })

  it("should return response message and 200 status on success", async () => {
    const promise = harperDb.updateMany(records, params)

    const message = "updated 2 of 2 records"
    // eslint-disable-next-line camelcase
    const update_hashes = [0, 1]
    // eslint-disable-next-line camelcase
    const skipped_hashes: (string | number)[] = []

    const response = { data: { message, update_hashes, skipped_hashes }, status: 200 }
    mockAxios.mockResponse(response)

    const result = await promise

    expect(result.status).toBe(200)
    expect(result.message).toBe(message)
    expect(result.update_hashes).toBe(update_hashes)
    expect(result.skipped_hashes).toBe(skipped_hashes)
  })
})
