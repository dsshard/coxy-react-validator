/**
 * @jest-environment jsdom
 */

import { act, render } from '@testing-library/react'
import { createRef, useEffect, useState } from 'react'

import { rules } from './rules'
import { ValidatorField } from './validator-field'
import { ValidatorWrapper } from './validator-wrapper'

it('normal render', () => {
  render(
    <ValidatorWrapper>
      <ValidatorField rules={[]} value="" />
    </ValidatorWrapper>,
  )
})

it('check context validator', () => {
  const validator = createRef<ValidatorWrapper>()
  render(
    <ValidatorWrapper ref={validator}>
      <ValidatorField rules={[]} value="" />
    </ValidatorWrapper>,
  )

  const validateResult = validator.current.validate()

  expect(validateResult.isValid).toBe(true)
  expect(validateResult.message).toBe('')
})

it('check failed validation', () => {
  const validator1 = createRef<ValidatorWrapper>()
  const validator2 = createRef<ValidatorWrapper>()

  render(
    <>
      <ValidatorWrapper ref={validator1}>
        <ValidatorField rules={rules.email} value="test" />
      </ValidatorWrapper>
      <ValidatorWrapper ref={validator2}>
        <ValidatorField rules={rules.email} value="" />
      </ValidatorWrapper>
    </>,
  )

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

  function Comp() {
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
        {st && <ValidatorField rules={rules.email} value="" />}
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
  render(
    <ValidatorWrapper ref={validator}>
      <ValidatorField rules={rules.email} value="email@email.com" />
    </ValidatorWrapper>,
  )

  const validateResult = validator.current.validate()

  expect(validateResult.isValid).toBe(true)
  expect(validateResult.message).toBe('')
})

it('check success validation fot child function', () => {
  const validator = createRef<ValidatorWrapper>()
  render(
    <ValidatorWrapper ref={validator}>
      <ValidatorField rules={rules.email} value="email@email.com">
        {({ isValid, message }) => <>{!isValid && <div>{message}</div>}</>}
      </ValidatorField>
    </ValidatorWrapper>,
  )

  const validateResult = validator.current.validate()

  expect(validateResult.isValid).toBe(true)
  expect(validateResult.message).toBe('')
})

it('check custom rule message function', () => {
  const validator = createRef<ValidatorWrapper>()
  const rule = [
    {
      rule: (value: string) => value !== 'test',
      message: (value: string) => `test message ${value}`,
    },
  ]
  render(
    <ValidatorWrapper ref={validator}>
      <ValidatorField rules={rule} value="test">
        {({ isValid, message }) => <>{!isValid && <div>{message}</div>}</>}
      </ValidatorField>
    </ValidatorWrapper>,
  )

  const validateResult = validator.current.validate()

  expect(validateResult.isValid).toBe(false)
  expect(validateResult.message).toBe('test message test')
})

jest.useFakeTimers()

it('re-renders the same field to cover handleRef initialization false branch and else-validate path', () => {
  const validator = createRef<ValidatorWrapper>()

  function Comp() {
    const [val, setVal] = useState('')
    useEffect(() => {
      setTimeout(() => {
        act(() => setVal('abc'))
      }, 50)
    }, [])
    return (
      <ValidatorWrapper ref={validator}>
        <ValidatorField id="rerender" rules={rules.notEmpty} value={val}>
          {() => null}
        </ValidatorField>
      </ValidatorWrapper>
    )
  }

  render(<Comp />)
  // initial: invalid
  let field = validator.current.getField('rerender')
  expect(field.validate().isValid).toBe(false)

  jest.runAllTimers()
  field = validator.current.getField('rerender')
  expect(field.validate().isValid).toBe(true)
})
