/**
 * Required parameters to create or drop an attribute
 */
export type AttributeParams = {
  /**  name of the schema of the table you want to add your attribute */
  schema: string

  /** name of the table where you want to add your attribute to live */
  table: string

  /** name for the attribute */
  attribute: string
}
