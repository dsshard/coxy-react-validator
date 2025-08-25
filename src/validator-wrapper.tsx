import { forwardRef, type ReactNode, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'

import { Context, type RegisteredFieldHandle } from './context'
import type { Validity } from './types'
import { Validator } from './validator'

interface ComponentProps {
  children?: ReactNode
  stopAtFirstError?: boolean
}

export interface ValidatorWrapper {
  validate: () => Validity
  getField: (id: string | number) => RegisteredFieldHandle | null
  registerField: (field: RegisteredFieldHandle) => void
  unregisterField: (field: RegisteredFieldHandle) => void
  setCustomError: (customError: Validity) => void
  clearCustomErrors: () => void
}

export const ValidatorWrapper = forwardRef<ValidatorWrapper, ComponentProps>(function ValidatorWrapper(
  { children, stopAtFirstError },
  ref,
) {
  const fieldsRef = useRef<RegisteredFieldHandle[]>([])
  const [customErrors, setCustomErrors] = useState<Validity[]>([])

  const registerField = useCallback((field: RegisteredFieldHandle) => {
    if (field && !fieldsRef.current.includes(field)) {
      fieldsRef.current.push(field)
    }
  }, [])

  const unregisterField = useCallback((field: RegisteredFieldHandle) => {
    const index = fieldsRef.current.indexOf(field)
    if (index > -1) fieldsRef.current.splice(index, 1)
  }, [])

  const getField = useCallback<ValidatorWrapper['getField']>((id) => {
    return fieldsRef.current.find((field) => field?.props?.id === id) || null
  }, [])

  const setCustomError = useCallback<ValidatorWrapper['setCustomError']>((customError) => {
    setCustomErrors((prev) => [...prev, customError])
  }, [])

  const clearCustomErrors = useCallback<ValidatorWrapper['clearCustomErrors']>(() => {
    setCustomErrors([])
  }, [])

  const validate = useCallback<ValidatorWrapper['validate']>(() => {
    const validator = new Validator({ stopAtFirstError })
    for (const comp of fieldsRef.current) {
      validator.addField(comp.props)
    }
    return validator.validate()
  }, [stopAtFirstError])

  useImperativeHandle(
    ref,
    () => ({
      validate,
      getField,
      registerField,
      unregisterField,
      setCustomError,
      clearCustomErrors,
    }),
    [validate, getField, registerField, unregisterField, setCustomError, clearCustomErrors],
  )

  const contextValue = useMemo(
    () => ({ customErrors, registerField, unregisterField }),
    [customErrors, registerField, unregisterField],
  )

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
})
