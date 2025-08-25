import { createContext } from 'react'

import type { FieldParams, Validity } from './types'

export interface RegisteredFieldHandle {
  props: FieldParams
  validate: () => Validity
}

export const Context = createContext<{
  registerField: (field: RegisteredFieldHandle) => void
  unregisterField: (field: RegisteredFieldHandle) => void
  customErrors: Array<Validity>
}>(null)
