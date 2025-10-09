/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'
import { createRef } from 'react'
import type { Validity } from 'types'
import { rules } from './rules'
import { ValidatorField } from './validator-field'
import { ValidatorWrapper } from './validator-wrapper'

it('check wrapper validator', () => {
  const validator = createRef<ValidatorWrapper>()
  render(
    <ValidatorWrapper ref={validator}>
      <ValidatorField rules={[]} value="" />
      <ValidatorField rules={[]} value="" />
      <ValidatorField rules={[]} value="" />
      <ValidatorField rules={[]} value="" />
      <ValidatorField rules={[]} value="" />
      <ValidatorField rules={[]} value="" />
    </ValidatorWrapper>,
  )

  expect(typeof validator.current).toBe('object')
  expect(typeof validator.current.validate).toBe('function')
})

it('check getField validator', () => {
  const validator = createRef<ValidatorWrapper>()
  render(
    <ValidatorWrapper ref={validator}>
      <ValidatorField rules={[]} id="test" value="" />
      <ValidatorField rules={[]} id="test-fields" value="" />
    </ValidatorWrapper>,
  )
  expect(typeof validator.current.getField).toBe('function')
  const field = validator.current.getField('test')

  expect(typeof field.validate).toBe('function')
  const fieldValidate = field.validate()

  expect(fieldValidate.isValid).toBe(true)
  expect(fieldValidate.message).toBe('')
})

it('check getField undefined field', () => {
  const validator = createRef<ValidatorWrapper>()
  render(
    <ValidatorWrapper ref={validator}>
      <ValidatorField rules={[]} id="test-empty-field" value="" />
    </ValidatorWrapper>,
  )

  const field = validator.current.getField('8')
  expect(field).toBe(null)
})

it('check stopAtFirstError validator', () => {
  const validator = createRef<ValidatorWrapper>()
  render(
    <ValidatorWrapper ref={validator} stopAtFirstError>
      <ValidatorField rules={[]} value="test" />
      <ValidatorField rules={rules.email} value="test" />
      <ValidatorField rules={rules.isTrue} value={false} />
    </ValidatorWrapper>,
  )

  const fieldValidate = validator.current.validate()
  expect(fieldValidate.isValid).toBe(false)
  expect(fieldValidate.message).toBe('Email is invalid')
})

it('check unregisterField, registerField', () => {
  const validator = createRef<ValidatorWrapper>()
  render(
    <ValidatorWrapper ref={validator}>
      <ValidatorField rules={[]} id="test-register-field" value="" />
    </ValidatorWrapper>,
  )

  expect(typeof validator.current.registerField).toBe('function')
  expect(typeof validator.current.unregisterField).toBe('function')
})

it('check filed in field', () => {
  const validator = createRef<ValidatorWrapper>()
  render(
    <ValidatorWrapper ref={validator}>
      <ValidatorField rules={[]} value="">
        <ValidatorField rules={[]} id="check-validate-field-1" value="" />
        <ValidatorField rules={[]} id="check-validate-field-2" value="" />
      </ValidatorField>
    </ValidatorWrapper>,
  )

  expect(typeof validator.current).toBe('object')
  expect(typeof validator.current.validate).toBe('function')
  const result = validator.current.validate()
  expect(result.isValid).toBe(true)
})

it('check wrapper in wrapper', () => {
  const validatorOut = createRef<ValidatorWrapper>()
  const validatorIn = createRef<ValidatorWrapper>()
  render(
    <ValidatorWrapper ref={validatorOut}>
      <ValidatorField rules={rules.email} value="" />
      <ValidatorWrapper ref={validatorIn}>
        <ValidatorField rules={rules.isTrue} value={true} />
      </ValidatorWrapper>
    </ValidatorWrapper>,
  )
  expect(validatorIn.current.validate().isValid).toBe(true)
  expect(validatorOut.current.validate().isValid).toBe(false)
})

it('check two validators', () => {
  const validatorSuccess = createRef<ValidatorWrapper>()
  const validatorFailed = createRef<ValidatorWrapper>()
  render(
    <>
      <ValidatorWrapper ref={validatorSuccess}>
        <ValidatorField rules={rules.notEmpty} value="successpasswword" />
      </ValidatorWrapper>
      <ValidatorWrapper ref={validatorFailed}>
        <ValidatorField rules={rules.email} value="" />
      </ValidatorWrapper>
    </>,
  )

  expect(validatorFailed.current.validate().isValid).toBe(false)
  expect(validatorSuccess.current.validate().isValid).toBe(true)
})

it('covers registerField duplicate and unregisterField non-existing branches', () => {
  const validator = createRef<ValidatorWrapper>()
  render(
    <ValidatorWrapper ref={validator}>
      <ValidatorField rules={[]} id="dup-field" value="" />
    </ValidatorWrapper>,
  )

  const handle = validator.current.getField('dup-field')
  validator.current.registerField(handle)
  validator.current.unregisterField(handle)
  const dummy = {
    props: { value: '', rules: [], id: 'dummy' },
    validate: (): Validity => ({ isValid: true, message: '', result: { success: true, data: null } }),
  }
  validator.current.unregisterField(dummy)
})
