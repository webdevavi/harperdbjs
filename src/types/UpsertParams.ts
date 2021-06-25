/**
 * Required parameters to upsert a record
 */
export type UpsertParams = {
  /** schema where the table you are upserting records into lives */
  schema: string

  /** table where you want to upsert records */
  table: string
}
