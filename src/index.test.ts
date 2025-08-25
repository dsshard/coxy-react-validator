import { rules, ValidatorField, ValidatorWrapper } from './index'

it('renders with or without a name', () => {
  expect(typeof ValidatorWrapper).toBe('object')
  expect(typeof ValidatorField).toBe('object')
  expect(typeof rules).toBe('object')
})
