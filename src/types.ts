import type { ValidatorRules } from './rules'
import type { Value } from './validator-field'

type Fn = (value: Value) => string

export interface ValidatorRule {
  rule: (value: Value) => boolean
  message: string | Fn
}

export interface ErrorMessage {
  message: string
  isValid: boolean
}

export interface Validity {
  message: string
  isValid: boolean
  errors?: ErrorMessage[]
  id?: string | number
}

export interface FieldParams {
  value: Value
  rules: ValidatorRules
  required?: boolean
  id?: string | number
}
