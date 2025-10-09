import type { ZodSafeParseResult } from 'zod'
import type { ValidatorRules } from './rules'
import type { FieldParams, Validity } from './types'
import type { Value } from './validator-field'

export class Field {
  protected rules: ValidatorRules
  protected required: boolean
  protected value: Value
  public id: string | number

  constructor({ rules, required, value, id }: FieldParams) {
    this.rules = rules
    this.required = required
    this.value = value
    this.id = id
  }

  validate(): Validity {
    let isValid = true
    let message = ''
    const { value, required, id } = this
    let result: ZodSafeParseResult<unknown> = { success: true, data: value }

    const isEmptyValue = !value && Number.parseFloat(value) !== 0
    const rules = Array.isArray(this.rules) ? this.rules : [this.rules]

    if (!rules.length || (isEmptyValue && required === false)) {
      return {
        isValid,
        message,
        id,
        result: { success: true, data: value },
      }
    }
    for (const ruleItem of rules) {
      if (isValid && ruleItem && 'safeParse' in ruleItem) {
        // Handle Zod schemas
        result = ruleItem.safeParse(value)
        isValid = result.success
        if (!isValid && result.error) {
          message = result.error.issues[0]?.message || 'Validation error'
        }
      }
    }
    return { isValid, message, id, result }
  }
}

export interface ValidatorParams {
  stopAtFirstError: boolean
}

export class Validator {
  private fields: Field[]
  private params: ValidatorParams

  constructor(params?: ValidatorParams) {
    this.params = params || null
    this.fields = []
  }

  addField(params: FieldParams): Field {
    const field = new Field(params)
    this.fields.push(field)
    return field
  }

  removeField(field: Field): void {
    const index = this.fields.indexOf(field)
    if (index > -1) this.fields.splice(index, 1)
  }

  getField(id: Field['id']): Field {
    return this.fields.find((field) => field.id === id) || null
  }

  validate(): Validity {
    let prevResult: Validity | null
    const statuses = this.fields.map((field) => {
      if (this.params?.stopAtFirstError && prevResult && prevResult.isValid === false) {
        return null
      }
      prevResult = field.validate()
      return prevResult
    })

    const results = statuses.filter((inst) => inst && inst.isValid === false)

    if (results.length) {
      return results[0]
    }
    return { isValid: true, message: '', result: results[0]?.result }
  }
}
