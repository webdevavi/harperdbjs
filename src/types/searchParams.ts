/**
 * Required parameters to search records
 */
export type SearchParams = {
  /** schema where the table you are searching lives */
  schema: string

  /** table you wish to search */
  table: string

  /**
   * define which attributes you want returned. Use '*' to return all attributes
   *
   * Default value is '*'
   */
  getAttributes?: string[]
}
