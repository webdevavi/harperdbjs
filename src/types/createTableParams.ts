/**
 * Required parameters to create a table
 */
export type CreateTableParams = {
  /** name of the schema where you want your table to live */
  schema: string

  /** name of the table you are creating */
  table: string

  /** hash for the table */
  hashAttribute: string
}
