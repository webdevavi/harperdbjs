/**
 * Required parameters to insert new record
 */
export type InsertParams = {
  /** schema where the table you are inserting records into lives */
  schema: string

  /** table where you want to insert records */
  table: string
}
