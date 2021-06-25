import omitBy from "lodash.omitby"
import isUndefined from "lodash.isundefined"

export const stripUndefined = <T extends Object>(object: T): Partial<T> => {
  return omitBy(object, isUndefined) as Partial<T>
}
