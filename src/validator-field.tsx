import { forwardRef, type ReactNode, useContext, useEffect, useRef } from 'react'
import type { FieldParams, Validity } from 'types'

import { Context, type RegisteredFieldHandle } from './context'
import { Field } from './validator'

// biome-ignore lint/suspicious/noExplicitAny: <need>
export type Value = any

type Fn = (validity: Validity, value: Value) => ReactNode

type Props = FieldParams & {
  children?: ReactNode | Fn
}

export const ValidatorField = forwardRef<unknown, Props>(function ValidatorField(props: Props, _ref) {
  const { children, value } = props
  const { customErrors, registerField, unregisterField } = useContext(Context)

  const propsRef = useRef(props)
  propsRef.current = props

  const customErrorsRef = useRef(customErrors)
  customErrorsRef.current = customErrors

  const handleRef = useRef<RegisteredFieldHandle | null>(null)
  if (!handleRef.current) {
    handleRef.current = {
      get props() {
        return propsRef.current
      },
      validate: () => {
        const curr = propsRef.current
        const customError = customErrorsRef.current.find((item) => item.id === curr.id)
        if (customError) {
          return customError
        }
        const field = new Field({
          rules: curr.rules,
          required: curr.required,
          value: curr.value,
          id: curr.id,
        })
        return field.validate()
      },
    }
  }

  useEffect(() => {
    registerField(handleRef.current as RegisteredFieldHandle)
    return () => {
      unregisterField(handleRef.current as RegisteredFieldHandle)
    }
  }, [registerField, unregisterField])

  const validity = handleRef.current.validate()

  return typeof children === 'function' ? (children as Fn)(validity, value) : (children as ReactNode)
})
