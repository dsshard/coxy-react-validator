import type { ZodSafeParseResult } from 'zod/index'
import type { ValidatorRules } from './rules'
import type { Value } from './validator-field'

export interface ErrorMessage {
  message: string
  isValid: boolean
}

export interface Validity {
  message: string
  isValid: boolean
  result: ZodSafeParseResult<unknown>
  id?: string | number
}

export interface FieldParams {
  value: Value
  rules: ValidatorRules
  required?: boolean
  id?: string | number
}
