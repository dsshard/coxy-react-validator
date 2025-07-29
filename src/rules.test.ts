import { rules } from './rules'

it('check rule email', () => {
  expect(rules.email.length).toBe(2)

  let result: boolean
  // email.length > 0
  result = rules.email[0].rule('test')
  expect(result).toBe(true)

  // email check regexp
  result = rules.email[1].rule('test')
  expect(result).toBe(false)

  // email check regexp
  result = rules.email[1].rule('test@gmail.com')
  expect(result).toBe(true)
})

it('check rule password', () => {
  expect(rules.password.length).toBe(2)

  let result: boolean
  // password.length > 0
  result = rules.password[0].rule('test')
  expect(result).toBe(true)

  // password.length > 5
  result = rules.password[1].rule('test')
  expect(result).toBe(false)
})

it('check rule bool', () => {
  expect(rules.bool.length).toBe(1)

  const result = rules.bool[0].rule(true)
  expect(result).toBe(true)
})

it('check rule notEmpty', () => {
  expect(rules.notEmpty.length).toBe(1)

  let result: boolean
  result = rules.notEmpty[0].rule('')
  expect(result).toBe(false)

  result = rules.notEmpty[0].rule('test')
  expect(result).toBe(true)
})

it('check rule min', () => {
  expect(rules.min(1).length).toBe(1)
  expect(typeof rules.min).toBe('function')

  let result: boolean
  result = rules.min(10)[0].rule('')
  expect(result).toBe(false)

  result = rules.min(9)[0].rule('testtesttest')
  expect(result).toBe(false)

  result = rules.min(9)[0].rule('11')
  expect(result).toBe(true)

  result = rules.min(9)[0].rule(10)
  expect(result).toBe(true)

  result = rules.min(9)[0].rule('8')
  expect(result).toBe(false)

  result = rules.min(9)[0].rule(7)
  expect(result).toBe(false)

  result = rules.min(-1)[0].rule('')
  expect(result).toBe(false)
})

it('check rule max', () => {
  let result: boolean
  result = rules.max(10)[0].rule('')
  expect(result).toBe(false)

  result = rules.max(9)[0].rule('testtesttest')
  expect(result).toBe(false)

  result = rules.max(9)[0].rule('11')
  expect(result).toBe(false)

  result = rules.max(9)[0].rule(10)
  expect(result).toBe(false)

  result = rules.max(9)[0].rule('5')
  expect(result).toBe(true)

  result = rules.max(9)[0].rule(5)
  expect(result).toBe(true)

  result = rules.max(-1)[0].rule('')
  expect(result).toBe(false)
})

it('check rule length', () => {
  let result: boolean
  result = rules.length(1)[0].rule('')
  expect(result).toBe(false)

  result = rules.length(1)[0].rule('1')
  expect(result).toBe(true)

  result = rules.length(1, 10)[0].rule('testtesttest')
  expect(result).toBe(true)

  result = rules.length(1, 10)[1].rule('testtesttest')
  expect(result).toBe(false)

  result = rules.length(1, 10)[0].rule('lol')
  expect(result).toBe(true)

  result = rules.length(1, 10)[1].rule('lol')
  expect(result).toBe(true)

  result = rules.length(1)[1].rule('test undefined 2 param')
  expect(result).toBe(true)

  result = rules.length(10)[0].rule('tes')
  expect(result).toBe(false)
})
