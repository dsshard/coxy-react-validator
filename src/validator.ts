import { Value } from './validator-field'
import { ValidatorRules } from './rules'
import { FieldParams, Validity } from './types'

export class Field {
  private rules: ValidatorRules
  private required: boolean
  private value: Value
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
    const { rules, value, required, id } = this

    const isEmptyValue = !value && parseFloat(value) !== 0

    if (!rules.length || (isEmptyValue && required === false)) {
      return { isValid, message, id }
    }
    rules.forEach((instance) => {
      if (isValid) {
        isValid = instance.rule(value)
        if (!isValid) {
          if (typeof instance.message === 'function') {
            message = instance.message(value)
          } else {
            message = instance.message
          }
        }
      }
    })
    return { isValid, message, id }
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
    let prevResult
    const statuses = this.fields.map((field) => {
      if (this.params?.stopAtFirstError && prevResult && prevResult.isValid === false) {
        return null
      }
      prevResult = field.validate()
      return prevResult
    })

    const errors = statuses.filter((inst) => inst && inst.isValid === false)

    if (errors.length) {
      const { isValid, message } = errors[0]
      return { isValid, message, errors }
    }
    return { isValid: true, message: '' }
  }
}
