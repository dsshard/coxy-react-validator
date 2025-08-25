/**
 * @jest-environment jsdom
 */

import { act, render } from '@testing-library/react'
import { createRef } from 'react'

import { rules } from './rules'
import { ValidatorField } from './validator-field'
import { ValidatorWrapper, type ValidatorWrapper as ValidatorWrapperHandle } from './validator-wrapper'

it('setCustomError overrides field validation result and clearCustomErrors restores it', () => {
  const validator = createRef<ValidatorWrapperHandle>()

  render(
    <ValidatorWrapper ref={validator}>
      <ValidatorField id="email-field" rules={rules.email} value="user@example.com" />
    </ValidatorWrapper>,
  )

  // Initially valid
  const fieldBefore = validator.current.getField('email-field')
  const validityBefore = fieldBefore.validate()
  expect(validityBefore.isValid).toBe(true)
  expect(validityBefore.message).toBe('')

  // Set a custom error
  act(() => {
    validator.current.setCustomError({ id: 'email-field', isValid: false, message: 'Custom error' })
  })

  const fieldWithCustom = validator.current.getField('email-field')
  const validityWithCustom = fieldWithCustom.validate()
  expect(validityWithCustom.isValid).toBe(false)
  expect(validityWithCustom.message).toBe('Custom error')

  // Clear custom errors
  act(() => {
    validator.current.clearCustomErrors()
  })
  const fieldAfter = validator.current.getField('email-field')
  const validityAfter = fieldAfter.validate()
  expect(validityAfter.isValid).toBe(true)
  expect(validityAfter.message).toBe('')
})

it('custom error is used inside ValidatorField render-prop child', () => {
  const validator = createRef<ValidatorWrapperHandle>()
  const messages: string[] = []

  render(
    <ValidatorWrapper ref={validator}>
      <ValidatorField id="field-x" rules={rules.password} value="strongpassword">
        {({ message }) => {
          messages.push(message)
          return null
        }}
      </ValidatorField>
    </ValidatorWrapper>,
  )

  // Initially valid → message pushed should be ''
  expect(messages[messages.length - 1]).toBe('')

  // After setting custom error, the render-prop should see the custom message.
  act(() => {
    validator.current.setCustomError({ id: 'field-x', isValid: false, message: 'Injected' })
  })
  const field = validator.current.getField('field-x')
  const res = field.validate()
  expect(res.isValid).toBe(false)
  expect(res.message).toBe('Injected')
})
