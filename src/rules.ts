import { z } from 'zod'

export type ValidatorRules = z.ZodType[] | z.ZodType

export const rules = {
  notEmpty: [z.string().min(1, { error: 'Field is required' })],
  isTrue: [z.boolean({ error: 'Value is required' }).and(z.literal(true))],
  email: [z.string().min(1, { error: 'Email is required' }), z.email({ message: 'Email is invalid' })],
}
