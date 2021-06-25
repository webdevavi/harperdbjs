import { SearchParams } from "./searchParams"

export type SearchByConditionParams = {
  operator?: "and" | "or"
  offset?: number
  limit?: number
} & SearchParams
