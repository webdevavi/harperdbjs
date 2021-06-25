import axios from "axios"
import { Operations } from "../enums/operations"

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
   * @return {boolean} Returns true if created successfully, else false
   */
  async createSchema(schemaName: string): Promise<boolean> {
    const data = JSON.stringify({
      operation: Operations.CreateSchema,
      schema: schemaName,
    })

    const response = await axios.post(this.url, { data }, { headers: this.headers })

    return response.data.message === `Schema '${schemaName}' created successfully`
  }
}
