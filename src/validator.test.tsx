import { rules } from './rules'
import { Validator } from './validator'

it('check normal create validator', () => {
  const validator = new Validator()
  expect(typeof validator).toBe('object')
  expect(typeof validator.validate).toBe('function')
})

it('check normal add and remove fields', () => {
  const validator = new Validator({ stopAtFirstError: true })
  const fieldPassword = validator.addField({
    rules: rules.email,
    value: '',
    id: 'for-remove',
  })

  expect(typeof fieldPassword).toBe('object')

  const fieldSearchPassword = validator.getField('for-remove')

  expect(typeof fieldSearchPassword).toBe('object')
  expect(typeof fieldSearchPassword.validate).toBe('function')
  expect(fieldPassword.id === fieldSearchPassword.id).toBe(true)

  let newFieldSearchPassword = validator.getField('for-remove')
  validator.removeField(newFieldSearchPassword)
  newFieldSearchPassword = validator.getField('for-remove')
  expect(newFieldSearchPassword === null).toBe(true)
})

it('removeField does nothing when field is not registered', () => {
  const validator = new Validator()
  // create a field-like object that validator doesn't know about
  // import Field from the module is possible, but we can emulate shape using any
  // Should not throw and should not alter state
  // @ts-expect-error.
  expect(() => validator.removeField({})).not.toThrow()
  expect(validator.getField('unknown')).toBe(null)
})
