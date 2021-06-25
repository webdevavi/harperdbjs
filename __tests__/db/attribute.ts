import { HarperDB } from "../../src"
import mockAxios from "jest-mock-axios"

const url = "/my/url"
const username = "username"
const password = "password"

afterEach(mockAxios.reset)

const harperDb = new HarperDB({ url, username, password })
const schema = "dev"
const table = "test"
const attribute = "test_attribute"
const params = { schema, table, attribute }

describe("create attribute", () => {
  it("should call axios with correct data", () => {
    const data = {
      operation: "create_attribute",
      ...params,
    }

    const headers = {
      Authorization: `Basic ${Buffer.from(username + ":" + password).toString("base64")}`,
      "Content-Type": "application/json",
    }

    harperDb.createAttribute(params)

    expect(mockAxios.post).toHaveBeenCalledWith(url, data, { headers })
  })

  it("should return response message and 200 status on success", async () => {
    const promise = harperDb.createAttribute(params)

    const data = {
      message: "inserted 1 of 1 records",
      skipped_hashes: [],
      inserted_hashes: ["some-hash"],
    }

    const response = { data, status: 200 }
    mockAxios.mockResponse(response)

    const result = await promise

    expect(result.status).toBe(200)
    expect(result.message).toBe(data.message)
    expect(result.skipped_hashes).toBe(data.skipped_hashes)
    expect(result.inserted_hashes).toBe(data.inserted_hashes)
  })

  it("should return response error and status other than 200 on failure", async () => {
    const promise = harperDb.createAttribute(params)

    const error = `Schema '${schema}' does not exist`

    const response = { data: { error }, status: 500 }
    mockAxios.mockResponse(response)

    const result = await promise

    expect(result.status).not.toBe(200)
    expect(result.error).toBe(error)
  })
})

describe("drop attribute", () => {
  it("should call axios with correct data", () => {
    const data = {
      operation: "drop_attribute",
      ...params,
    }

    const headers = {
      Authorization: `Basic ${Buffer.from(username + ":" + password).toString("base64")}`,
      "Content-Type": "application/json",
    }

    harperDb.dropAttribute(params)

    expect(mockAxios.post).toHaveBeenCalledWith(url, data, { headers })
  })

  it("should return response message and 200 status on success", async () => {
    const promise = harperDb.dropAttribute(params)

    const message = `successfully deleted attribute '${attribute}'`

    const response = { data: { message }, status: 200 }
    mockAxios.mockResponse(response)

    const result = await promise

    expect(result.status).toBe(200)
    expect(result.message).toBe(message)
  })

  it("should return response error and status other than 200 on failure", async () => {
    const promise = harperDb.dropAttribute(params)

    const error = `table '${schema}.${table}' does not exist`

    const response = { data: { error }, status: 500 }
    mockAxios.mockResponse(response)

    const result = await promise

    expect(result.status).not.toBe(200)
    expect(result.error).toBe(error)
  })
})
