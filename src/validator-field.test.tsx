/**
 * @jest-environment jsdom
 */

import { createRef, useEffect, useState } from 'react'
import { render, act } from '@testing-library/react'

import { ValidatorWrapper } from './validator-wrapper'
import { ValidatorField } from './validator-field'
import { rules } from './rules'

it('render without wrapper', () => {
  expect(() => shallow(<ValidatorField />)).toThrowError()
})

it('normal render', () => {
  render((
    <ValidatorWrapper>
      <ValidatorField rules={[]} value="" />
    </ValidatorWrapper>
  ))
})

it('check context validator', () => {
  const validator = createRef<ValidatorWrapper>()
  render((
    <ValidatorWrapper ref={validator}>
      <ValidatorField rules={[]} />
    </ValidatorWrapper>
  ))

  const validateResult = validator.current.validate()

  expect(validateResult.isValid).toBe(true)
  expect(validateResult.message).toBe('')
})

it('check failed validation', () => {
  const validator1 = createRef<ValidatorWrapper>()
  const validator2 = createRef<ValidatorWrapper>()

  render((
    <>
      <ValidatorWrapper ref={validator1}>
        <ValidatorField rules={rules.email} value="test" />
      </ValidatorWrapper>
      <ValidatorWrapper ref={validator2}>
        <ValidatorField rules={rules.email} value="" />
      </ValidatorWrapper>
    </>
  ))

  act(() => {
    const validateResult1 = validator1.current.validate()

    expect(validateResult1.isValid).toBe(false)
    expect(validateResult1.message).toBe('Email is invalid')
    expect(validateResult1.errors.length).toBe(1)

    const validateResult2 = validator2.current.validate()

    expect(validateResult2.isValid).toBe(false)
    expect(validateResult2.message).toBe('Email is required')
    expect(validateResult2.errors.length).toBe(1)
  })
})

jest.useFakeTimers()

it('check state change and hide field', () => {
  const validator1 = createRef<ValidatorWrapper>()

  function Comp () {
    const [st, setSt] = useState(true)

    useEffect(() => {
      setTimeout(() => {
        act(() => {
          setSt(false)
        })
      }, 100)
    }, [])

    return (
      <ValidatorWrapper ref={validator1}>
        <ValidatorField rules={rules.email} value="test" />
        {st && (
          <ValidatorField rules={rules.email} value="" />
        )}
      </ValidatorWrapper>
    )
  }

  render(<Comp />)

  jest.runAllTimers()

  const validateResult1 = validator1.current.validate()

  expect(validateResult1.isValid).toBe(false)
  expect(validateResult1.message).toBe('Email is invalid')
  expect(validateResult1.errors.length).toBe(1)
})

it('check success validation', () => {
  const validator = createRef<ValidatorWrapper>()
  render((
    <ValidatorWrapper ref={validator}>
      <ValidatorField rules={rules.email} value="email@email.com" />
    </ValidatorWrapper>
  ))

  const validateResult = validator.current.validate()

  expect(validateResult.isValid).toBe(true)
  expect(validateResult.message).toBe('')
})

it('check success validation fot child function', () => {
  const validator = createRef<ValidatorWrapper>()
  render((
    <ValidatorWrapper ref={validator}>
      <ValidatorField rules={rules.email} value="email@email.com">
        {({ isValid, message }) => (
          <>
            {!isValid && <div>{message}</div>}
          </>
        )}
      </ValidatorField>
    </ValidatorWrapper>
  ))

  const validateResult = validator.current.validate()

  expect(validateResult.isValid).toBe(true)
  expect(validateResult.message).toBe('')
})

it('check custom rule message function', () => {
  const validator = createRef<ValidatorWrapper>()
  const rule = [{
    rule: (value) => value !== 'test',
    message: (value) => `test message ${value}`
  }]
  render((
    <ValidatorWrapper ref={validator}>
      <ValidatorField rules={rule} value="test">
        {({ isValid, message }) => (
          <>
            {!isValid && <div>{message}</div>}
          </>
        )}
      </ValidatorField>
    </ValidatorWrapper>
  ))

  const validateResult = validator.current.validate()

  expect(validateResult.isValid).toBe(false)
  expect(validateResult.message).toBe('test message test')
})
