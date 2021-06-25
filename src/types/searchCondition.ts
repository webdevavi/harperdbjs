/** The conditions object used to filter records by while search */
export interface SearchCondition {
  /** the attribute you wish to search, can be any attribute. */
  searchAttribute: string

  /** the type of search to perform  */
  searchType: "equals" | "contains" | "starts_with" | "ends_with" | "greater_than" | "greater_than_equal" | "less_than" | "less_than_equal" | "between"

  /** value you wish to search. If the search_type is 'between' then use an array of two values to search between. */
  searchValue: unknown
}
