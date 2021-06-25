/**
 * Required parameters to update a record
 */
export type UpdateParams = {
  /** schema where the table you are updating records into lives */
  schema: string

  /** table where you want to update records */
  table: string
}
