import { HarperDB } from "../../../src"
import mockAxios from "jest-mock-axios"

const url = "/my/url"
const username = "username"
const password = "password"

afterEach(mockAxios.reset)

const harperDb = new HarperDB({ url, username, password })
const schema = "dev"
const table = "test"
const hashValue = 0

describe("deleteOne", () => {
  const params = { schema, table }

  it("should call axios with correct data", () => {
    const data = {
      operation: "delete",
      schema,
      table,
      hash_values: [hashValue],
    }

    const headers = {
      Authorization: `Basic ${Buffer.from(username + ":" + password).toString("base64")}`,
      "Content-Type": "application/json",
    }

    harperDb.deleteOne(hashValue, params)

    expect(mockAxios.post).toHaveBeenCalledWith(url, data, { headers })
  })

  it("should return response message and 200 status on success", async () => {
    const promise = harperDb.deleteOne(hashValue, params)

    const message = "deleted 1 of 1 records"
    // eslint-disable-next-line camelcase
    const deleted_hashes = [0]
    // eslint-disable-next-line camelcase
    const skipped_hashes: (string | number)[] = []

    const response = { data: { message, deleted_hashes, skipped_hashes }, status: 200 }
    mockAxios.mockResponse(response)

    const result = await promise

    expect(result.status).toBe(200)
    expect(result.message).toBe(message)
    expect(result.deleted_hashes).toBe(deleted_hashes)
    expect(result.skipped_hashes).toBe(skipped_hashes)
  })
})
