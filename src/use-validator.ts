import type { ValidatorRules } from './rules'
import type { Validity } from './types'
import { Validator } from './validator'
import type { Value } from './validator-field'

export function useValidator(value: Value, rules: ValidatorRules): [boolean, Pick<Validity, 'message'>] {
  const validator = new Validator()
  validator.addField({ value, rules })
  const { isValid, ...validateObject } = validator.validate()
  return [isValid, validateObject]
}
