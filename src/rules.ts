import { ValidatorRule } from './types'

// eslint-disable-next-line
const emailReg =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export type ValidatorRules = ValidatorRule[]

export const rules = {
  notEmpty: [
    {
      rule: (value) => value !== '' && value.length > 0,
      message: 'Value is required',
    },
  ],

  bool: [
    {
      rule: (value) => !!value,
      message: 'Value is required',
    },
  ],

  password: [
    {
      rule: (value) => value.length > 0,
      message: 'Password field cannot be empty',
    },
    {
      rule: (value) => value.length > 5,
      message: 'Password field can not be less than 6 characters',
    },
  ],

  email: [
    {
      rule: (value) => !!value && value !== '' && value.length !== 0,
      message: 'Email is required',
    },
    {
      rule: (value) => emailReg.test(String(value).toLowerCase()),
      message: 'Email is invalid',
    },
  ],

  min: (min) => [
    {
      rule: (value) => parseFloat(value) > min,
      message: `The value must be greater than ${min}`,
    },
  ],

  max: (max) => [
    {
      rule: (value) => parseFloat(value) < max,
      message: `The value must be smaller ${max}`,
    },
  ],

  length: (min, max?) => [
    {
      rule: (value) => String(value).length >= min,
      message: `No less than ${min} symbols`,
    },
    {
      rule: (value) => (max !== undefined ? String(value).length <= max : true),
      message: `No more than ${max} symbols`,
    },
  ],
}
