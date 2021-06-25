import { snakeCase } from "snake-case"

export const toSnakeCaseKeys = <Type extends Object>(object: Type) => {
  const keys = Object.keys(object)

  const objectWithSnakeCaseKeys: Record<string, any> = {}

  keys.forEach((key) => {
    objectWithSnakeCaseKeys[snakeCase(key)] = object[key as keyof Type]
  })

  return objectWithSnakeCaseKeys
}
