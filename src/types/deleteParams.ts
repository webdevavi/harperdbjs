/**
 * Required parameters to delete a record
 */
export type DeleteParams = {
  /** schema where the table you are deleting records from lives */
  schema: string

  /** table where you want to delete records from */
  table: string
}
