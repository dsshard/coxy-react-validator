import type { ZodSafeParseResult } from 'zod'
import { rules } from './rules'

it('check rule email', () => {
  expect(rules.email.length).toBe(2)

  let result: ZodSafeParseResult<string>
  // email.length > 0
  result = rules.email[0].safeParse('test')
  expect(result.success).toBe(true)

  // email check regexp
  result = rules.email[1].safeParse('test')
  expect(result.success).toBe(false)

  // email check regexp
  result = rules.email[1].safeParse('test@gmail.com')
  expect(result.success).toBe(true)
})

it('check rule bool', () => {
  expect(rules.isTrue.length).toBe(1)

  const result = rules.isTrue[0].safeParse(true)
  expect(result.success).toBe(true)
})

it('check rule notEmpty', () => {
  expect(rules.notEmpty.length).toBe(1)

  let result: ZodSafeParseResult<string>
  result = rules.notEmpty[0].safeParse('')
  expect(result.success).toBe(false)

  result = rules.notEmpty[0].safeParse('test')
  expect(result.success).toBe(true)
})
