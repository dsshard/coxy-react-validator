import { rules, useValidator, Validator, ValidatorField, ValidatorWrapper } from './index'

it('exports surface is available', () => {
  expect(typeof ValidatorWrapper).toBe('object')
  expect(typeof ValidatorField).toBe('object')
  expect(typeof rules).toBe('object')
  expect(typeof Validator).toBe('function')
  expect(typeof useValidator).toBe('function')
})

it('use exports to execute a basic validation flow', () => {
  // use Validator (class)
  const validator = new Validator()
  validator.addField({ value: 'test@example.com', rules: rules.email })
  const res = validator.validate()
  expect(res.isValid).toBe(true)

  // use useValidator (hook-like util function)
  const [isValid, { message }] = useValidator('bad-email', rules.email)
  expect(isValid).toBe(false)
  expect(message).toBe('Email is invalid')
})
