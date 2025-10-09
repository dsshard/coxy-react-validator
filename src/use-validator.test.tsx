/**
 * @jest-environment jsdom
 */

import { act, render, screen } from '@testing-library/react'
import { useEffect, useState } from 'react'

import { rules } from './rules'
import { useValidator } from './use-validator'

let container: HTMLDivElement | null
beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  container.remove()
  container = null
})

jest.useFakeTimers()

it('check state change and hide field', () => {
  function Comp() {
    const [value, setValue] = useState(false)
    const [isValid, validateObject] = useValidator(value, rules.isTrue)

    useEffect(() => {
      setTimeout(() => {
        act(() => {
          setValue(true)
        })
      }, 200)
    }, [])

    return (
      <>
        <span data-testid="test1">{isValid ? 'true' : 'false'}</span>
        <span data-testid="test2">{validateObject.message || 'true'}</span>
      </>
    )
  }
  act(() => {
    render(<Comp />)
  })

  expect(screen.getByTestId('test1').textContent).toContain('false')
  expect(screen.getByTestId('test2').textContent).toContain('Invalid input: expected true')

  jest.runAllTimers()

  expect(screen.getByTestId('test1').textContent).toContain('true')
  expect(screen.getByTestId('test2').textContent).toContain('true')
})
