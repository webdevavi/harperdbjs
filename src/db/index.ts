import axios from "axios"
import { Operations } from "../enums"
import { CreateTableParams, DeleteParams, DropTableParams, InsertParams, OperationReturnType, SearchByConditionParams, SearchCondition, SearchParams, SearchResponse, UpdateParams, UpsertParams } from "../types"
import { AttributeParams } from "../types/attributeParams"
import { stripUndefined, toSnakeCaseKeys } from "../utils"

export interface HarperDBAuth {
  url: string
  username?: string
  password?: string
  token?: string
}

/**
 * The main class to connect with HarperDB
 */
export class HarperDB {
  private url: string
  private username?: string | undefined
  private password?: string | undefined
  private token?: string | undefined

  /**
   *
   * @param {HarperDBAuth} options The authentication params to connect with HarperDB
   */
  constructor({ url, username, password, token }: HarperDBAuth) {
    if (!token && !username && !password) {
      throw new Error("Either a set of username and password or a token is required to authenticate with HarperDB.")
    }

    if ((username && !password) || (!username && password)) {
      throw new Error("Both username and password are required to authenticate with HarperDB.")
    }

    this.url = url
    this.username = username
    this.password = password
    this.token = token
  }

  /**
   * Generates the auth token with username and password
   * or returns the token if provided
   */
  get generatedToken(): string {
    return this.token ?? Buffer.from(this.username + ":" + this.password).toString("base64")
  }

  /**
   *
   * @return {any} Header with Authorization
   */
  private get headers() {
    return {
      Authorization: `Basic ${this.generatedToken}`,
      "Content-Type": "application/json",
    }
  }

  /**
   * The current auth options being used to connect with HarperDB
   *
   * @return {Partial<HarperDBAuth>} Auth options - url, username & password or token
   */
  get auth(): Partial<HarperDBAuth> {
    return stripUndefined({
      url: this.url,
      username: this.username,
      password: this.password,
      token: this.token,
    } as HarperDBAuth)
  }

  /**
   * Creates a new schema
   *
   * @param {string} schemaName The name of the schema to create
   * @return {Promise<OperationReturnType>} Returns response message/error from harperDB
   *
   * See documentation - https://docs.harperdb.io/#870ee548-972e-43cf-80e1-452ca7623392
   */
  async createSchema(schemaName: string): Promise<OperationReturnType> {
    const data = {
      operation: Operations.CreateSchema,
      schema: schemaName,
    }

    const response = await axios.post(this.url, data, { headers: this.headers })

    return { status: response.status, message: response.data.message as string | undefined, error: response.data.error as string | undefined }
  }

  /**
   * Drops a schema
   *
   * @param {string} schemaName The name of the schema to drop
   * @return {Promise<OperationReturnType>} Returns response message/error from harperDB
   *
   * See documentation https://docs.harperdb.io/#c35ebd0e-db60-43a9-ba26-b4973de8fac8
   */
  async dropSchema(schemaName: string): Promise<OperationReturnType> {
    const data = {
      operation: Operations.DropSchema,
      schema: schemaName,
    }

    const response = await axios.post(this.url, data, { headers: this.headers })

    return { status: response.status, message: response.data.message as string | undefined, error: response.data.error as string | undefined }
  }

  /**
   * Creates a new table
   *
   * @param {CreateTableParams} params The parameters required to create new table
   * @return {Promise<OperationReturnType>} Returns response message/error from harperDB
   *
   * See documentation - https://docs.harperdb.io/#e567871c-6c1c-44b5-9e68-9c89ea015502
   */
  async createTable(params: CreateTableParams): Promise<OperationReturnType> {
    const data = {
      operation: Operations.CreateTable,
      ...toSnakeCaseKeys(params),
    }

    const response = await axios.post(this.url, data, { headers: this.headers })

    return { status: response.status, message: response.data.message as string | undefined, error: response.data.error as string | undefined }
  }

  /**
   * Drops a table
   *
   * @param {DropTableParams} params The parameters required to drop table
   * @return {Promise<OperationReturnType>} Returns response message/error from harperDB
   *
   * See documentation - https://docs.harperdb.io/#68ff3823-9757-4775-9516-d94f9aa69a32
   */
  async dropTable(params: DropTableParams): Promise<OperationReturnType> {
    const data = {
      operation: Operations.DropTable,
      ...toSnakeCaseKeys(params),
    }

    const response = await axios.post(this.url, data, { headers: this.headers })

    return { status: response.status, message: response.data.message as string | undefined, error: response.data.error as string | undefined }
  }

  /**
   * Creates a new attribute
   *
   * **Note:** HarperDB will automatically create new attributes on insert and update if they do not already exist within the schema.
   *
   * @param {AttributeParams} params The parameters required to create new attribute
   * @return {Promise<OperationReturnType>} Returns response message/error from harperDB
   *
   *
   * @see documentation - https://docs.harperdb.io/#3bc2bde9-4ee4-4035-abc3-7caf07cde7b1
   */
  async createAttribute(params: AttributeParams): Promise<OperationReturnType> {
    const data = {
      operation: Operations.CreateAttribute,
      ...params,
    }

    const response = await axios.post(this.url, data, { headers: this.headers })

    return {
      status: response.status,
      message: response.data.message as string | undefined,
      error: response.data.error as string | undefined,
    }
  }

  /**
   * Drops an attribute
   *
   * **NOTE:** Dropping an attribute will delete all associated values in that table.
   *
   * @param {AttributeParams} params The parameters required to drop an attribute
   * @return {Promise<OperationReturnType>} Returns response message/error from harperDB
   *
   * @see documentation - https://docs.harperdb.io/#fd0a0871-2504-41e7-8498-205aced33355
   */
  async dropAttribute(params: AttributeParams): Promise<OperationReturnType> {
    const data = {
      operation: Operations.DropAttribute,
      ...params,
    }

    const response = await axios.post(this.url, data, { headers: this.headers })

    return { status: response.status, message: response.data.message as string | undefined, error: response.data.error as string | undefined }
  }

  /**
   * Inserts one record
   *
   * **Note:** Hash value of the inserted JSON record MUST be supplied on insert
   *
   * @param {Object} record The record to be inserted
   * @param {InsertParams} params The parameters required to insert new record
   * @return {Promise<OperationReturnType>} Returns response message/error from harperDB
   *
   *
   * @see documentation - https://docs.harperdb.io/#7edea7e9-f685-4ecf-83d9-5e38d3243c68
   */
  async insert<RecordType extends Object>(
    record: RecordType,
    params: InsertParams
  ): Promise<
    OperationReturnType<{
      // eslint-disable-next-line camelcase
      inserted_hashes?: (string | number)[]
      // eslint-disable-next-line camelcase
      skipped_hashes?: (string | number)[]
    }>
  > {
    const data = {
      operation: Operations.Insert,
      ...params,
      records: [record],
    }

    const response = await axios.post(this.url, data, { headers: this.headers })

    return {
      status: response.status,
      message: response.data.message as string | undefined,
      error: response.data.error as string | undefined,
      inserted_hashes: response.data.inserted_hashes as (string | number)[] | undefined,
      skipped_hashes: response.data.skipped_hashes as (string | number)[] | undefined,
    }
  }

  /**
   * Inserts one or more records
   *
   * **Note:** Hash value of the inserted JSON record MUST be supplied on insert
   *
   * @param {Array<Object>} records The records to be inserted
   * @param {InsertParams} params The parameters required to insert new record
   * @return {Promise<OperationReturnType>} Returns response message/error from harperDB
   *
   *
   * @see documentation - https://docs.harperdb.io/#7edea7e9-f685-4ecf-83d9-5e38d3243c68
   */
  async insertMany<RecordType extends Object>(
    records: RecordType[],
    params: InsertParams
  ): Promise<
    OperationReturnType<{
      // eslint-disable-next-line camelcase
      inserted_hashes?: (string | number)[]
      // eslint-disable-next-line camelcase
      skipped_hashes?: (string | number)[]
    }>
  > {
    const data = {
      operation: Operations.Insert,
      ...params,
      records,
    }

    const response = await axios.post(this.url, data, { headers: this.headers })

    return {
      status: response.status,
      message: response.data.message as string | undefined,
      error: response.data.error as string | undefined,
      inserted_hashes: response.data.inserted_hashes as (string | number)[] | undefined,
      skipped_hashes: response.data.skipped_hashes as (string | number)[] | undefined,
    }
  }

  /**
   * Updates one record
   *
   * **Note:** Hash value of the updated JSON record MUST be supplied on update
   *
   * @param {Object} record The record with hash attribute to be updated
   * @param {UpdateParams} params The parameters required to update new record
   * @return {Promise<OperationReturnType>} Returns response message/error from harperDB
   *
   *
   * @see documentation - https://docs.harperdb.io/#0876208f-a7e9-4b6a-838b-99d5e64ceec6
   */
  async updateOne<RecordType extends Object>(
    record: RecordType,
    params: UpdateParams
  ): Promise<
    OperationReturnType<{
      // eslint-disable-next-line camelcase
      update_hashes?: (string | number)[]
      // eslint-disable-next-line camelcase
      skipped_hashes?: (string | number)[]
    }>
  > {
    const data = {
      operation: Operations.Update,
      ...params,
      records: [record],
    }

    const response = await axios.post(this.url, data, { headers: this.headers })

    return {
      status: response.status,
      message: response.data.message as string | undefined,
      error: response.data.error as string | undefined,
      update_hashes: response.data.update_hashes as (string | number)[] | undefined,
      skipped_hashes: response.data.skipped_hashes as (string | number)[] | undefined,
    }
  }

  /**
   * Updates one or more records
   *
   * **Note:** Hash value of the updated JSON record MUST be supplied on update
   *
   * @param {Array<Object>} records The records with hash attributes to be updated
   * @param {UpdateParams} params The parameters required to update new record
   * @return {Promise<OperationReturnType>} Returns response message/error from harperDB
   *
   *
   * @see documentation - https://docs.harperdb.io/#0876208f-a7e9-4b6a-838b-99d5e64ceec6
   */
  async updateMany<RecordType extends Object>(
    records: RecordType[],
    params: UpdateParams
  ): Promise<
    OperationReturnType<{
      // eslint-disable-next-line camelcase
      update_hashes?: (string | number)[]
      // eslint-disable-next-line camelcase
      skipped_hashes?: (string | number)[]
    }>
  > {
    const data = {
      operation: Operations.Update,
      ...params,
      records,
    }

    const response = await axios.post(this.url, data, { headers: this.headers })

    return {
      status: response.status,
      message: response.data.message as string | undefined,
      error: response.data.error as string | undefined,
      update_hashes: response.data.update_hashes as (string | number)[] | undefined,
      skipped_hashes: response.data.skipped_hashes as (string | number)[] | undefined,
    }
  }

  /**
   * Upserts one record
   *
   * **Note:** Hash value of the updated JSON record MUST be supplied on upsert
   *
   * @param {Object} record The record with hash attribute to be upserted
   * @param {UpsertParams} params The parameters required to upsert new record
   * @return {Promise<OperationReturnType>} Returns response message/error from harperDB
   *
   *
   * @see documentation - https://docs.harperdb.io/#0876208f-a7e9-4b6a-838b-99d5e64ceec6
   */
  async upsertOne<RecordType extends Object>(
    record: RecordType,
    params: UpsertParams
  ): Promise<
    OperationReturnType<{
      // eslint-disable-next-line camelcase
      upserted_hashes?: (string | number)[]
      // eslint-disable-next-line camelcase
      skipped_hashes?: (string | number)[]
    }>
  > {
    const data = {
      operation: Operations.Upsert,
      ...params,
      records: [record],
    }

    const response = await axios.post(this.url, data, { headers: this.headers })

    return {
      status: response.status,
      message: response.data.message as string | undefined,
      error: response.data.error as string | undefined,
      upserted_hashes: response.data.upserted_hashes as (string | number)[] | undefined,
      skipped_hashes: response.data.skipped_hashes as (string | number)[] | undefined,
    }
  }

  /**
   * Upserts one or more records
   *
   * **Note:** Hash value of the updated JSON record MUST be supplied on upsert
   *
   * @param {Array<Object>} records The records with hash attributes to be upserted
   * @param {UpsertParams} params The parameters required to upsert new record
   * @return {Promise<OperationReturnType>} Returns response message/error from harperDB
   *
   *
   * @see documentation - https://docs.harperdb.io/#0876208f-a7e9-4b6a-838b-99d5e64ceec6
   */
  async upsertMany<RecordType extends Object>(
    records: RecordType[],
    params: UpsertParams
  ): Promise<
    OperationReturnType<{
      // eslint-disable-next-line camelcase
      upserted_hashes?: (string | number)[]
      // eslint-disable-next-line camelcase
      skipped_hashes?: (string | number)[]
    }>
  > {
    const data = {
      operation: Operations.Upsert,
      ...params,
      records,
    }

    const response = await axios.post(this.url, data, { headers: this.headers })

    return {
      status: response.status,
      message: response.data.message as string | undefined,
      error: response.data.error as string | undefined,
      upserted_hashes: response.data.upserted_hashes as (string | number)[] | undefined,
      skipped_hashes: response.data.skipped_hashes as (string | number)[] | undefined,
    }
  }

  /**
   * Deletes one record
   *
   * **Note:** Hash value of the deleted JSON record MUST be supplied on delete
   *
   * @param {string|number} hashValue The hash value of the record to be deleted
   * @param {DeleteParams} params The parameters required to delete a record
   * @return {Promise<OperationReturnType>} Returns response message/error from harperDB
   *
   *
   * @see documentation - https://docs.harperdb.io/#19936afa-df5c-46ae-abf4-0a0c4fc78e5e
   */
  async deleteOne(
    hashValue: string | number,
    params: DeleteParams
  ): Promise<
    OperationReturnType<{
      // eslint-disable-next-line camelcase
      deleted_hashes?: (string | number)[]
      // eslint-disable-next-line camelcase
      skipped_hashes?: (string | number)[]
    }>
  > {
    const data = {
      operation: Operations.Delete,
      ...params,
      hash_values: [hashValue],
    }

    const response = await axios.post(this.url, data, { headers: this.headers })

    return {
      status: response.status,
      message: response.data.message as string | undefined,
      error: response.data.error as string | undefined,
      deleted_hashes: response.data.deleted_hashes as (string | number)[] | undefined,
      skipped_hashes: response.data.skipped_hashes as (string | number)[] | undefined,
    }
  }

  /**
   * Deletes one or more records
   *
   * **Note:** Hash value of the deleted JSON records MUST be supplied on delete
   *
   * @param {Array<string|number>} hashValues The hash values of the records to be deleted
   * @param {DeleteParams} params The parameters required to delete a record
   * @return {Promise<OperationReturnType>} Returns response message/error from harperDB
   *
   *
   * @see documentation - https://docs.harperdb.io/#19936afa-df5c-46ae-abf4-0a0c4fc78e5e
   */
  async deleteMany(
    hashValues: (string | number)[],
    params: DeleteParams
  ): Promise<
    OperationReturnType<{
      // eslint-disable-next-line camelcase
      deleted_hashes?: (string | number)[]
      // eslint-disable-next-line camelcase
      skipped_hashes?: (string | number)[]
    }>
  > {
    const data = {
      operation: Operations.Delete,
      ...params,
      hash_values: hashValues,
    }

    const response = await axios.post(this.url, data, { headers: this.headers })

    return {
      status: response.status,
      message: response.data.message as string | undefined,
      error: response.data.error as string | undefined,
      deleted_hashes: response.data.deleted_hashes as (string | number)[] | undefined,
      skipped_hashes: response.data.skipped_hashes as (string | number)[] | undefined,
    }
  }

  /**
   * Searches for records with the provided hash values
   *
   * @param {Array<string|number>} hashValues The hash values of the records to be searched
   * @param {SearchParams} params The parameters required to search records
   * @return {Promise<OperationReturnType<SearchResponse>>} Returns array of found records
   *
   *
   * @see documentation - https://docs.harperdb.io/#286d4ebc-d85d-45e4-9bf4-8e33d907ed3d
   */
  async searchByHash(hashValues: (string | number)[], params: SearchParams): Promise<OperationReturnType<SearchResponse>> {
    const data = {
      operation: Operations.SearchByHash,
      get_attributes: ["*"],
      ...toSnakeCaseKeys(params),
      hash_values: hashValues,
    }

    const response = await axios.post(this.url, data, { headers: this.headers })

    return {
      status: response.status,
      records: response.data ?? [],
    }
  }

  /**
   * Searches for records with the provided attribute values
   *
   * @param {string} searchAttribute attribute you wish to search can be any attribute
   * @param {string} searchValue  value you wish to search - wild cards are allowed.
   * @param {SearchParams} params The parameters required to search records
   * @return {Promise<OperationReturnType<SearchResponse>>} Returns array of found records
   *
   *
   * @see documentation - https://docs.harperdb.io/#35367306-677c-40f3-bda0-172113a93a05
   */
  async searchByValue(searchAttribute: string, searchValue: unknown, params: SearchParams): Promise<OperationReturnType<SearchResponse>> {
    const data = {
      operation: Operations.SearchByValue,
      get_attributes: ["*"],
      ...toSnakeCaseKeys(params),
      search_attribute: searchAttribute,
      search_value: searchValue,
    }

    const response = await axios.post(this.url, data, { headers: this.headers })

    return {
      status: response.status,
      records: response.data ?? [],
    }
  }

  /**
   * Searches for records with the provided conditions
   *
   * @param {SearchCondition[]} searchConditions the array of conditions objects to filter by. Must include one or more object in the array.
   * @param {SearchByConditionParams} params The parameters required to search records
   * @return {Promise<OperationReturnType<SearchResponse>>} Returns array of found records
   *
   *
   * @see documentation - https://docs.harperdb.io/#35367306-677c-40f3-bda0-172113a93a05
   */
  async searchByConditions(searchConditions: SearchCondition[], params: SearchByConditionParams): Promise<OperationReturnType<SearchResponse>> {
    const data = {
      operation: Operations.SearchByConditions,
      get_attributes: ["*"],
      ...toSnakeCaseKeys(params),
      conditions: searchConditions.map((condition) => toSnakeCaseKeys(condition)),
    }

    const response = await axios.post(this.url, data, { headers: this.headers })

    return {
      status: response.status,
      records: response.data ?? [],
    }
  }
}
