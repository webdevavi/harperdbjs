import axios from "axios"
import { Operations } from "../enums"
import { CreateTableParams, DropTableParams, OperationReturnType } from "../types"
import { toSnakeCaseKeys } from "../utils"
export interface HarperDBAuth {
  url: string
  username: string
  password: string
}

export interface IHarperDB {
  get auth(): HarperDBAuth
}

/**
 * The main class to connect with HarperDB
 */
export class HarperDB implements IHarperDB {
  private url: string
  private username: string
  private password: string

  /**
   *
   * @param {HarperDBAuth} options The authentication params to connect with HarperDB
   */
  constructor({ url, username, password }: HarperDBAuth) {
    this.url = url
    this.username = username
    this.password = password
  }

  /**
   *
   * @return {any} Header with Authorization
   */
  private get headers() {
    return {
      Authorization: `Basic ${Buffer.from(this.username + ":" + this.password).toString("base64")}`,
      "Content-Type": "application/json",
    }
  }

  /**
   * The current auth options being used to connect with HarperDB
   *
   * @return {HarperDBAuth} Auth options - url, username & password
   */
  get auth(): HarperDBAuth {
    return {
      url: this.url,
      username: this.username,
      password: this.password,
    }
  }

  /**
   * Creates a new schema
   *
   * @param {string} schemaName The name of the schema to create
   * @return {Promise} Returns response message/error from harperDB
   *
   * See documentation - https://docs.harperdb.io/#870ee548-972e-43cf-80e1-452ca7623392
   */
  async createSchema(schemaName: string): Promise<OperationReturnType<{ message: string | undefined; error: string | undefined }>> {
    const data = JSON.stringify({
      operation: Operations.CreateSchema,
      schema: schemaName,
    })

    const response = await axios.post(this.url, { data }, { headers: this.headers })

    return { status: response.status, message: response.data.message as string | undefined, error: response.data.error as string | undefined }
  }

  /**
   * Drops a schema
   *
   * @param {string} schemaName The name of the schema to drop
   * @return {Promise} Returns response message/error from harperDB
   *
   * See documentation https://docs.harperdb.io/#c35ebd0e-db60-43a9-ba26-b4973de8fac8
   */
  async dropSchema(schemaName: string): Promise<OperationReturnType<{ message: string | undefined; error: string | undefined }>> {
    const data = JSON.stringify({
      operation: Operations.DropSchema,
      schema: schemaName,
    })

    const response = await axios.post(this.url, { data }, { headers: this.headers })

    return { status: response.status, message: response.data.message as string | undefined, error: response.data.error as string | undefined }
  }

  /**
   * Creates a new table
   *
   * @param {CreateTableParams} params The parameters required to create new table
   * @return {Promise} Returns response message/error from harperDB
   *
   * See documentation - https://docs.harperdb.io/#e567871c-6c1c-44b5-9e68-9c89ea015502
   */
  async createTable(params: CreateTableParams): Promise<OperationReturnType<{ message: string | undefined; error: string | undefined }>> {
    const data = JSON.stringify({
      operation: Operations.CreateTable,
      ...toSnakeCaseKeys(params),
    })

    const response = await axios.post(this.url, { data }, { headers: this.headers })

    return { status: response.status, message: response.data.message as string | undefined, error: response.data.error as string | undefined }
  }

  /**
   * Drops a table
   *
   * @param {DropTableParams} params The parameters required to drop table
   * @return {Promise} Returns response message/error from harperDB
   *
   * See documentation - https://docs.harperdb.io/#68ff3823-9757-4775-9516-d94f9aa69a32
   */
  async dropTable(params: DropTableParams): Promise<OperationReturnType<{ message: string | undefined; error: string | undefined }>> {
    const data = JSON.stringify({
      operation: Operations.DropTable,
      ...toSnakeCaseKeys(params),
    })

    const response = await axios.post(this.url, { data }, { headers: this.headers })

    return { status: response.status, message: response.data.message as string | undefined, error: response.data.error as string | undefined }
  }
}
